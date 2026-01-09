import {Layout, Watermark} from 'antd';
import NavHeader from "@/components/navHeader";
import {useStore} from "@/store";
import {useOutlet} from "react-router-dom";
// import MenuFc from "@/components/menu";
import {NAV_COLLAPSED_WIDTH, NAV_WIDTH} from "@/layout/config";
import {ThemeLayout} from '@/types/enum';
import storage from "@/utils/storage";
import {AnimatePresence} from "framer-motion";
import PageTransition from "@/components/PageTransition";
const App: React.FC = () => {
    const configuration = useStore(state => state.configuration);
    const {isCollapsed,isStretch,layout,mode,isEnableWaterMark}={...configuration}
    const pageOutlet = useOutlet();
    const {Sider, Content} = Layout;



    let width


    if (layout === ThemeLayout.Vertical && !isStretch && !isCollapsed) {	// 垂直模式+收缩模式+侧边栏没收缩
        // 达到xl这个宽度的断点后，侧边栏260，主体区域由于是收缩模式，虽然左右内边距，但是border-box的width和height从border算起,包含border和padding，所以宽度就是100vw-(260),小于xl断点宽度的，由于侧边菜单栏栏没有了，所以宽度100vw
        width = "xl:w-[calc(100vw-260px)] w-[100vw]";
    } else if (layout === ThemeLayout.Vertical && !isStretch && isCollapsed) {	// 垂直模式+收缩模式+侧边栏收缩
        // 侧边栏收缩80，主体区域由于是收缩模式，虽然左右内边距，但是border-box的width和height从border算起,包含border和padding，所以宽度就是100vw-(80)
        width = "xl:w-[calc(100vw-80px)] w-[100vw]";
    } else if (layout === ThemeLayout.Vertical && isStretch && !isCollapsed) {// 垂直模式+展开模式+侧边栏没收缩
        // 侧边栏260，主体区域由于是展开模式，由于用的是内边距，所以主体区域的宽度为100vw-(260)
        width = "xl:w-[calc(100vw-260px)] w-[100vw]";
    } else if (layout === ThemeLayout.Vertical && isStretch && isCollapsed) {// 垂直模式+展开模式+侧边栏收缩
        // 侧边栏80，主体区域由于是展开模式，由于用的是内边距，所以主体区域的宽度为100vw-(80)
        width = "xl:w-[calc(100vw-80px)] w-[100vw]";
    } else {
        width = "w-full"
    }


    return (
        <>
            <Watermark content={isEnableWaterMark ? storage.get("userInfo")?.nickName ?? "winter-cloud" : ""}>
                {/*如果是Vertical模式的布局显示*/}
                {layout === ThemeLayout.Vertical
                    ?
                    <Layout>
                        <NavHeader/>
                        <div>3232232</div>
                        <Layout>
                            <Sider className="hidden xl:block bg-color h-[calc(100vh-60px)]" collapsed={isCollapsed}
                                   width={isCollapsed ? NAV_COLLAPSED_WIDTH : NAV_WIDTH}>
                                {/*<MenuFc/>*/}
                                <div>menuFC</div>

                            </Sider>


                            <div className={`h-[calc(100vh-60px)]  ${width}  overflow-auto flex items-center justify-center pt-[12px] ${isStretch ? 'px-[20px]' : 'px-[50px] rounded-lg'}`}>

                                    <Content
                                        className={`w-full h-full`}
                                    >
                                        <AnimatePresence mode="wait">
                                            <PageTransition>
                                                {pageOutlet}
                                            </PageTransition>
                                        </AnimatePresence>
                                    </Content>
                                </div>

                        </Layout>
                        {/*<Footer className="text-center py-2">*/}
                        {/*	馒头系统 ©{new Date().getFullYear()} Created by 大胆刁民*/}
                        {/*</Footer>*/}
                    </Layout>
                    :
                    // 不是Vertical模式,即水平模式的显示
                    <Layout>
                        <NavHeader/>
                        <div>menuFC</div>

                        {/*<MenuFc/>*/}
                        <div className="w-screen flex items-center justify-center">
                            <Content
                                className={`w-full h-[100vh] max-h-[calc(100vh-105px)]  overflow-auto flex-grow pt-[12px] ${isStretch ? 'px-[20px]' : 'px-[50px] rounded-lg'}`}
                            >
                                <AnimatePresence mode="wait">
                                    <PageTransition>
                                        {pageOutlet}
                                    </PageTransition>
                                </AnimatePresence>

                            </Content>
                        </div>
                    </Layout>
                }
            </Watermark>
        </>


    );
};

export default App;
