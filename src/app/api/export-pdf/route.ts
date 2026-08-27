import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

import { parseExportPdfRequestPayload } from "@/lib/pdf/export-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const PDF_VIEWPORT_WIDTH = 794;
const PDF_VIEWPORT_HEIGHT = 1122;
const PDF_MARGIN = { top: "0px", right: "0px", bottom: "0px", left: "0px" };

const debugLog = (
  hypothesisId: string,
  location: string,
  message: string,
  data: unknown,
): void => {
  // #region agent log
  fetch("http://127.0.0.1:7533/ingest/697de5ed-b01c-4b5c-a45d-a154083d2341", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "1c5af6",
    },
    body: JSON.stringify({
      sessionId: "1c5af6",
      runId: "page-padding-debug",
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => { });
  // #endregion
};

const getRequestOrigin = (request: Request): string => {
  return new URL(request.url).origin;
};

const createFilename = (fullName: string): string => {
  const base =
    fullName
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase() || "cv";
  const dayStamp = new Date().toISOString().slice(0, 10);
  return `${base}-${dayStamp}.pdf`;
};

export const POST = async (request: Request): Promise<Response> => {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const rawBody = await request.json();
    const payload = parseExportPdfRequestPayload(rawBody);
    debugLog("H9", "route.ts:POST:payload", "Captured payload size", {
      snapshotLength: payload.snapshotHtml.length,
      stylesLength: payload.stylesHtml.length,
    });
    const requestOrigin = getRequestOrigin(request);
    const htmlDocument = `<!doctype html>
                            <html>
                              <head>
                                <meta charset="utf-8" />
                                <meta name="viewport" content="width=device-width, initial-scale=1" />
                                <base href="${requestOrigin}/" />
                                ${payload.stylesHtml}
                                <style>
                                  @page {
                                    margin-top: 25px;
                                    margin-bottom: 25px;
                                    margin-left: 0;
                                    margin-right: 0;
                                  }
                                  @page :first {
                                    margin-top: 0;
                                    margin-bottom: 0;
                                  }
                                  html, body {
                                    margin: 0;
                                    padding: 0;
                                    width: 794px;
                                    background: #ffffff;
                                  }
                                  [data-export-preview-root] {
                                    width: 794px;
                                    max-width: 794px;
                                    box-sizing: border-box;
                                    margin: 0;
                                  }
                                </style>
                              </head>
                              <body>
                                ${payload.snapshotHtml}
                              </body>
                            </html>`;

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: PDF_VIEWPORT_WIDTH,
      height: PDF_VIEWPORT_HEIGHT,
      deviceScaleFactor: 2,
    });
    await page.setContent(htmlDocument, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForSelector("[data-export-preview-root]", {
      timeout: 60000,
    });
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 60000 });
    await page.evaluate(async () => {
      if ("fonts" in document) {
        await document.fonts.ready;
      }
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
    });
    const renderMetrics = await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>("[data-export-preview-root]");
      const name = root?.querySelector("h1") ?? null;
      const headline = root?.querySelector("p") ?? null;
      if (!root) {
        return null;
      }
      const bodyStyle = window.getComputedStyle(document.body);
      return {
        bodyMargin: window.getComputedStyle(document.body).margin,
        bodyPaddingTop: bodyStyle.paddingTop,
        bodyPaddingBottom: bodyStyle.paddingBottom,
        rootWidth: root.clientWidth,
        rootHeight: root.clientHeight,
        rootScrollHeight: root.scrollHeight,
        estimatedPages: Math.ceil(root.scrollHeight / window.innerHeight),
        rootFontSize: window.getComputedStyle(root).fontSize,
        nameFontSize: name ? window.getComputedStyle(name).fontSize : null,
        headlineFontSize: headline
          ? window.getComputedStyle(headline).fontSize
          : null,
      };
    });
    debugLog(
      "H7",
      "route.ts:POST:renderMetrics",
      "Captured server render geometry and typography",
      renderMetrics,
    );
    debugLog("H17", "route.ts:POST:pdfOptions", "Captured PDF margin options", {
      viewportWidth: PDF_VIEWPORT_WIDTH,
      viewportHeight: PDF_VIEWPORT_HEIGHT,
      pdfMargin: PDF_MARGIN,
    });
    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: PDF_MARGIN,
    });
    const filename = createFilename(payload.viewModel.identity.fullName);

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected PDF export error.";
    return NextResponse.json({ error: message }, { status: 400 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
