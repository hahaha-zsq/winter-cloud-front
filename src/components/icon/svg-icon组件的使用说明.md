通过[vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons/blob/main/README.zh_CN.md) vite插件将本地src/assets/icons目录下的svg生成svg雪碧图。只需在vite.config.ts中按如下方式配置

```ts
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig({
  // ...
  plugins: [
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹,本项目设置的是src/assets/icons，插件会扫描该目录下的图标
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
			//[name]:svg 文件名  [dir]：该插件的 svg 不会生成 hash 来区分，而是通过文件夹来区分.
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  // ...
});
```
![](https://f.hotgrid.cn/ysrdnj-epideprev/857c512c64f34a8ab4d8e3c0639bd023.png)
如果使用 Typescript,你可以在tsconfig.json内添加
```json
{
  "compilerOptions": {
    "types": ["vite-plugin-svg-icons/client"]
  }
}
```
![](https://f.hotgrid.cn/ysrdnj-epideprev/4aa1785d999d40f5baee7edea5494005.png)
封装组件
```tsx
import { CSSProperties } from 'react';
interface SvgIconProps {
  prefix?: string;
  icon: string;
  color?: string;
  size?: string | number;
  className?: string;
  style?: CSSProperties;
}

export default function SvgIcon({
  icon,
  prefix = 'icon',
  color = 'currentColor',
  size = '1em',
  className = '',
  style = {},
}: SvgIconProps) {
	// 此前vite.config.ts 中指定symbolId格式为icon-[dir]-[name]，所以这里的icon的值要为： 文件夹名-文件名
  const symbolId = `#${prefix}-${icon}`;
  const svgStyle: CSSProperties = {
    verticalAlign: 'middle',
    width: size,
    height: size,
    color,
    ...style,
  };
  return (
    <svg
			aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={`anticon fill-current inline-block h-[1em] w-[1em] overflow-hidden outline-none ${className}`}
      style={svgStyle}
    >
      <use xlinkHref={symbolId} fill="currentColor" />
    </svg>
  );
}

```

使用
```tsx
import SvgIcon from "@/components/icon/svg-icon";

const UserFC = () => {
	return (
		<>
		<div>
			<SvgIcon icon="ic-analysis" size={48} />
			<SvgIcon icon="logo-ic-logo" size={48} />
		</div>
		</>
	)
}

export default UserFC
```
![img.png](https://f.hotgrid.cn/ysrdnj-epideprev/7b633ca2408840b4a314d0cbf4cd7def.png)

![img_1.png](https://f.hotgrid.cn/ysrdnj-epideprev/a16355e3298c4471a92e84dccbf2823f.png)
