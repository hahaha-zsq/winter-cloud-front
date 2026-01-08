import React, {type JSX, Suspense} from 'react'
import {useThemeToken} from "@/hooks/use-theme-token.ts";
import AdminLoader from "@/components/loading";

interface LazyLoadProps {
    Component: React.LazyExoticComponent<() => JSX.Element>;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({Component}) => {
    const themeToken = useThemeToken();

    return (
        <Suspense
            fallback={
                <div className="relative h-screen text-center flex justify-center items-center bg-color">
                    <AdminLoader
                        theme="light"  // todo 这个后续通过zustand 管理获取
                        color={themeToken.colorPrimary}
                        text="加载数据中"
                        subText="请稍等..."
                    />
                </div>
            }
        >
            <Component/>
        </Suspense>
    );
}
