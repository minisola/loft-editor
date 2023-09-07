import { EditorOptions, Editor as TiptapReactEditor } from "@tiptap/react";
import { Content, Editor as TiptapEditor } from "@tiptap/core";
import { SlashMenuPlugin } from "../extensions/slash-menu";
import { EditorView } from "@tiptap/pm/view";
import { defaultTiptapExtensions } from "../extensions";
import { serialize } from "../extensions/markdown";
import {
  LocaleStore,
  UploadImageHandler,
  onUploadImageType,
} from "../cacheStore";
import { EditorBubbleMenu } from "../extensions/bubble-menu";
import { Locale } from "../view/locale/context";
import localeValues from "../view/locale/default";
import { ImageBubbleMenu } from "../extensions/image";

// 初始化slash插件
const slashExtension = SlashMenuPlugin();

// 默认插件
const defaultExtensions = [
  ...defaultTiptapExtensions,
  slashExtension.extension,
];

export type ExtensionDefaultProps = {
  editor: TiptapReactEditor;
};

export type LoftEditorOptions = {
  onReady: (editor: LoftEditor) => void;
  onUpdate: (editor: LoftEditor) => void;
  onSelectionUpdate: (editor: LoftEditor) => void;
  editable: boolean;
  content?: Content;
  $editor: TiptapReactEditor;
  /** 图片上传回调 */
  onUploadImage?: onUploadImageType;
  /** 额外的扩展 */
  extensions?: EditorOptions["extensions"];
  locale?: Locale;
  showToolbar?: boolean;
  showOutline?: boolean;
};

export class LoftEditor {
  /** 原始tiptapEditor引用 */
  public readonly $editor: TiptapReactEditor;
  /** 插件view层 */
  public readonly pluginViews: React.FC<ExtensionDefaultProps>[] = [
    slashExtension.view,
    EditorBubbleMenu,
    ImageBubbleMenu
  ];
  public ready = false;
  /** 国际化 */
  public locale?: Locale;
  public showToolbar?: boolean;
  public showOutline?: boolean;

  constructor(readonly options: Partial<LoftEditorOptions> = {}) {
    const newOptions = {
      ...options,
    };

    const tiptapOptions: Partial<EditorOptions> = {
      ...newOptions,
      onCreate: () => {
        this.ready = true;
        newOptions.onReady?.(this);
      },
      onUpdate: () => {
        if (!this.ready) {
          return;
        }
        newOptions.onUpdate?.(this);
      },
      onSelectionUpdate: () => {
        if (!this.ready) {
          return;
        }
        newOptions.onSelectionUpdate?.(this);
      },
      editable: options.editable === undefined ? true : options.editable,
      extensions: [...defaultExtensions, ...(options.extensions || [])],
    };

    // toolbar
    this.showToolbar = newOptions.showToolbar === false ? false : true;
    // outline
    this.showOutline = newOptions.showOutline === false ? false : true;

    this.$editor = new TiptapEditor(tiptapOptions) as TiptapReactEditor;

    //local set
    this.locale = {
      ...localeValues,
      ...options.locale,
    };
    LocaleStore.set(this.$editor, this.locale);

    // handler set
    UploadImageHandler.set(this.$editor, options?.onUploadImage);
  }

  public get view(): EditorView {
    return this.$editor.view;
  }

  public get domElement() {
    return this.$editor.view.dom as HTMLDivElement;
  }

  public isFocused() {
    return this.$editor.view.hasFocus();
  }

  public getJSON() {
    return this.$editor.getJSON();
  }
  public getMarkdown() {
    return serialize(this.$editor?.getHTML() || "");
  }
  public getHTML() {
    return this.$editor?.getHTML();
  }

  public focus() {
    this.$editor.view.focus();
  }
  public onContentChange(callback: () => void) {
    this.$editor.on("update", callback);
  }

  public onSelectionChange(callback: () => void) {
    this.$editor.on("selectionUpdate", callback);
  }

  public get isEditable(): boolean {
    return this.$editor.isEditable;
  }

  public setEditable(editable: boolean) {
    this.$editor.setEditable(editable);
  }
}
