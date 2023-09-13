import React, { useCallback } from "react";
import { isNodeSelection, posToDOMRect } from "@tiptap/core";
import { CellSelection } from "@tiptap/pm/tables";
import { LuAlignCenter, LuAlignLeft, LuAlignRight } from "react-icons/lu";
import { ExtensionDefaultProps } from "../../../Editor/LoftEditor";
import { CommonBubbleMenu } from "../../BubbleMenu/common/CommonBubbleMenu";
import { IconButton } from "../../../view/Button";

export const ImageBubbleMenu: React.FC<ExtensionDefaultProps> = ({
  editor,
}) => {

  const shouldShow = useCallback(() => {
    const show =
      !(editor.state.selection instanceof CellSelection) &&
      editor.isActive("image");
    return show && editor.isEditable;
  }, [editor]);

  if (!editor.state.schema.nodes.image) {
    return null;
  }

  return (
    <CommonBubbleMenu
      pluginKey="imageBubbleMenu"
      editor={editor}
      shouldShow={shouldShow}
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
      <IconButton
        icon={<LuAlignLeft />}
        onClick={() => {
          editor.chain().updateImageAttr({ align: "left" }).run();
        }}
      ></IconButton>
      <IconButton
        icon={<LuAlignCenter />}
        onClick={() => {
          editor.chain().updateImageAttr({ align: "center" }).run();
        }}
      ></IconButton>
      <IconButton
        icon={<LuAlignRight />}
        onClick={() => {
          editor.chain().updateImageAttr({ align: "right" }).run();
        }}
      ></IconButton>
    </CommonBubbleMenu>
  );
};
