import {Icon} from "@iconify/react";
import {NAV_COLLAPSED_WIDTH, NAV_WIDTH} from "@/layout/config";
import {useStore} from "@/store";
import {ThemeLayout} from "@/types/enum";
import {useSettings} from "@/store/settingStore";

const LogoFc = () => {
	const configuration = useStore(state => state.configuration);
	const {isCollapsed}={...configuration}

	const {themeLayout} = useSettings();
	return (
		<>
			{themeLayout === ThemeLayout.Vertical ?
				<div style={{
					width: isCollapsed ? NAV_COLLAPSED_WIDTH : NAV_WIDTH
				}} className="gap-3 bg-color  items-center border-b border-dashed justify-center h-[60px]  xl:flex hidden">
					<Icon icon="logos:bun" className="text-3xl"/>
					{isCollapsed ? <></> : <div className="text-2xl font-sb">
					<span>
					Bun
					</span>
					</div>}
				</div>
				:
				<div className="bg-color items-center border-b border-dashed justify-center h-[60px] w-[60px] flex">
					<Icon icon="logos:bun" className="text-3xl"/>
				</div>
			}


		</>
	)
}
export default LogoFc
