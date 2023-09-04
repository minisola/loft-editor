import { DependencyList, useEffect, useState } from "react";
import { LoftEditor, LoftEditorOptions } from "./LoftEditor";

function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export const useLoftEditor = (
  options: Partial<LoftEditorOptions> = {},
  deps: DependencyList = []
) => {
  const [loftEditor, setLoftEditor] = useState<LoftEditor | null>(null);
  const editor = loftEditor?.$editor;

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    let isMounted = true;

    const instance = new LoftEditor(options);

    setLoftEditor(instance);

    instance?.$editor.on("transaction", () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isMounted) {
            forceUpdate();
          }
        });
      });
    });

    return () => {
      isMounted = false;
    };
  }, deps);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return loftEditor;
};
