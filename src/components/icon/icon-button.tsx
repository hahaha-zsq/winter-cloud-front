import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { ButtonProps } from "antd";

type Props = {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
} & ButtonProps;

const IconButton = forwardRef<HTMLDivElement, Props>(
    (
        {
            children,
            className,
            style,
            onClick,
            onMouseEnter,// 确保 Tooltip 的子元素能接受 onMouseEnter、onMouseLeave.
            onMouseLeave,
            onPointerEnter,
            onPointerLeave,
            onFocus,
        },
        ref
    ) => {
        return (
            <div
                ref={ref} // 处理	Dropdown 必须能拿到触发元素的真实 DOM•	它靠的是 ref
                style={style}
                className={`flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-hover ${className}`}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onFocus={onFocus}
            >
                {children}
            </div>
        );
    }
);

IconButton.displayName = "IconButton";

export default IconButton;