import { createBrowserRouter } from "react-router-dom";

// 技巧：直接通过 ReturnType 获取 router 实例的类型，
// 这样你就不需要单独 import { Router } from "@remix-run/router" 了
type Router = ReturnType<typeof createBrowserRouter>;

let globalRouter: Router | null = null;

/**
 * 初始化时调用：将 router 实例保存到内存中
 */
export const setGlobalRouter = (router: Router) => {
    globalRouter = router;
};

/**
 * 供外部（如 Axios）调用：获取 router 实例
 */
export const getGlobalRouter = () => {
    return globalRouter;
};

/**
 * 封装好的跳转函数
 * @param path 路径
 * @param replace 是否替换历史记录
 */
export const navigateTo = (path: string, replace: boolean = false) => {
    if (globalRouter) {
        globalRouter.navigate(path, { replace });
    } else {
        // 兜底策略：如果 router 还没初始化好，使用原生跳转
        // 修复：防止死循环刷新。如果当前路径已经是目标路径，则不再执行 location.href 赋值
        if (window.location.pathname !== path) {
            window.location.href = path;
        } else {
            console.warn(`[Navigate] Router not ready and already at ${path}, skipping reload to prevent loop.`);
        }
    }
};