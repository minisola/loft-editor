import { FontStyleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { IBubbleCompsProps } from "../types";

const NULL_SYMBOL = "/";
const colors = {
  textColor: [
    NULL_SYMBOL, // clear
    "rgb(143, 149, 158)",
    "rgb(216, 57, 49)",
    "rgb(220, 120, 2)",
    "rgb(220, 155, 4)",
    "rgb(46, 161, 33)",
    "rgb(36, 91, 219)",
    "rgb(100, 37, 208)",
  ],
  bgColorsLine1: [
    NULL_SYMBOL, // clear
    "rgba(222, 224, 227, 0.8)",
    "rgb(251, 191, 188)",
    "rgba(254, 212, 164, 0.8)",
    "rgba(255, 246, 122, 0.8)",
    "rgba(183, 237, 177, 0.8)",
    "rgba(186, 206, 253, 0.7)",
    "rgba(205, 178, 250, 0.7)",
  ],
  bgColorsLine2: [
    "rgb(242, 243, 245)",
    "rgb(187, 191, 196)",
    "rgb(247, 105, 100)",
    "rgb(255, 165, 61)",
    "rgb(255, 233, 40)",
    "rgb(98, 210, 86)",
    "rgba(78, 131, 253, 0.55)",
    "rgba(147, 90, 246, 0.55)",
  ],
};

export const colorComps: IBubbleCompsProps = (props) => {
  const [textColorKey, setTextColorKey] = useState<string>(NULL_SYMBOL);
  const [bgColorKey, setBgColorKey] = useState<string>(NULL_SYMBOL);
  const content = (color: string, bg: string) => {
    if (color) return "A";
    if (bg === NULL_SYMBOL) return <span style={{ color: "grey" }}>×</span>;
  };
  const color = {
    name: "color",
    isActive: () => props.editor.isActive("color"),
    command: (color?: string, bg?: string) => {
      if (color === NULL_SYMBOL) {
        props.editor.chain().focus().unsetColor().run();
      } else if (color) {
        props.editor.chain().focus().setColor(color).run();
      }
      if (bg === NULL_SYMBOL) {
        props.editor.chain().focus().unsetHighlight().run();
      } else if (bg) {
        props.editor.chain().focus().toggleHighlight({ color: bg }).run();
      }
    },
    icon: (
      <FontStyleIcon
        style={{
          width: 14,
          height: 14,
        }}
      />
    ),
  };

  const ColorBox = ({ colorString, bgString }: Record<string, string>) => {
    const ifChosen = () => {
      if (
        (bgString && bgColorKey === bgString) ||
        (colorString && textColorKey === colorString)
      ) {
        return "1px solid #1677ff";
      } else {
        return "1px solid silver";
      }
    };
    return (
      <button
        style={{
          width: "24px",
          height: "24px",
          border: ifChosen(),
          color: colorString || "black",
          backgroundColor: bgString || "white",
          borderRadius: "2px",
          fontWeight: 600,
        }}
        onClick={() => {
          if (bgString === bgColorKey) {
            color.command(colorString, NULL_SYMBOL);
            setBgColorKey(NULL_SYMBOL);
            return;
          }
          if (colorString === textColorKey) {
            color.command(NULL_SYMBOL, bgString);
            setTextColorKey(NULL_SYMBOL);
            return;
          }
          color.command(colorString, bgString);
          bgString && setBgColorKey(bgString);
          colorString && setTextColorKey(colorString);
        }}
      >
        {content(colorString, bgString)}
      </button>
    );
  };

  const colorSelect = (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: "12px" }}>字体颜色</div>
      <div style={{ display: "flex", gap: "6px" }}>
        {colors.textColor.map((color) => (
          <ColorBox colorString={color} key={color} />
        ))}
      </div>
      <div style={{ fontSize: "12px" }}>背景颜色</div>
      <div style={{ display: "flex", gap: "6px" }}>
        {colors.bgColorsLine1.map((color) => (
          <ColorBox bgString={color} key={color} />
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        {colors.bgColorsLine2.map((color) => (
          <ColorBox bgString={color} key={color} />
        ))}
      </div>
      <button
        style={{
          border: "1px solid silver",
          borderRadius: "2px",
          marginRight: "6px",
        }}
        onClick={() => {
          color.command(NULL_SYMBOL, NULL_SYMBOL);
          setBgColorKey(NULL_SYMBOL);
          setTextColorKey(NULL_SYMBOL);
        }}
      >
        恢复默认
      </button>
    </div>
  );

  return { obj: color, boxContent: colorSelect };
};
