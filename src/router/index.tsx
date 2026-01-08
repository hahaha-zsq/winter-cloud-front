import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { useStore } from "@/store";
import { useThemeToken } from "@/hooks/use-theme-token.ts";
import { LazyLoad } from "@/router/LazyLoad.tsx";
import AdminLoader from "@/components/loading";
import { staticRoutes } from "@/router/staticRouter.tsx";
import { setGlobalRouter } from "@/router/navigate.ts";
import { dynamicRoutingApi } from "@/api/menu.ts";
import { message } from "@/components/antdGlobal";

export const DynamicRouterFC: React.FC = () => {
    const userId = useStore(state => state.userInfo.id);
    // 获取 actions 以便在出错时清理状态
    const { actions } = useStore();
    const themeToken = useThemeToken();

    const [loading, setLoading] = useState(false);
    const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null);

    // 引入所有视图文件
    const modules = import.meta.glob(
        ["../views/**/*.tsx", "../views/**/*.jsx"]
    ) as Record<string, () => Promise<any>>;

    /** 加载动态路由 */
    const loadDynamicRoutes = async (): Promise<RouteObject[]> => {
        if (!userId) return [];
        try {
            const data = await dynamicRoutingApi(userId);
            if(!data) return []; // 防空判断

            return data
                .map(menu => {
                    // 建议：打印路径检查是否匹配
                    const path = `../views${menu.filePath}/${menu.component}`;

                    if (!modules[path]) {
                        console.warn(`[Router] Component not found: ${path}`);
                        return null;
                    }

                    return {
                        path: menu.path,
                        element: <LazyLoad Component={React.lazy(() => modules[path]())} />,
                    } as RouteObject;
                })
                .filter((r): r is RouteObject => Boolean(r));
        } catch (error) {
            console.error("加载动态路由失败:", error);
            // 关键修复：如果接口请求失败（可能是 Token 过期或无权限），
            // 必须清除当前用户信息，防止刷新页面后再次进入死循环请求
            // actions.clearUserInfo();
            message.error("验证失败，请重新登录");
            return [];
        }
    };

    /** 构建 Router */
    useEffect(() => {
        // 如果没有 userId，不执行构建，但需要初始化一个基础路由（如登录页）
        // 这里如果是空状态，通常 staticRouter 已经包含了 login/layout 等基础路由，
        // 我们仍需创建一个 router 实例给 Provider 使用，否则页面会白屏
        if (!userId) {
            const basicRouter = createBrowserRouter(staticRoutes);
            setGlobalRouter(basicRouter);
            setRouter(basicRouter);
            return;
        }

        let isCancelled = false; // 防止竞态条件
        setLoading(true);

        const initRouter = async () => {
            try {
                const dynamicRoutes = await loadDynamicRoutes();
                if (isCancelled) return;

                // ✅ 修复：通过 id 查找 Layout，而不是通过 component.name
                const fullRoutes: RouteObject[] = staticRoutes.map(route => {
                    if (route.id === "layout") {
                        return {
                            ...route,
                            children: [...(route.children || []), ...dynamicRoutes],
                        };
                    }
                    return route;
                });

                const newRouter = createBrowserRouter(fullRoutes);

                // 只有当路由真正建立时才更新状态
                setGlobalRouter(newRouter);
                setRouter(newRouter);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        initRouter();

        // 清理函数：当 userId 变化时，标记之前的操作已取消
        return () => {
            isCancelled = true;
        };
    }, [userId]); // 依赖 userId，变化时重新构建

    // 渲染逻辑
    return (
        <>
            {/* 全局 Loading 遮罩 */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                    <AdminLoader
                        theme="light"
                        color={themeToken.colorPrimary}
                        text="加载数据中"
                        subText="请稍等..."
                    />
                </div>
            )}

            {/* ✅ 只有当 router 存在时才渲染，防止闪烁或 404 */}
            {router && <RouterProvider router={router} />}
        </>
    );
};