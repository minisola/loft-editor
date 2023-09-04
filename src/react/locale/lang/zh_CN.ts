const localeValues = {
  locale: "zh-cn",
  global: {
    placeholder: "请选择",
    loading: "加载中...",
  },
  slashSuggestion: {
    text: {
      title: "文本",
    },
    todo: {
      title: "待办",
    },
    heading1: {
      title: "标题1",
    },
    heading2: {
      title: "标题2",
    },
    heading3: {
      title: "标题3",
    },
    bulletList: {
      title: "无序列表",
    },
    numberedList: {
      title: "有序列表",
    },
    quote: {
      title: "引用",
    },
    code: {
      title: "代码块",
    },
    image: {
      title: "图片",
    },
    table: {
      title: "表格",
    },
    addRowAfter: {
      title: "在下方插入行",
    },
    addRowBefore: {
      title: "在上方插入行",
    },
    addColBefore: {
      title: "在上方插入列",
    },
    addColAfter: {
      title: "在下方插入列",
    },
    deleteRow: {
      title: "删除行",
    },
    deleteCol: {
      title: "删除列",
    },
  },
} as const;

export type LocaleValuesType = typeof localeValues;

export type LocaleConstKeyType = keyof Omit<LocaleValuesType, "locale">;

export default localeValues;
