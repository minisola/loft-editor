import { useEffect, useMemo, useRef, useState } from "react";
import { LocaleStore } from "../../../cacheStore";
import { LocaleValuesType } from "../../../view/locale/lang/zh_CN";
import { Button, Popover } from "antd";
import { BubbleBtnExtensionProps } from "../TextBubbleMenu";
import { IconButton } from "../../../view/Button";

const EMPTY_STRING = "";

export const FontColor: React.FC<BubbleBtnExtensionProps> = ({ editor }) => {
  const [textColorKey, setTextColorKey] = useState<string>(EMPTY_STRING);
  const [bgColorKey, setBgColorKey] = useState<string>(EMPTY_STRING);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textStyle = editor.getAttributes("textStyle");
    const highlight = editor.getAttributes("highlight");

    setTextColorKey(textStyle.color || EMPTY_STRING);
    setBgColorKey(highlight.color || EMPTY_STRING);
  }, [editor.state]);

  const locale = LocaleStore.get(
    editor,
    "fontColor"
  ) as LocaleValuesType["fontColor"];

  const fontColors = useMemo(() => {
    const colorList = [
      EMPTY_STRING,
      "rgb(143, 149, 158)",
      "rgb(216, 57, 49)",
      "rgb(220, 120, 2)",
      "rgb(220, 155, 4)",
      "rgb(46, 161, 33)",
      "rgb(36, 91, 219)",
      "rgb(100, 37, 208)",
    ];
    return colorList.map((color) => {
      return (
        <i
          key={color}
          className={color === textColorKey ? "item-active" : ""}
          style={{
            color: color ? color : "inherit",
          }}
          onClick={() => {
            if (color) {
              editor.chain().focus().setColor(color).run();
              setTextColorKey(color);
            } else {
              editor.chain().focus().unsetColor().run();
              setTextColorKey(EMPTY_STRING);
            }
          }}
        >
          A
        </i>
      );
    });
  }, [textColorKey]);

  const backgroundColors = useMemo(() => {
    const colorList = [
      EMPTY_STRING,
      "rgba(222, 224, 227, 0.8)",
      "rgb(251, 191, 188)",
      "rgba(254, 212, 164, 0.8)",
      "rgba(255, 246, 122, 0.8)",
      "rgba(183, 237, 177, 0.8)",
      "rgba(186, 206, 253, 0.7)",
      "rgba(205, 178, 250, 0.7)",
      "rgb(242, 243, 245)",
      "rgb(187, 191, 196)",
      "rgb(247, 105, 100)",
      "rgb(255, 165, 61)",
      "rgb(255, 233, 40)",
      "rgb(98, 210, 86)",
      "rgba(78, 131, 253, 0.55)",
      "rgba(147, 90, 246, 0.55)",
    ];
    return colorList.map((color) => {
      return (
        <i
          className={`background-item ${
            color === bgColorKey ? "item-active" : null
          }`}
          key={color}
          style={{
            background: color ? color : "none",
          }}
          onClick={() => {
            if (color) {
              editor.chain().focus().toggleHighlight({ color }).run();
              setBgColorKey(color);
            } else {
              editor.chain().focus().unsetHighlight().run();
              setBgColorKey(EMPTY_STRING);
            }
          }}
        ></i>
      );
    });
  }, [bgColorKey]);

  return (
    <div
      ref={containerRef}
      style={{ display: "inline-flex" }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Popover
        arrow={false}
        placement="bottom"
        open={open}
        onOpenChange={setOpen}
        destroyTooltipOnHide={true}
        getPopupContainer={() => containerRef.current || document.body}
        align={{ offset: [8, 10] }}
        content={
          <div className="loft-editor-color-selector">
            <div>{locale.color.title}</div>
            <div className="loft-editor-color-selector-row">{fontColors}</div>
            <div>{locale.background.title}</div>
            <div className="loft-editor-color-selector-row">
              {backgroundColors}
            </div>
            <Button
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                editor.chain().focus().unsetHighlight().run();
                setBgColorKey(EMPTY_STRING);
                setTextColorKey(EMPTY_STRING);
              }}
            >
              {locale.reset.title}
            </Button>
          </div>
        }
      >
        <IconButton icon={<span>A</span>}></IconButton>
      </Popover>
    </div>
  );
};
