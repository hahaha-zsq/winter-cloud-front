import React, { useEffect, useRef, useState } from 'react';
import { FaRocket } from 'react-icons/fa';
import { MdRadar } from 'react-icons/md';
import classNames from 'classnames';
import styles from './index.module.less';

// --- 类型定义 ---
interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
    opacity: number;
    reset: (width: number, height: number, warp: boolean) => void;
    update: (width: number, height: number, warp: boolean, mouseX: number, mouseY: number) => void;
    draw: (ctx: CanvasRenderingContext2D, width: number, height: number, warp: boolean) => void;
}

const NotFoundFC: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bgImage = "src/assets/rocket.png";

    // 视觉状态管理
    const [isWarping, setIsWarping] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    // Refs 用于动画循环
    const mousePos = useRef({ x: 0, y: 0 });
    const starsRef = useRef<Star[]>([]);
    const animationFrameId = useRef<number>(0);

    // --- 星空逻辑类 ---
    class StarImpl implements Star {
        x = 0; y = 0; z = 0; size = 0; opacity = 0;

        constructor(width: number, height: number) {
            this.reset(width, height, false);
        }

        reset(width: number, height: number, warp: boolean) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 2 + 0.5; // 深度
            this.size = Math.random() * 2;
            this.opacity = Math.random();

            // 如果在曲速模式下重置，从中心附近生成
            if (warp) {
                this.x = width / 2 + (Math.random() - 0.5) * 50;
                this.y = height / 2 + (Math.random() - 0.5) * 50;
                this.size = 0.5;
            }
        }

        update(width: number, height: number, warp: boolean, mouseX: number, mouseY: number) {
            // 视差移动 (Parallax)
            const parallaxX = (mouseX - width / 2) * 0.0005 * this.z;
            const parallaxY = (mouseY - height / 2) * 0.0005 * this.z;

            if (!warp) {
                this.x -= parallaxX;
                this.y -= parallaxY;
            }

            // 曲速模式逻辑 (Warp Speed)
            if (warp) {
                const dx = this.x - width / 2;
                const dy = this.y - height / 2;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const moveFactor = dist === 0 ? 1 : dist;

                // 向四周飞散
                this.x += (dx / moveFactor) * 10 * this.z;
                this.y += (dy / moveFactor) * 10 * this.z;
                this.size += 0.1;
            }

            // 边界检查与重置
            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset(width, height, warp);
            }
        }

        draw(ctx: CanvasRenderingContext2D, width: number, height: number, warp: boolean) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // 曲速模式下绘制拖尾
            if (warp) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
                ctx.lineWidth = this.size;
                ctx.moveTo(this.x, this.y);
                const dx = this.x - width / 2;
                const dy = this.y - height / 2;
                ctx.lineTo(this.x - dx * 0.1, this.y - dy * 0.1);
                ctx.stroke();
            }
        }
    }

    // --- 初始化与 Resize ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            starsRef.current = Array.from({ length: 200 }, () => new StarImpl(canvas.width, canvas.height));
        };

        window.addEventListener('resize', resize);
        resize(); // 初始化调用

        return () => window.removeEventListener('resize', resize);
    }, []);

    // --- 动画循环 (Render Loop) ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const render = () => {
            const width = canvas.width;
            const height = canvas.height;

            // 清除画布并绘制星云背景
            ctx.clearRect(0, 0, width, height);

            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
            gradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
            gradient.addColorStop(0.5, 'rgba(88, 28, 135, 0.1)'); // 微弱的紫色光晕
            gradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // 绘制星星
            starsRef.current.forEach(star => {
                star.update(width, height, isWarping, mousePos.current.x, mousePos.current.y);
                star.draw(ctx, width, height, isWarping);
            });

            animationFrameId.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [isWarping]);

    // --- 鼠标交互 (闪光轨迹) ---
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };

            // 随机生成光点粒子
            if (Math.random() > 0.8) {
                const sparkle = document.createElement('div');
                sparkle.style.position = 'fixed';
                sparkle.style.width = '6px';
                sparkle.style.height = '6px';
                sparkle.style.background = 'white';
                sparkle.style.borderRadius = '50%';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '50';
                sparkle.style.boxShadow = '0 0 10px #fff, 0 0 20px #0ff';
                sparkle.style.left = `${e.clientX}px`;
                sparkle.style.top = `${e.clientY}px`;

                document.body.appendChild(sparkle);

                const angle = Math.random() * Math.PI * 2;
                const velX = Math.cos(angle) * 2;
                const velY = Math.sin(angle) * 2;
                let opacity = 1;

                const animateSparkle = () => {
                    opacity -= 0.05;
                    sparkle.style.opacity = opacity.toString();
                    sparkle.style.left = `${parseFloat(sparkle.style.left) + velX}px`;
                    sparkle.style.top = `${parseFloat(sparkle.style.top) + velY}px`;

                    if (opacity > 0) {
                        requestAnimationFrame(animateSparkle);
                    } else {
                        sparkle.remove();
                    }
                };
                requestAnimationFrame(animateSparkle);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // --- 按钮事件处理 (纯视觉) ---
    const handleWarp = () => {
        setIsScanning(true);
        setIsWarping(true);

        // 扫描线动画结束后重置
        setTimeout(() => setIsScanning(false), 1500);
        // 曲速效果结束后重置
        setTimeout(() => {
            setIsWarping(false);
            // 重置星星位置，防止聚集在边缘
            if (canvasRef.current) {
                const { width, height } = canvasRef.current;
                starsRef.current.forEach(s => s.reset(width, height, false));
            }
        }, 2000);
    };

    const handleReturn = () => {
        console.log("Returning to Earth...");
        window.location.href = '/';
    };

    return (
        <div className={classNames("bg-slate-950 text-white w-full h-screen relative overflow-hidden", styles.exoFont)}>

            {/* 扫描线特效 (纯 CSS 动画控制) */}
            <div className={classNames(styles.scanLine, { [styles.animatingScan]: isScanning })} />

            {/* Canvas 星空背景 */}
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />

            {/* 主要内容容器 */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">

                <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">

                    {/* 左侧：视觉图 */}
                    <div className="w-full md:w-1/2 flex flex-col items-center relative group">
                        {/* 行星背景光晕 */}
                        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full scale-75 animate-pulse" />

                        {/* 宇航员图片 */}
                        <div className="relative w-72 h-72 md:w-96 md:h-96 transition-transform duration-500 transform group-hover:scale-105">
                            <img
                                src={bgImage}
                                alt="Lost Astronaut"
                                className={classNames(
                                    "w-full h-full object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]",
                                    styles.floating
                                )}
                            />
                            {/* 漂浮装饰 */}
                            <div className={classNames("absolute -top-4 -right-4 text-4xl", styles.floatingDelayed)}>🛰️</div>
                            <div className={classNames("absolute bottom-10 -left-8 text-3xl", styles.floating)} style={{ animationDelay: '1s' }}>☄️</div>
                        </div>
                    </div>

                    {/* 右侧：文字内容 */}
                    <div className="w-full md:w-1/2 text-center md:text-left space-y-6 backdrop-blur-sm bg-slate-900/30 p-8 rounded-2xl border border-slate-700/50 shadow-2xl">

                        <div className="relative inline-block">
                            <h1 className={classNames(
                                "text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-600 select-none",
                                styles.orbitronFont,
                                styles.glitchWrapper
                            )}>
                                404
                            </h1>
                        </div>

                        <div className="space-y-2">
                            <h2 className={classNames("text-2xl md:text-3xl font-bold text-white tracking-wide", styles.orbitronFont)}>
                                休斯顿，我们有麻烦了。<br />
                                <span className="text-cyan-400 text-xl md:text-2xl opacity-90">Houston, we have a problem.</span>
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                你寻找的页面似乎漂流到了未知的星系。坐标无效，或者被黑洞吞噬了。
                            </p>
                            <p className="text-slate-400 text-sm italic">
                                The page you are looking for has drifted into an unexplored sector.
                            </p>
                        </div>

                        {/* 按钮组 */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                            <button
                                onClick={handleReturn}
                                className="group relative px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full font-bold transition-all duration-300 shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] flex items-center justify-center gap-2 overflow-hidden"
                            >
                <span className={classNames(
                    "absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-none",
                    styles.shimmerEffect
                )}></span>
                                <FaRocket className="text-xl" />
                                <span>返回地球</span>
                            </button>

                            <button
                                onClick={handleWarp}
                                className="px-8 py-3 bg-transparent border border-slate-500 hover:border-purple-400 hover:text-purple-300 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <MdRadar className="text-xl" />
                                <span>扫描星区</span>
                            </button>
                        </div>

                        {/* 系统状态栏 */}
                        <div className="pt-6 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500 font-mono">
                            <span>ERR_CODE: UNIVERSE_NOT_FOUND</span>
                            <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                SIGNAL LOST
              </span>
                        </div>
                    </div>
                </div>

                {/* 底部已经移除了音频互动提示 */}

            </div>
        </div>
    );
};

export default NotFoundFC;