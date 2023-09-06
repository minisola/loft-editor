import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { HTMLAttributes } from "react";
import { RootElContext } from "../context";
import { EditorContent } from "@tiptap/react";
import React from "react";
import { LoftEditor } from "../Editor/LoftEditor";
import { Toolbar } from "../toolbar";
import LocaleProvider from "./locale/provider";
import { Outline } from "./OutlineView";

export function EditorView(
  props: {
    loftEditor: LoftEditor;
  } & HTMLAttributes<HTMLDivElement>
) {
  const { loftEditor, ...rest } = props;
  const { $editor, showToolbar, showOutline, pluginViews } = loftEditor;
  const rootElRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <LocaleProvider locale={loftEditor.locale}>
      <ConfigProvider>
        <StyleProvider hashPriority="high">
          <RootElContext.Provider value={rootElRef}>
            <div className="loft-editor-view" ref={rootElRef}>
              {/* toolbar */}
              <div className="loft-editor-content">
                <div className="loft-editor-toolbar">
                  {showToolbar ? <Toolbar editor={$editor} /> : null}
                </div>
                {/* tiptap editorContent */}
                <EditorContent editor={$editor} {...rest}></EditorContent>
                {/* plugin views */}
                {pluginViews.map((Component, index) => {
                  return <Component editor={$editor} key={index}></Component>;
                })}
              </div>
              {showOutline ? (
                <div className="loft-editor-outline">
                  <Outline editor={loftEditor} />
                </div>
              ) : null}
            </div>
          </RootElContext.Provider>
        </StyleProvider>
      </ConfigProvider>
    </LocaleProvider>
  );
}
