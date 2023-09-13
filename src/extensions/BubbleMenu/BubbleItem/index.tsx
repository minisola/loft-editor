import { Editor } from "@tiptap/core";
import { Button, Popover } from "antd";
import React, { useRef, useState } from "react";
import { IBubbleCompsProps } from "../types";

interface IBubbleItemProps {
  comps: IBubbleCompsProps;
  props: { editor: Editor };
}

const BubbleItem: React.FC<IBubbleItemProps> = ({ comps, props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { obj, boxContent } = comps(props, setOpen);
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
        content={<div>{boxContent}</div>}
        placement="bottom"
        open={open}
        onOpenChange={setOpen}
        destroyTooltipOnHide={true}
        getPopupContainer={() => containerRef.current || document.body}
        align={{ offset: [8, 10] }}
      >
        <Button
          className="loft-editor-icon-adapt"
          type={obj.isActive() ? "primary" : "text"}
          icon={obj.icon}
        ></Button>
      </Popover>
    </div>
  );
};

export default BubbleItem;
