import type { ReactNode } from "react";

import styles from "./TemplatePrimitives.module.css";

interface RichTextBlockProps {
  text: string;
  className?: string;
}

type RichBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "unorderedList"; items: string[] };

const unorderedItemPattern = /^\s*\*\s+(.+)$/;

const parseBlocks = (text: string): RichBlock[] => {
  const lines = text
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim() !== "");

  const blocks: RichBlock[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({ kind: "unorderedList", items: listBuffer });
      listBuffer = [];
    }
  };

  lines.forEach((line) => {
    const listMatch = line.match(unorderedItemPattern);
    if (listMatch) {
      listBuffer.push(listMatch[1].trim());
      return;
    }

    flushList();
    blocks.push({ kind: "paragraph", text: line });
  });

  flushList();
  return blocks;
};

const renderInlineFormat = (text: string): ReactNode[] => {
  const inlinePattern = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*)/g;
  return text.split(inlinePattern).map((chunk, index) => {
    if (chunk.startsWith("***") && chunk.endsWith("***")) {
      return <em key={`${chunk}-${index}`}>{chunk.slice(3, -3)}</em>;
    }

    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return <strong key={`${chunk}-${index}`}>{chunk.slice(2, -2)}</strong>;
    }

    return <span key={`${chunk}-${index}`}>{chunk}</span>;
  });
};

const RichTextBlock = ({ text, className }: RichTextBlockProps) => {
  const blocks = parseBlocks(text);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={styles.textBlock}>
      {blocks.map((block, index) => {
        if (block.kind === "unorderedList") {
          return (
            <ul
              key={`ul-${index}`}
              className={`${styles.richList} ${className ?? ""}`.trim()}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{renderInlineFormat(item)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={`p-${index}`}
            className={`${styles.richParagraph} ${className ?? ""}`.trim()}
          >
            {renderInlineFormat(block.text)}
          </p>
        );
      })}
    </div>
  );
};

export default RichTextBlock;
