import { theme } from "antd";

const legacyTheme = {
  token: {
    paddingXS: 8,
    paddingSM: 12,
    borderRadius: 6,
    boxShadow:
      "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
    colorBgElevated: "#ffffff",
  },
} as const;

type legacyThemeType = typeof legacyTheme;

export const getThemeToken: () => legacyThemeType = () => {
  if (theme) {
    return theme.useToken() as legacyThemeType;
  }
  return legacyTheme;
};
