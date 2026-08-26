import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

import { parseExportPdfRequestPayload } from "@/lib/pdf/export-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const requestOrigin = getRequestOrigin(request);
    const htmlDocument = `<!doctype html>
                            <html>
                              <head>
                                <meta charset="utf-8" />
                                <meta name="viewport" content="width=device-width, initial-scale=1" />
                                <base href="${requestOrigin}/" />
                                <style>
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
      width: 794,
      height: 1122,
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
    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
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
