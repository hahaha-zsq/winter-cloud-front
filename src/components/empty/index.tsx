import React from 'react';
import styles from './index.module.less';

interface EmptyStateProps {
	title?: string;
	description?: string;
	onReset?: () => void;
	className?: string;
}

const EmptyStateDecor: React.FC<EmptyStateProps> = ({
														title = '未发现相关结果',
														description = '换个关键词试试？也许这只是个小小的迷藏。',
														onReset,
														className = '',
													}) => {
	return (
		<div
			className={`flex flex-col items-center justify-center p-6 w-full text-center ${className}`}
		>
			{/* 尺寸控制：
         - w-40 (160px) -> sm:w-56 (224px)
         - 相比上一版稍微大了一点点，为了容纳更多装饰物，但依然保持紧凑
      */}
			<div className={`${styles.illustrationWrapper} w-40 sm:w-56 mb-6 relative z-10`}>
				<svg
					viewBox="0 0 300 240"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					{/* --- 层级 1: 背景氛围装饰 (静态) --- */}

					{/* 大的不规则背景色块 */}
					<path d="M150 40C200 40 260 70 270 120C280 170 220 210 160 215C100 220 30 190 25 130C20 70 90 40 150 40Z" className="fill-blue-50" />
					<circle cx="240" cy="80" r="30" className="fill-indigo-50" />
					<circle cx="60" cy="180" r="20" className="fill-purple-50" />

					{/* 点阵装饰 (增加科技感/细腻感) */}
					<g className="fill-blue-200 opacity-50">
						<circle cx="50" cy="80" r="1.5" />
						<circle cx="65" cy="80" r="1.5" />
						<circle cx="50" cy="95" r="1.5" />
						<circle cx="65" cy="95" r="1.5" />

						<circle cx="250" cy="180" r="1.5" />
						<circle cx="265" cy="180" r="1.5" />
						<circle cx="250" cy="195" r="1.5" />
						<circle cx="265" cy="195" r="1.5" />
					</g>

					{/* --- 层级 2: 核心主体 (文件夹与搜索) --- */}
					<g transform="translate(75, 55)">
						{/* 文件夹后层 */}
						<rect x="15" y="10" width="120" height="90" rx="8" className="fill-blue-100" />
						{/* 文件夹主层 */}
						<rect x="0" y="25" width="120" height="90" rx="8" className="fill-white stroke-blue-200" strokeWidth="3"/>

						{/* 文件夹上的装饰线 */}
						<rect x="20" y="50" width="80" height="6" rx="3" className="fill-gray-100"/>
						<rect x="20" y="70" width="50" height="6" rx="3" className="fill-gray-100"/>

						{/* 放大镜 */}
						<g transform="translate(85, 80) rotate(-10)">
							<circle cx="0" cy="0" r="35" className="fill-blue-50/90 stroke-blue-500" strokeWidth="4"/>
							<path d="M22 22 L 40 40" className="stroke-blue-500" strokeWidth="6" strokeLinecap="round"/>
							{/* 镜片反光 */}
							<path d="M-20 -15 Q -10 -25, 5 -20" className="stroke-white" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
							{/* 问号 */}
							<text x="-10" y="12" className="fill-blue-600 text-4xl font-bold" style={{fontFamily: 'sans-serif'}}>?</text>
						</g>
					</g>

					{/* --- 层级 3: 漂浮的前景装饰物 (带独立动画) --- */}

					{/* 左上角：纸飞机 */}
					<g className={`${styles.decorationItem} ${styles.delay1}`}>
						<path d="M40 50 L 70 60 L 40 75 L 45 60 Z" className="fill-blue-400" />
						<path d="M30 55 Q 35 58, 38 56" className="stroke-blue-300" strokeWidth="1" strokeDasharray="2 2" fill="none"/>
					</g>

					{/* 右上角：闪烁的星星 */}
					<g className={`${styles.decorationItem} ${styles.delay2}`} transform="translate(230, 60)">
						<path d="M10 0 L 12 7 L 19 10 L 12 13 L 10 20 L 8 13 L 1 10 L 8 7 Z" className="fill-yellow-400" />
					</g>

					{/* 右下角：波浪线 */}
					<path
						d="M200 160 Q 210 150, 220 160 T 240 160"
						className={`stroke-indigo-300 ${styles.decorationItem} ${styles.delay3}`}
						strokeWidth="3"
						strokeLinecap="round"
						fill="none"
					/>

					{/* 左下角：圆圈和加号 */}
					<circle cx="80" cy="190" r="5" className={`fill-red-300 ${styles.decorationItem}`} />
					<g transform="translate(40, 140)" className={`${styles.decorationItem} ${styles.delay2}`}>
						<rect x="0" y="4" width="10" height="2" className="fill-blue-300"/>
						<rect x="4" y="0" width="2" height="10" className="fill-blue-300"/>
					</g>

				</svg>
			</div>

			{/* 文本部分 */}
			<h3 className="text-base sm:text-lg font-bold text-gray-800 tracking-wide">
				{title}
			</h3>

			<p className="mt-2 text-sm text-gray-500 max-w-[260px] sm:max-w-xs mx-auto leading-relaxed">
				{description}
			</p>

			{/* 按钮部分 - 保持简洁 */}
			{onReset && (
				<button
					onClick={onReset}
					className="mt-6 px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
				>
					清空筛选
				</button>
			)}
		</div>
	);
};

export default EmptyStateDecor;