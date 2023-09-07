import React, { useCallback } from "react";
import { isNodeSelection, posToDOMRect } from "@tiptap/core";
import { CellSelection } from "@tiptap/pm/tables";
import { BubbleMenu } from "@tiptap/react";
import {
  AiOutlineAlignCenter,
  AiOutlineAlignLeft,
  AiOutlineAlignRight,
} from "react-icons/ai";
import { ExtensionDefaultProps } from "../../../Editor/LoftEditor";
import { Button, theme } from "antd";

export const ImageBubbleMenu: React.FC<ExtensionDefaultProps> = ({
  editor,
}) => {
  const { token } = theme.useToken();

  const shouldShow = useCallback(() => {
    const show =
      !(editor.state.selection instanceof CellSelection) &&
      editor.isActive("image");
    // isActive(editor.state, Image.name);
    return show && editor.isEditable;
  }, [editor]);

  if (!editor.state.schema.nodes.image) {
    return null;
  }

  return (
    <BubbleMenu
      pluginKey="imageBubbleMenu"
      editor={editor}
      shouldShow={shouldShow}
      // reference="mark"
      // referenceMarkType={Image.name}
      // placement="top"
      tippyOptions={{
        appendTo: "parent",
        getReferenceClientRect: () => {
          const { state, view } = editor;
          const { from, to } = state.selection;

          if (isNodeSelection(state.selection)) {
            const node = view.nodeDOM(from) as HTMLElement;
            const img = node.querySelector("img");
            if (img) {
              return img.getBoundingClientRect();
            }
          }
          return posToDOMRect(view, from, to);
        },
      }}
    >
      <div
        className="loft-editor-bubble-menu"
        style={{
          paddingTop: token.paddingXS,
          paddingBottom: token.paddingXS,
          paddingLeft: token.paddingSM,
          paddingRight: token.paddingSM,
          borderRadius: token.borderRadius,
          boxShadow: token.boxShadow,
          backgroundColor: token.colorBgElevated,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Button
          type="text"
          onClick={() => {
            editor.chain().updateImageAttr({ align: "left" }).run();
          }}
        >
          <AiOutlineAlignLeft />
        </Button>
        <Button
          type="text"
          onClick={() => {
            editor.chain().updateImageAttr({ align: "center" }).run();
          }}
        >
          <AiOutlineAlignCenter />
        </Button>
        <Button
          type="text"
          onClick={() => {
            editor.chain().updateImageAttr({ align: "right" }).run();
          }}
        >
          <AiOutlineAlignRight />
        </Button>
      </div>
    </BubbleMenu>
  );
};
