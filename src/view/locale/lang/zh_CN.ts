const localeValues = {
  locale: "zh-cn",
  global: {},
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
      title: "在左侧插入列",
    },
    addColAfter: {
      title: "在右侧插入列",
    },
    deleteRow: {
      title: "删除行",
    },
    deleteCol: {
      title: "删除列",
    },
  },
  link: {
    insert: {
      title: "插入链接",
    },
  },
  fontColor: {
    color: {
      title: "字体颜色",
    },
    background: {
      title: "背景颜色",
    },
    reset: {
      title: "恢复默认",
    },
  },
  placeholder: {
    heading: {
      title: "标题",
    },
    quickMenu: {
      title: '输入"/" 打开快捷命令',
    },
  },
  table:{
    toolPane:{
      title:"插入表格"
    }
  }
} as const;

export type LocaleValuesType = typeof localeValues;

export type LocaleConstKeyType = keyof Omit<LocaleValuesType, "locale">;

export default localeValues;
