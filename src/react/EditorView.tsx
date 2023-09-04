import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { HTMLAttributes } from "react";
import { RootElContext } from "../context";
import { EditorContent } from "@tiptap/react";
import React from "react";
import { LoftEditor } from "../Editor/LoftEditor";
import { Toolbar } from "../toolbar";
import LocaleProvider from "./locale/provider";

export function EditorView(
  props: {
    loftEditor: LoftEditor;
  } & HTMLAttributes<HTMLDivElement>
) {
  const { loftEditor, ...rest } = props;
  const { $editor, pluginViews } = loftEditor;
  const rootElRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <LocaleProvider locale={loftEditor.locale}>
      <ConfigProvider
      // theme={{
      //   algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      // }}
      >
        <StyleProvider hashPriority="high">
          <RootElContext.Provider value={rootElRef}>
            <div className="loft-editor-view" ref={rootElRef}>
              <Toolbar editor={$editor} />
              <EditorContent editor={$editor} {...rest}></EditorContent>
              {pluginViews.map((Component, index) => {
                return <Component editor={$editor} key={index}></Component>;
              })}
            </div>
          </RootElContext.Provider>
        </StyleProvider>
      </ConfigProvider>
    </LocaleProvider>
  );
}
