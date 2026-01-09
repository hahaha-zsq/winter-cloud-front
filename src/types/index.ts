export * from "./auth.ts"
export * from "./menu.ts"



export interface Configuration{
    isCollapsed: boolean  // 是否收缩
    isFullScreen: boolean  // 是否全屏
    isEnablePageAnimation: boolean  // 是否启用页面动画
    mode: string,  // 主题模式(暗黑、明亮、自适应)
    layout: string, // 主题布局(垂直、水平)
    isStretch: boolean,  // 是否拉伸
    isEnableWaterMark: boolean,  // 是否启用水印
    language:string, // 语言
}