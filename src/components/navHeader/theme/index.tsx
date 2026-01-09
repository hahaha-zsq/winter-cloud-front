// import {Tooltip} from "antd";
// import {Icon} from "@iconify/react";
// import "../index.less"
// import {useEffect} from "react";
// import {useIntl, defineMessages} from 'react-intl';
// import {ThemeMode} from "@/types/enum";
// import {useSettingActions, useSettings} from "@/store/settingStore";
//
// const messages = defineMessages({
//     day: {
//         id: "header.day",
//     },
//     night: {
//         id: "header.night",
//     },
// })
// const Theme = () => {
//     const intl = useIntl();
//     const {setSettings} = useSettingActions();
//     const settings = useSettings();
//     const {
//         themeMode,
//     } =
//             settings;
//     useEffect(() => {
//         setThemeMode(themeMode)
//
//     }, [])
//     // 设置主题模式的函数
//     const setThemeMode = (themeMode: ThemeMode, event?: React.MouseEvent<HTMLElement>) => {
//         // 添加调试信息
//         console.log("Theme transition starting", {
//             supported: !!document.startViewTransition,
//             themeMode,
//             event: !!event
//         });
//
//         // 如果没有事件对象或不支持 View Transitions API，使用默认切换
//         if (!event || !document.startViewTransition) {
//             updateThemeMode(themeMode);
//             return;
//         }
//
//         // 获取点击位置
//         const button = event.currentTarget;
//         console.log(button)
//         // getBoundingClientRect方法返回一个 DOMRect 对象，该对象包含元素相对于视口（viewport）的位置和尺寸信息
//         const rect = button.getBoundingClientRect();
//
//         // 计算最大半径(屏幕对角线长度)
//         // Math.hypot计算直角三角形的斜边长度
//         const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);
//         const isDarkMode = themeMode === ThemeMode.Dark;
//
//         // 为暗色模式使用点击位置，为亮色模式使用左下角
//         /*
//         * x: 元素的左边缘相对于视口的水平距离。
//         * y: 元素的顶边相对于视口的垂直距离。
//         * width: 元素的宽度。
//         * height: 元素的高度。
//         * top: 元素的顶边相对于视口的距离。
//         * right: 元素的右边相对于视口的距离。
//         * bottom: 元素的底边相对于视口的距离。
//         * left: 元素的左边相对于视口的距离。
//         *
//         * */
//         // const x = isDarkMode ? (rect.left + rect.width / 2) : 0;
//         // const y = isDarkMode ? (rect.top + rect.height / 2) : window.innerHeight;
//
//         const x = (rect.left + rect.width / 2)
//         const y = (rect.top + rect.height / 2)
//         const r = Math.hypot(
//                 Math.max(x, window.innerWidth - x),
//                 Math.max(y, window.innerHeight - y)
//         );
//
//         const root = document.documentElement;
//         root.style.setProperty('--x', `${x}px`);
//         root.style.setProperty('--y', `${y}px`);
//         root.style.setProperty('--r', `${r}px`);
//
//         if (document.startViewTransition) {
//             // 等待变量应用后再触发过渡
//             requestAnimationFrame(() => {
//                 document.startViewTransition(() => updateThemeMode(themeMode));
//             });
//         } else {
//             updateThemeMode(themeMode)
//         }
//
//     };
//     // 将原有的主题切换逻辑抽取为单独的函数
//     const updateThemeMode = (themeMode: ThemeMode) => {
//         console.log(themeMode)
//         setSettings({
//             ...settings,
//             themeMode
//         });
//         if (themeMode === ThemeMode.Dark) {
//             document.documentElement.dataset.theme = 'dark'
//             document.documentElement.classList.remove('light')
//             document.documentElement.classList.add('dark')
//         } else {
//             document.documentElement.dataset.theme = 'light'
//             document.documentElement.classList.remove('dark')
//             document.documentElement.classList.add('light')
//         }
//     };
//     const isLight = themeMode === ThemeMode.Light;
//     const nextTheme = isLight ? ThemeMode.Dark : ThemeMode.Light;
//     const icon = isLight ? "line-md:sunny-outline-loop" : "line-md:sunny-outline-to-moon-alt-loop-transition";
//     const title = isLight ? intl.formatMessage(messages.day) : intl.formatMessage(messages.night);
//
//
//     return (
//         <Tooltip placement="top" title={title}>
//             <div className="theme" onClick={(event) => setThemeMode(nextTheme, event)}>
//                 <Icon icon={icon} className="text-xl" />
//             </div>
//         </Tooltip>
//     )
// }
//
// export default Theme
