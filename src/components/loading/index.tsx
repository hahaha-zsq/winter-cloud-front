import React, { useMemo } from 'react';
import { BsSnow2 } from "react-icons/bs";
import { RiCpuLine } from 'react-icons/ri';
import styles from './index.module.less';

interface AdminLoaderProps {
    /** 加载提示主文字 */
    text?: string;
    /** 加载提示副文字 */
    subText?: string;
    /** * 自定义主色调 (支持 hex, rgb, 或标准颜色名)
     * @default "#3b82f6" (Blue-500)
     */
    color?: string;
    /** * 主题模式
     * @default "light"
     */
    theme?: 'light' | 'dark';
}

const AdminLoader: React.FC<AdminLoaderProps> = ({
                                                     text = "SYSTEM PROCESSING",
                                                     subText = "Synchronizing Data Modules...",
                                                     color = "#3b82f6", // 默认蓝色
                                                     theme = "light"    // 默认明亮
                                                 }) => {

    // 根据主题判断基础背景色和文字颜色
    const themeClasses = useMemo(() => {
        if (theme === 'dark') {
            return {
                bg: 'bg-[#0f172a]', // Slate-900
                textPrimary: 'text-slate-200',
                textSecondary: 'text-slate-500',
                cardBg: 'bg-slate-800'
            };
        } else {
            return {
                bg: 'bg-[#f8fafc]', // Slate-50
                textPrimary: 'text-slate-700',
                textSecondary: 'text-slate-400',
                cardBg: 'bg-white'
            };
        }
    }, [theme]);

    return (
        <div
            className={`w-full h-full min-h-[400px] flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${themeClasses.bg} ${styles.loaderContainer}`}
            // 关键：将颜色变量和主题状态传给 CSS
            style={{ '--primary-color': color } as React.CSSProperties}
            data-theme={theme}
        >

            {/* 动画主体区域 */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                {/* 外层虚线 */}
                <div className={`absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] ${styles.outerRing}`} />

                {/* 主要旋转弧线 */}
                <div className={`absolute inset-0 w-full h-full ${styles.middleArc}`} />

                {/* 内层反向旋转圈 */}
                <div className={`absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] ${styles.innerRing}`} />

                {/* 核心中心图标 */}
                <div
                    className={`relative z-10 p-4 rounded-full shadow-sm transition-colors duration-300 ${themeClasses.cardBg} ${styles.centerLogo}`}
                >
                    {/* 图标颜色直接继承 CSS 变量 */}
                    <BsSnow2 className="text-4xl" style={{ color: 'var(--primary-color)' }} />

                    {/* 扫光特效 */}
                    <div className="pointer-events-none overflow-hidden absolute inset-0 rounded-full">
                        <div className={styles.scanLight} />
                    </div>
                </div>
            </div>

            {/* 文字区域 */}
            <div className="flex flex-col items-center space-y-2 z-10">
                <h2 className={`text-xl font-semibold tracking-[0.2em] font-mono ${themeClasses.textPrimary}`}>
                    {text}
                </h2>

                <div className={`flex items-center space-x-2 text-sm ${themeClasses.textSecondary}`}>
                    <RiCpuLine className="animate-pulse" />
                    <span className="tracking-wide uppercase text-xs">{subText}</span>
                </div>
            </div>

            {/* 底部装饰线条：使用 mask 或 gradient 配合 currentColor */}
            <div className="absolute bottom-0 w-full flex justify-center opacity-20">
                <div
                    className="w-1/3 h-px"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${color}, transparent)`
                    }}
                ></div>
            </div>
        </div>
    );
};

export default AdminLoader;