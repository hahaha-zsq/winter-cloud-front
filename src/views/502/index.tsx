import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
// 1. 引入 Icon 组件
import { Icon } from '@iconify/react';
import styles from './index.module.less';

const BadGatewayFC: React.FC = () => {
    // Game State
    const [sw1, setSw1] = useState(false);
    const [sw2, setSw2] = useState(false);
    const [rangeVal, setRangeVal] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [rebooting, setRebooting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Check System Status
    useEffect(() => {
        const isRangeOk = rangeVal > 90;
        const ready = sw1 && sw2 && isRangeOk;
        setIsReady(ready);
    }, [sw1, sw2, rangeVal]);

    // Handlers
    const handleSwitchChange = (
        setter: React.Dispatch<React.SetStateAction<boolean>>,
        val: boolean
    ) => {
        setter(!val);
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRangeVal(Number(e.target.value));
    };

    const handleReboot = () => {
        if (!isReady) return;

        setRebooting(true);

        // Simulate process
        setTimeout(() => {
            setSuccess(true);
            // Simulate reload after success animation
            setTimeout(() => {
                window.location.reload();
            }, 2200);
        }, 2000);
    };

    return (
        <>
            <div className={classNames(styles.container, "selection:bg-purple-500 selection:text-white")}>

                {/* Top Marquee */}
                <div className={classNames(
                    "w-full bg-black text-white py-2 border-b-4 border-black font-bold text-lg uppercase relative z-20",
                    styles.marqueeContainer,
                    styles.fontMono
                )}>
                    <div className={styles.marqueeContent}>
                        // ERROR 502 // BAD GATEWAY DETECTED // PROTOCOL FAILURE // DO NOT PANIC // TRY REFRESHING // ERROR 502 // BAD GATEWAY DETECTED // PROTOCOL FAILURE // DO NOT PANIC // TRY REFRESHING //
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Panel: Context & Info */}
                        <div className="lg:col-span-7 flex flex-col gap-6">

                            {/* Header Card */}
                            <div className={classNames(styles.nbCard, "p-8 relative overflow-hidden group")}>
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    {/* MdDns -> ic:baseline-dns */}
                                    <Icon icon="ic:baseline-dns" className="text-9xl" />
                                </div>

                                <div className={classNames(
                                    "inline-flex items-center gap-2 border-2 border-black bg-red-500 text-white px-3 py-1 text-sm font-bold mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                                    styles.fontMono
                                )}>
                                    {/* MdWarning -> ic:baseline-warning */}
                                    <Icon icon="ic:baseline-warning" className="text-sm animate-pulse" />
                                    HTTP_STATUS: 502
                                </div>

                                <h1 className={classNames(
                                    "text-7xl md:text-8xl leading-none mb-4 cursor-default",
                                    styles.fontDisplay,
                                    styles.glitchHover
                                )}>
                                    BAD<br />GATEWAY
                                </h1>

                                <p className="text-xl font-bold md:w-3/4 mb-6">
                                    网关收到了无效响应。简单来说：<br />
                                    <span className="bg-yellow-300 px-1">我们的服务器</span> 没能听懂 <span className="bg-purple-300 px-1">上游服务器</span> 说的话。
                                </p>

                                {/* User Checklist */}
                                <div className="border-t-4 border-black pt-6 mt-6">
                                    <h3 className={classNames("font-bold text-lg mb-4 uppercase flex items-center gap-2", styles.fontMono)}>
                                        {/* MdChecklist -> ic:baseline-checklist */}
                                        <Icon icon="ic:baseline-checklist" />
                                        Troubleshooting / 故障排除
                                    </h3>
                                    <ul className={classNames("space-y-3 text-sm", styles.fontMono)}>
                                        <li className="flex items-start gap-3">
                                            {/* MdRefresh -> ic:baseline-refresh */}
                                            <Icon icon="ic:baseline-refresh" className="text-purple-600 text-lg" />
                                            <span><strong>刷新页面：</strong> 很多时候这只是暂时的网络拥堵。</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            {/* MdCookie -> ic:baseline-cookie */}
                                            <Icon icon="ic:baseline-cookie" className="text-purple-600 text-lg" />
                                            <span><strong>清除缓存：</strong> 有时候旧的 Cookie 会导致通信混乱。</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            {/* MdSchedule -> ic:baseline-schedule */}
                                            <Icon icon="ic:baseline-schedule" className="text-purple-600 text-lg" />
                                            <span><strong>稍后再来：</strong> 我们的运维团队可能正在重启服务。</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Footer Links */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => window.location.reload()}
                                    className={classNames(styles.nbBtn, "bg-white hover:bg-gray-100 py-4 flex items-center justify-center gap-2 group")}
                                >
                                    {/* MdRefresh -> ic:baseline-refresh */}
                                    <Icon icon="ic:baseline-refresh" className="group-hover:rotate-180 transition-transform duration-500 text-xl" />
                                    立即刷新
                                </button>
                                <button  onClick={() => {
                                    window.location.href = '/';
                                }} className={classNames(styles.nbBtn, "bg-black text-white hover:bg-gray-800 py-4 flex items-center justify-center gap-2 text-center")}>
                                    {/* MdHome -> ic:baseline-home */}
                                    <Icon icon="ic:baseline-home" className="text-xl" />
                                    返回首页
                                </button>
                            </div>
                        </div>

                        {/* Right Panel: Interactive "Manual Override" */}
                        <div className="lg:col-span-5 flex flex-col h-full">
                            <div className={classNames(styles.nbCard, "bg-purple-100 p-6 flex-grow flex flex-col relative h-full min-h-[500px]")}>

                                {/* Decoration: Screws */}
                                <div className={classNames("top-2 left-2", styles.screw)}><div></div></div>
                                <div className={classNames("top-2 right-2", styles.screw)}><div></div></div>
                                <div className={classNames("bottom-2 left-2", styles.screw)}><div></div></div>
                                <div className={classNames("bottom-2 right-2", styles.screw)}><div></div></div>

                                <div className={classNames(
                                    "bg-black text-white p-3 text-center font-bold text-sm mb-6 border-2 border-black shadow-[4px_4px_0px_0px_#A855F7]",
                                    styles.fontMono
                                )}>
                                    GATEWAY_CONTROL_PANEL_V2.0
                                </div>

                                {/* The Mini Game: Manual Override */}
                                <div className="flex-grow flex flex-col justify-between">

                                    {/* Visualizer */}
                                    <div className={classNames("bg-white border-4 border-black h-32 mb-6 relative overflow-hidden flex items-center justify-center")}>
                                        <div className={classNames("absolute inset-0 opacity-20")}></div>

                                        {/* Connection Line */}
                                        <div className="w-full px-8 flex items-center justify-between relative z-10">
                                            {/* MdRadioButtonUnchecked -> ic:baseline-radio-button-unchecked */}
                                            <Icon icon="ic:baseline-radio-button-unchecked" className="text-4xl" />

                                            <div className="flex-grow h-2 bg-gray-300 mx-4 relative overflow-hidden rounded-full">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-300"
                                                    style={{ width: `${rangeVal}%` }}
                                                ></div>
                                                {/* Glitch block (Visual Obstruction) */}
                                                <div
                                                    className={classNames("absolute top-0 left-1/2 w-4 h-full bg-black animate-pulse transition-opacity duration-300", {
                                                        'opacity-50': sw1 && sw2,
                                                        'hidden': rangeVal === 100 && sw1 && sw2
                                                    })}
                                                ></div>
                                            </div>

                                            {/* MdDns -> ic:baseline-dns */}
                                            <Icon icon="ic:baseline-dns" className={classNames("text-4xl transition-colors duration-300",
                                                (rangeVal === 100 && sw1 && sw2) ? "text-black" : "text-gray-400"
                                            )} />
                                        </div>

                                        <div className={classNames("absolute bottom-1 left-2 text-[10px] font-bold transition-colors", styles.fontMono, {
                                            'text-green-600': isReady,
                                            'text-yellow-600': !isReady && sw1,
                                            'text-red-500': !isReady && !sw1
                                        })}>
                                            STATUS: {isReady ? "READY TO REBOOT" : (sw1 ? "PROXY BYPASSED..." : "CONNECTION ERROR")}
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="space-y-6">
                                        {/* Toggle 1 */}
                                        <div className="flex items-center justify-between bg-white p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            <span className="font-bold text-sm">1. BYPASS PROXY</span>
                                            <input
                                                type="checkbox"
                                                className={styles.nbSwitch}
                                                checked={sw1}
                                                onChange={() => handleSwitchChange(setSw1, sw1)}
                                            />
                                        </div>

                                        {/* Toggle 2 */}
                                        <div className="flex items-center justify-between bg-white p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            <span className="font-bold text-sm">2. FLUSH DNS CACHE</span>
                                            <input
                                                type="checkbox"
                                                className={styles.nbSwitch}
                                                checked={sw2}
                                                onChange={() => handleSwitchChange(setSw2, sw2)}
                                            />
                                        </div>

                                        {/* Slider */}
                                        <div className="bg-white p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-sm">3. SIGNAL BOOST</span>
                                                <span className={classNames("text-sm font-bold", styles.fontMono)}>{rangeVal}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={rangeVal}
                                                className={styles.nbRange}
                                                onChange={handleRangeChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Big Button */}
                                    <button
                                        disabled={!isReady || rebooting}
                                        onClick={handleReboot}
                                        className={classNames(
                                            "mt-8 w-full py-6 text-xl tracking-wider border-4 transition-all relative overflow-hidden",
                                            styles.fontDisplay,
                                            isReady
                                                ? "bg-black text-white border-black hover:bg-gray-800 shadow-[4px_4px_0px_0px_#BEF264]"
                                                : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                                        )}
                                    >
                                        <span className="relative z-10">{rebooting ? "REBOOTING..." : "INITIALIZE REBOOT"}</span>
                                        {/* Progress fill for button */}
                                        <div
                                            className="absolute top-0 left-0 h-full bg-green-400 w-0 transition-all duration-[2000ms] ease-out z-0"
                                            style={{ width: rebooting ? '100%' : '0%' }}
                                        ></div>
                                    </button>

                                </div>

                                {/* Success Overlay */}
                                {success && (
                                    <div className="absolute inset-0 bg-green-400 flex flex-col items-center justify-center z-50 border-4 border-black p-8 text-center animate-in fade-in duration-300">
                                        {/* MdCheckCircle -> ic:baseline-check-circle */}
                                        <Icon icon="ic:baseline-check-circle" className="text-8xl mb-4 animate-bounce" />
                                        <h2 className={classNames("text-4xl mb-2", styles.fontDisplay)}>SYSTEM RESTORED</h2>
                                        <p className={classNames("font-bold text-sm mb-6", styles.fontMono)}>Redirecting to safe channel...</p>
                                        <div className="w-full h-4 border-2 border-black p-0.5 bg-white">
                                            <div className={classNames("h-full bg-black", styles.animateLoadBar)}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default BadGatewayFC;