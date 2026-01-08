import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { useStore } from "@/store";
import { useThemeToken } from "@/hooks/use-theme-token.ts";
import { LazyLoad } from "@/router/LazyLoad.tsx";
import AdminLoader from "@/components/loading";
import { staticRoutes } from "@/router/staticRouter.tsx";
import { setGlobalRouter } from "@/router/navigate.ts";
import { dynamicRoutingApi } from "@/api/menu.ts";

export const DynamicRouterFC: React.FC = () => {
    const userId = useStore(state => state.userInfo.id);
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
            return [];
        }
    };

    /** 构建 Router */
    useEffect(() => {
        // 如果没有 userId，不执行构建
        if (!userId) return;

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

            {/* ✅ 只有当 router 存在且不处于 loading 状态(可选)时才渲染，防止闪烁或 404 */}
            {router && <RouterProvider router={router} />}
        </>
    );
};