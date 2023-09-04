import React from "react";
import { useLoftEditor } from "./useLoftEditor";
import { LoftEditorOptions } from "./LoftEditor";
import { EditorView } from "../react/EditorView";

export const EditorRender: React.FC<Partial<LoftEditorOptions>> = (options) => {
  const loftEditor = useLoftEditor(options);
  if (!loftEditor?.$editor) {
    return;
  }
  return <EditorView loftEditor={loftEditor}></EditorView>;
};
