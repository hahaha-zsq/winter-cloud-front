import {Drawer, Layout, Tooltip} from 'antd'
import {useStore} from '@/store'
import {Header} from "antd/es/layout/layout";
import './index.less'
import {Icon} from "@iconify/react";
import Search from "@/components/navHeader/search";
import UserDropdown from "@/components/navHeader/userDropdown";
import Language from "@/components/navHeader/language";
import Notify from "@/components/navHeader/notify";
import Setting from "@/components/navHeader/setting";
// import {useIntl} from 'react-intl';
// import messages from "@/i18n/i18n";
import {type CSSProperties, useState} from "react";
import {useThemeToken} from "@/hooks/use-theme-token";
import CyanBlur from "@/assets/background/cyan-blur.png";
import RedBlur from "@/assets/background/red-blur.png";
// import Color from "color";
// import MenuFc from "@/components/menu";
import Logo from "@/components/navHeader/logo";
import {ThemeLayout} from "@/types/enum";
import Color from "color";
// import BunBreadCrumb from "@/components/bunBreadCrumb";
// import Theme from "@/components/navHeader/theme";

const NavHeader = () => {
    // const intl = useIntl()
    const [drawerOpen, setDrawerOpen] = useState(false);
    const {colorBgContainer} = useThemeToken()
    const configuration = useStore(state => state.configuration);
    const action = useStore(state => state.actions)
    const {isCollapsed,layout} = {...configuration};
    const bodyStyle: CSSProperties = {
        padding: 0,
    };
    const style: CSSProperties = {
        backdropFilter: 'blur(20px)',
        backgroundImage: `url("${CyanBlur}"), url("${RedBlur}")`,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundColor: Color(colorBgContainer).alpha(0.9).toString(),
        backgroundPosition: 'right top, left bottom',
        backgroundSize: '50, 50%',
    };
    // const {collapsed, updateCollapsed} = useStore()
    const {Sider} = Layout;
    const updateCollapsed = () => {
        action.setConfiguration({
            ...configuration,
            isCollapsed: !configuration.isCollapsed
        })
    }

    return (
        <>
            <Header
                className="bg-color h-[60px] px-[10px] py-[10px] flex items-center justify-between border-b border-dashed">
                {/*在中等下隐藏，在屏幕显示为Flex布局*/}
                <Logo/>
                <div className="xl:w-[calc(100vw-80px)] w-full flex items-center justify-between">
                    {layout === ThemeLayout.Vertical ?
                        <>
                            <div className="hidden xl:flex items-center">
                                <div className="theme flex items-center justify-center"
                                     onClick={() => updateCollapsed()}>
                                    <Tooltip placement="top">
                                        {isCollapsed ?
                                            <Icon icon="ant-design:menu-unfold-outlined" className="text-xl"/> :
                                            <Icon icon="ant-design:menu-fold-outlined" className="text-xl"/>}
                                    </Tooltip>
                                </div>
                                <div>
                                    {/*{breadCrumb ? <BunBreadCrumb/> : null}*/}
                                </div>

                            </div>


                            {/*屏宽达到xl时隐藏，其它情况下显示*/}
                            <div className="theme xl:hidden flex" onClick={() => setDrawerOpen(true)}>
                                <Tooltip placement="right">
                                    <Icon icon="ant-design:menu-outlined" className="text-xl"/>
                                </Tooltip>
                            </div>
                        </>
                        :
                        <>
                            {/*<div className="xl:block hidden">{breadCrumb ? <BunBreadCrumb/> : null}</div>*/}
                            <div className="xl:block hidden">{null}</div>
                            <div className="xl:hidden block"></div>
                        </>
                    }

                    <div className="flex items-center h-full justify-end">
                        <Search/>
                        <Language/>
                        <Setting/>
                        <Notify/>
                        {/*          <Theme/>*/}
                        <UserDropdown/>
                    </div>
                </div>
            </Header>
            <Drawer
                placement="left"
                title={null}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                closable={false}
                width={"70%"}
                styles={{
                    body: {
                        ...bodyStyle
                    },
                    mask: {
                        backgroundColor: 'transparent'
                    }
                }}
                style={style}
            >
                <Layout className="max-h-[100vh] min-h-full">
                    <Sider className="bg-color h-[100vh] overflow-auto" width={"100%"}>
                        {/*<MenuFc closeSideBarDrawer={() => setDrawerOpen(false)}/>*/}
                    </Sider>
                </Layout>
            </Drawer>
        </>
    )
}

export default NavHeader
