import { theme } from "antd"

export const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorBorder: 'var(--border-color)',
    colorSplit: 'var(--border-color)',
  },
  components: {
    Layout: {
      bodyBg: 'var(--background-color)',
      headerBg: '#ffffff',
    },
    Card: {
      colorBorderSecondary: 'var(--border-color)'
    },
    Typography: {
      titleMarginTop: 0,
      titleMarginBottom: 0
    }
  },
}
