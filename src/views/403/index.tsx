import React, { useState, useCallback } from 'react';
import { MdTempleBuddhist, MdKeyboardReturn } from 'react-icons/md';
import styles from './index.module.less';

// 模拟图片资源路径 (请确保 public 文件夹下有对应的图片，或替换为真实 URL)
const MOUNTAIN_BG = "src/assets/mountain.png"; // 这里建议使用真实的图片URL或导入

const KNOCK_MESSAGES = [
    "门后传来沉闷的回响，但无人应答。",
    "你用力推了推，大门纹丝不动。",
    "隐约听到门内有守卫的脚步声，但逐渐远去。",
    "似乎需要某种特殊的令牌才能开启此门。",
    "请勿惊扰禁地沉睡的古灵。"
];

const SEAL_MESSAGES = [
    "符咒闪烁着红光，一股斥力将你的手弹开！",
    "这是上古封印，凡人之力无法揭开。",
    "你的权限等级不足以解除此封印。",
    "警告：强行破阵可能会导致此时空崩塌。",
    "不要白费力气了，回头是岸。"
];

const ForbiddenPageFC: React.FC = () => {
    const [narrativeText, setNarrativeText] = useState("施主请留步，前方乃是禁地。");
    const [isTextVisible, setIsTextVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    // 动画状态
    const [gateShake, setGateShake] = useState(false);
    const [talismanBurn, setTalismanBurn] = useState(false);

    // 显示文本的辅助函数
    const showText = useCallback((text: string) => {
        setIsTextVisible(false);
        setTimeout(() => {
            setNarrativeText(text);
            setIsTextVisible(true);
        }, 300);
    }, []);

    // 敲门逻辑
    const handleKnock = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setGateShake(true);

        const msg = KNOCK_MESSAGES[Math.floor(Math.random() * KNOCK_MESSAGES.length)];
        showText(msg);

        setTimeout(() => {
            setGateShake(false);
            setIsAnimating(false);
        }, 500);
    };

    // 触摸符咒逻辑
    const handleTalismanClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 防止冒泡触发敲门
        if (isAnimating) return;
        setIsAnimating(true);
        setTalismanBurn(true);
        setGateShake(true);

        const msg = SEAL_MESSAGES[Math.floor(Math.random() * SEAL_MESSAGES.length)];
        showText(msg);

        setTimeout(() => {
            setTalismanBurn(false);
            setGateShake(false);
            setIsAnimating(false);
        }, 600);
    };

    const goHome = () => {
        window.location.href = '/';
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <div className={`bg-[#f0ece2] text-[#2c2c2c] overflow-hidden w-full h-screen relative flex flex-col items-center justify-center ${styles.fontSerif}`}>

            {/* Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
                <img
                    src={MOUNTAIN_BG}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
                    alt="Ink Landscape"
                    onError={(e) => {
                        // Fallback 如果图片加载失败，显示纯色渐变
                        e.currentTarget.style.display = 'none';
                    }}
                />
                <div className={`absolute top-1/4 left-1/4 w-64 h-64 ${styles.inkSpot}`}></div>
                <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 ${styles.inkSpot}`} style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Fog Layer */}
            <div className={`${styles.fog} bottom-0 h-1/2`}></div>

            {/* Main Content */}
            <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-4xl px-4">

                {/* Header Text */}
                <div className="text-center mb-8 space-y-2 select-none">
                    <h1 className={`text-6xl md:text-8xl text-red-900 drop-shadow-sm ${styles.fontCalligraphy}`}>
                        四〇三 · 禁地
                    </h1>
                    <p className="text-xl md:text-2xl text-stone-700 tracking-[0.2em] font-light border-t border-b border-stone-300 py-2 inline-block">
                        ACCESS FORBIDDEN
                    </p>
                </div>

                {/* Interactive Gate */}
                <div
                    className={`
            relative w-72 h-96 md:w-96 md:h-[30rem] 
            bg-stone-900 rounded-t-full shadow-2xl border-8 border-stone-800 
            flex overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.01]
            ${gateShake ? styles.shakeHorizontal : ''}
          `}
                    onClick={handleKnock}
                >
                    {/* Left Door */}
                    <div className={`w-1/2 h-full bg-[#3d2b2b] border-r border-stone-950 relative flex items-center justify-center ${styles.woodTexture}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                        {/* Studs */}
                        <div className="absolute top-20 left-4 w-3 h-3 rounded-full bg-[#8c6d46] shadow-md"></div>
                        <div className="absolute top-40 left-4 w-3 h-3 rounded-full bg-[#8c6d46] shadow-md"></div>
                        <div className="absolute bottom-40 left-4 w-3 h-3 rounded-full bg-[#8c6d46] shadow-md"></div>
                        {/* Knocker */}
                        <div className="absolute right-6 w-16 h-16 border-4 border-[#a68b5b] rounded-full flex items-center justify-center hover:bg-black/20 transition-colors">
                            <div className="w-12 h-12 border-4 border-[#a68b5b] rounded-full translate-y-2 group-hover:translate-y-1 transition-transform duration-300"></div>
                        </div>
                    </div>

                    {/* Right Door */}
                    <div className={`w-1/2 h-full bg-[#3d2b2b] border-l border-stone-950 relative flex items-center justify-center ${styles.woodTexture}`}>
                        <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent"></div>
                        {/* Studs */}
                        <div className="absolute top-20 right-4 w-3 h-3 rounded-full bg-[#8c6d46] shadow-md"></div>
                        <div className="absolute top-40 right-4 w-3 h-3 rounded-full bg-[#8c6d46] shadow-md"></div>
                        <div className="absolute bottom-40 right-4 w-3 h-3 rounded-full bg-[#8c6d46] shadow-md"></div>
                        {/* Knocker */}
                        <div className="absolute left-6 w-16 h-16 border-4 border-[#a68b5b] rounded-full flex items-center justify-center hover:bg-black/20 transition-colors">
                            <div className="w-12 h-12 border-4 border-[#a68b5b] rounded-full translate-y-2 group-hover:translate-y-1 transition-transform duration-300"></div>
                        </div>
                    </div>

                    {/* The Seal (Talisman) */}
                    <div
                        className={`
              absolute top-[15%] left-1/2 -translate-x-1/2 w-20 h-56 
              bg-yellow-400 shadow-lg transform rotate-2 origin-top cursor-pointer z-30 
              flex flex-col items-center justify-center 
              border-l-2 border-r-2 border-orange-500/30
              ${styles.paperTexture}
              ${talismanBurn ? styles.talismanBurn : ''}
            `}
                        onClick={handleTalismanClick}
                    >
                        <div className="w-full h-full border border-red-500/50 p-1 flex flex-col items-center text-red-600">
                            <div className="text-xs font-bold border-b border-red-500 w-full text-center pb-1 mb-1">敕令</div>
                            <div className={`flex-1 text-4xl flex items-center select-none ${styles.fontCalligraphy} ${styles.writingVertical}`}>
                                禁止访问
                            </div>
                            <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center mt-1">
                                <div className="w-4 h-4 bg-red-600 rounded-full opacity-50"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Narrative Text Output */}
                <div className="h-20 mt-8 flex items-center justify-center">
                    <p className={`
            text-stone-800 text-lg md:text-xl text-center font-medium min-h-[3rem] 
            transition-opacity duration-300
            ${isTextVisible ? 'opacity-100' : 'opacity-0'}
          `}>
                        {narrativeText}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-col md:flex-row gap-6">
                    <button
                        onClick={goHome}
                        className="group relative px-8 py-3 bg-stone-800 text-[#f0ece2] rounded overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                        <div className="absolute inset-0 w-full h-full bg-stone-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                        <div className="relative flex items-center gap-2 font-medium tracking-widest">
                            <MdTempleBuddhist className="text-xl" />
                            <span>御剑回城 (返回首页)</span>
                        </div>
                    </button>

                    <button
                        onClick={goBack}
                        className="group relative px-8 py-3 bg-transparent border-2 border-stone-800 text-stone-800 rounded overflow-hidden hover:bg-stone-800 hover:text-[#f0ece2] transition-colors duration-300"
                    >
                        <div className="relative flex items-center gap-2 font-medium tracking-widest">
                            <MdKeyboardReturn className="text-xl" />
                            <span>且退一步 (返回上一页)</span>
                        </div>
                    </button>
                </div>

            </div>

            {/* Corner Decor */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 w-24 h-24 border-t-4 border-r-4 border-red-900/20 rounded-tr-3xl pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-24 h-24 border-b-4 border-l-4 border-red-900/20 rounded-bl-3xl pointer-events-none"></div>

        </div>
    );
};

export default ForbiddenPageFC;