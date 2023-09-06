import { Editor } from "@tiptap/core";

export type IBubbleCompsProps = (
  props: { editor: Editor },
  setOpen: (input: boolean) => void
) => {
  obj: {
    name: string;
    isActive: () => boolean;
    command: (href: string) => void;
    icon: JSX.Element;
  };
  boxContent: JSX.Element;
};
