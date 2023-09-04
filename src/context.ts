import React from "react";
// import { LoftEditor } from ".";

export const RootElContext =
  React.createContext<React.MutableRefObject<HTMLDivElement | null> | null>({
    current: null,
  });

// export const LoftEditorContext = React.createContext<LoftEditor | null>(null);

export const useRootElRef = () => React.useContext(RootElContext)!;
// export const useLoftEditorRef = () => React.useContext(LoftEditorContext)!;
