import { theme } from 'antd';
import { useMemo } from 'react';

export function useThemeToken() {
  const { token } = theme.useToken();
	// theme.useToken()是Antd框架提供的一个Hooks，用于获取主题相关的样式变量（tokens）。这些变量可以是颜色、字体大小、边距等。这个函数返回一个对象，通常这个对象包含多个样式变量。
    // console.table(token)
  return useMemo(() => token, [token]);
}
