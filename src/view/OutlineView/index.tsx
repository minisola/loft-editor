import { useEffect, useState } from "react";
import { LoftEditor } from "../..";
import { JSONContent } from "@tiptap/react";
import { Md5 } from "ts-md5";

type itemType = {
  index: number;
  hash: string;
  level: number;
  text: string;
};

interface IOutline {
  editor?: LoftEditor;
  onItemClick?: (item: itemType) => void;
}

function flatHeadingObj(item: JSONContent, index: number) {
  const newItem = {
    index,
    hash: Md5.hashStr(`${index}${item.content?.[0].text}`).substring(0, 6),
    level: item.attrs?.level || 1,
    text: item.content?.[0].text || "",
  };
  return newItem;
}

function getHeadings(content?: JSONContent) {
  if (!content) {
    return [];
  }
  const headings =
    content.content?.filter((item) => item.type === "heading") || [];
  return headings.map(flatHeadingObj);
}

export const Outline: React.FC<IOutline> = ({ editor, onItemClick }) => {
  const [outline, setOutline] = useState<itemType[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  useEffect(() => {
    setOutline(getHeadings(editor?.getJSON()));
    editor?.$editor.on("update", () => {
      setOutline(getHeadings(editor?.getJSON()));
    });
  }, [editor?.$editor]);

  return (
    <div className="outline-container">
      {outline.map((item, index) => {
        return (
          <a
            key={item.hash}
            onClick={() => {
              setActiveIndex(index);
              onItemClick?.(item);
            }}
            className={`outline-text outline-text-level-${item.level} ${
              activeIndex === index ? "outline-text-active" : ""
            }`}
          >
            {item.text}
          </a>
        );
      })}
    </div>
  );
};
