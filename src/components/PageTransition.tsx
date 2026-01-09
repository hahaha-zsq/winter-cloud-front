import {motion} from "framer-motion";
import {useLocation} from "react-router-dom";
import type {ReactNode} from "react";
import {useSettings} from "@/store/settingStore";

interface PageTransitionProps {
    children: ReactNode;
}

const animations = {
    zoomIn: {
        initial: {scale: 0.8, opacity: 0},
        animate: {scale: 1, opacity: 1},
        exit: {scale: 0.8, opacity: 0},
    },
    slideLeft: {
        initial: {x: "100%", opacity: 0},
        animate: {x: 0, opacity: 1},
        exit: {x: "-100%", opacity: 0}
    },
    slideRight: {
        initial: {x: "-100%", opacity: 0},
        animate: {x: 0, opacity: 1},
        exit: {x: "100%", opacity: 0}
    },
    slideUp: {
        initial: {y: "100%", opacity: 0},
        animate: {y: 0, opacity: 1},
        exit: {y: "-100%", opacity: 0}
    },
    slideDown: {
        initial: {y: "-100%", opacity: 0},
        animate: {y: 0, opacity: 1},
        exit: {y: "100%", opacity: 0}
    },
    fadeIn: {
        initial: {opacity: 0},
        animate: {opacity: 1},
        exit: {opacity: 0}
    },
    perspective: {
        initial: {rotateX: 90, opacity: 0},
        animate: {rotateX: 0, opacity: 1},
        exit: {rotateX: -90, opacity: 0}
    }
} as const;

type AnimationType = keyof typeof animations;

const PageTransition = ({children}: PageTransitionProps) => {
    const location = useLocation();
    const {pageAnimation, animateValue} = useSettings();

    if (!pageAnimation) {
        return <>{children}</>;
    }

    return (
            <motion.div
                    key={location.pathname}
                    initial="initial"// 定义组件的初始状态，当组件首次挂载时，Framer Motion 会将组件的状态设置为 variants 中定义的 "initial" 状态
                    animate="animate" // 定义组件的动画目标状态，当组件挂载或重新渲染时，Framer Motion 会将组件从 initial 状态过渡到 variants 中定义的 "animate" 状态
                    exit="exit" //定义组件退出时的状态，当组件被卸载时（例如路由切换导致组件消失），Framer Motion 会根据 variants 中定义的 "exit" 状态执行退出动画
                    variants={animations[animateValue as AnimationType] || animations.fadeIn} //定义组件的动画变体
                    transition={{ // 定义动画的过渡效果
                        duration: 0.3,
                        ease: "easeInOut"
                    }}
                    className="w-full h-full"
            >
                {children}
            </motion.div>
    );
};

export default PageTransition; 