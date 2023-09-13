import { theme } from "antd";
import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: React.ReactNode;
}

export function CommonBubbleMenu({ children, ...rest }: BubbleMenuProps) {
  const { token } = theme.useToken();

  return (
    <BubbleMenu
      {...rest}
      tippyOptions={{ maxWidth: "none", appendTo: "parent" }}
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
        {children}
      </div>
    </BubbleMenu>
  );
}
