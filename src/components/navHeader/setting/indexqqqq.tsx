// import {
//     Button,
//     Card,
//     ColorPickerProps,
//     ColorPicker,
//     Drawer,
//     Select,
//     Switch,
//     Tooltip,
//     Row,
//     Col,
//     type GetProp
// } from "antd";
// import {Icon} from "@iconify/react";
// import "../index.less"
// // import {useIntl} from 'react-intl';
// import React, {CSSProperties, useEffect, useState} from "react";
// import IconButton from "@/components/icon/icon-button";
// import {CloseOutlined, LeftOutlined, QuestionCircleOutlined, RightOutlined} from "@ant-design/icons";
// import {useThemeToken} from "@/hooks/use-theme-token";
// import {useSettingActions, useSettings} from "@/store/settingStore";
// import {ThemeLayout, ThemeMode} from "@/types/enum";
// import {generate, orange, presetPalettes, red} from '@ant-design/colors';
// // Color.js 是一个轻量级的 JavaScript 库，用于处理颜色
// import Color from 'color';
// import CyanBlur from '@/assets/images/background/cyan-blur.png';
// import RedBlur from '@/assets/images/background/red-blur.png';
// // import screenfull from "screenfull";
// // import messages from "@/i18n/i18n";
// // import {cyan} from "@ant-design/colors/es/presets";
//
// type Presets = Required<ColorPickerProps>['presets'][number];
// type ColorType = GetProp<ColorPickerProps, 'value'>;
// const Setting = () => {
//     const intl = useIntl()
//     const genPresets = (presets = presetPalettes) =>
//             Object.entries(presets).map<Presets>(([label, colors]) => ({label, colors}));
//     // const presets = genPresets({primary: generate(useThemeToken().colorPrimary), red, green});
//     const [drawerOpen, setDrawerOpen] = useState(false);
//     const {colorPrimary, colorBgBase, colorTextSecondary, colorTextTertiary, colorBgContainer} =
//             useThemeToken();
//     const settings = useSettings();
//     const {
//         themeColorPrimary,
//         themeColorSuccess,
//         themeColorError,
//         themeColorWarning,
//         themeMode,
//         animateValue,
//         themeLayout,
//         themeStretch,
//         breadCrumb,
//         multiTab,
//         watermark,
//         pageAnimation
//     } =
//             settings;
//     const {setSettings} = useSettingActions();
//     const animationArr = [
//         {"label": "缩放", "value": "zoomIn"},
//         {"label": "向左滑动", "value": "slideLeft"},
//         {"label": "向右滑动", "value": "slideRight"},
//         {"label": "淡入淡出", "value": "fadeIn"},
//         {"label": "向上滑动", "value": "slideUp"},
//         {"label": "向下滑动", "value": "slideDown"},
//         {"label": "3D翻转", "value": "perspective"}
//     ]
//     const colorPreset = [
//         {
//             "title": "Primary", "presets": genPresets({
//                 "primary": generate(useThemeToken().colorPrimary), "blue": [
//                     "#b0d5df", "#c6e6e8", "#93d5dc", "#51c4d3",
//                     "#29b7cb", "#0eb0c9", "#0f95b0", "#1e9eb3",
//                     "#1491a8", "#21373d"
//                 ], cyan
//             }),
//             "defaultValue": themeColorPrimary, "changeColor": (value: ColorType, hex: string) => {
//                 console.log(value, hex)
//                 setSettings({
//                     ...settings,
//                     themeColorPrimary: hex,
//                 });
//             }
//         },
//         {
//             "title": "Success", "presets": genPresets({
//                 "Success": generate(useThemeToken().colorSuccess), "green": [
//                     "#b9dec9", "#9eccab", "#add5a2", "#8cc269",
//                     "#41b349", "#43b244", "#12a182", "#1ba784",
//                     "#248067", "#428675"
//                 ]
//             }), "defaultValue": themeColorSuccess, "changeColor": (value: ColorType, hex: string) => {
//                 console.log(value)
//                 setSettings({
//                     ...settings,
//                     themeColorSuccess: hex,
//                 });
//             }
//         },
//         {
//             "title": "Warning",
//             "presets": genPresets({"Warning": generate(useThemeToken().colorWarning), orange}),
//             "defaultValue": themeColorWarning,
//             "changeColor": (value: ColorType, hex: string) => {
//                 console.log(value)
//                 setSettings({
//                     ...settings,
//                     themeColorWarning: hex,
//                 });
//             }
//         },
//         {
//             "title": "Error",
//             "presets": genPresets({"Error": generate(useThemeToken().colorError), red}),
//             "defaultValue": themeColorError,
//             "changeColor": (value: ColorType, hex: string) => {
//                 console.log(value)
//                 setSettings({
//                     ...settings,
//                     themeColorError: hex,
//                 });
//             }
//         },
//     ]
//
//     useEffect(() => {
//         setThemeMode(themeMode)
//     }, [])
//     // 设置主题模式的函数
//     const setThemeMode = (themeMode: ThemeMode, event?: React.MouseEvent<HTMLElement>) => {
//         // 添加调试信息
//         console.log("Theme transition starting", {
//             supported: !!document.startViewTransition,
//             themeMode,
//             event: !!event
//         });
//
//         // 如果没有事件对象或不支持 View Transitions API，使用默认切换
//         if (!event || !document.startViewTransition) {
//             updateThemeMode(themeMode);
//             return;
//         }
//
//         // 获取点击位置
//         const button = event.currentTarget;
//         // getBoundingClientRect方法返回一个 DOMRect 对象，该对象包含元素相对于视口（viewport）的位置和尺寸信息
//         const rect = button.getBoundingClientRect();
//
//         // 计算最大半径(屏幕对角线长度)
//         // Math.hypot计算直角三角形的斜边长度
//         const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);
//         const isDarkMode = themeMode === ThemeMode.Dark;
//
//         // 为暗色模式使用点击位置，为亮色模式使用左下角
//         /*
//         * x: 元素的左边缘相对于视口的水平距离。
//         * y: 元素的顶边相对于视口的垂直距离。
//         * width: 元素的宽度。
//         * height: 元素的高度。
//         * top: 元素的顶边相对于视口的距离。
//         * right: 元素的右边相对于视口的距离。
//         * bottom: 元素的底边相对于视口的距离。
//         * left: 元素的左边相对于视口的距离。
//         *
//         * */
//         // const x = isDarkMode ? (rect.left + rect.width / 2) : 0;
//         // const y = isDarkMode ? (rect.top + rect.height / 2) : window.innerHeight;
//
//         const x =(rect.left + rect.width / 2)
//         const y =  (rect.top + rect.height / 2)
//         const r = Math.hypot(
//                 Math.max(x, window.innerWidth - x),
//                 Math.max(y, window.innerHeight - y)
//         );
//
//         const root = document.documentElement;
//         root.style.setProperty('--x', `${x}px`);
//         root.style.setProperty('--y', `${y}px`);
//         root.style.setProperty('--r', `${r}px`);
//
//         if (document.startViewTransition) {
//             // 等待变量应用后再触发过渡
//             requestAnimationFrame(() => {
//                 document.startViewTransition(() => updateThemeMode(themeMode));
//             });
//         } else {
//             updateThemeMode(themeMode)
//         }
//
//     };
//     // 将原有的主题切换逻辑抽取为单独的函数
//     const updateThemeMode = (themeMode: ThemeMode) => {
//         setSettings({
//             ...settings,
//             themeMode,
//         });
//         if (themeMode === ThemeMode.Dark) {
//             document.documentElement.dataset.theme = 'dark'
//             document.documentElement.classList.remove('light')
//             document.documentElement.classList.add('dark')
//         } else {
//             document.documentElement.dataset.theme = 'light'
//             document.documentElement.classList.remove('dark')
//             document.documentElement.classList.add('light')
//         }
//     };
//
//     const setThemeLayout = (themeLayout: ThemeLayout) => {
//         setSettings({
//             ...settings,
//             themeLayout,
//         });
//     };
//
//     const setThemeStretch = (themeStretch: boolean) => {
//         setSettings({
//             ...settings,
//             themeStretch,
//         });
//     };
//     const setBreadCrumb = (checked: boolean) => {
//         setSettings({
//             ...settings,
//             breadCrumb: checked,
//         });
//     };
//
//     const setMultiTab = (checked: boolean) => {
//         setSettings({
//             ...settings,
//             multiTab: checked,
//         });
//     };
//     const setWatermark = (checked: boolean) => {
//         setSettings({
//             ...settings,
//             watermark: checked,
//         });
//     };
//     const setAnimateValue = (value: string) => {
//         setSettings({
//             ...settings,
//             animateValue: value,
//         });
//     };
//
//     const setPageAnimation = (checked: boolean) => {
//         setSettings({
//             ...settings,
//             pageAnimation: checked,
//         });
//     };
//     const style: CSSProperties = {
//         backdropFilter: 'blur(20px)',
//         backgroundImage: `url("${CyanBlur}"), url("${RedBlur}")`,
//         backgroundRepeat: 'no-repeat, no-repeat',
//         backgroundColor: Color(colorBgContainer).alpha(0.9).toString(),
//         backgroundPosition: 'right top, left bottom',
//         backgroundSize: '50, 50%',
//     };
//     const bodyStyle: CSSProperties = {
//         padding: 0,
//     };
//     const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
//     const toggleFullScreen = () => {
//         if (screenfull.isEnabled) {
//             screenfull.toggle();
//             setIsFullscreen(!isFullscreen);
//         }
//     };
//     const layoutBackground = (layout: ThemeLayout) =>
//             themeLayout === layout
//                     ? `linear-gradient(135deg, ${colorBgBase} 0%, ${colorPrimary} 100%)`
//                     : '#919eab';
//
//
//     return (
//             <>
//                 <Tooltip placement="top" title={intl.formatMessage(messages.settingTitle)}>
//                     <div className="theme" onClick={() => setDrawerOpen(true)}>
//                         <Icon icon="ant-design:setting-outlined" className="text-xl"/>
//                     </div>
//                 </Tooltip>
//                 {/*<Drawer*/}
//                 {/*        placement="right"*/}
//                 {/*        title={intl.formatMessage(messages.settingTitle)}*/}
//                 {/*        onClose={() => setDrawerOpen(false)}*/}
//                 {/*        open={drawerOpen}*/}
//                 {/*        closable={false}*/}
//                 {/*        width={280}*/}
//                 {/*        styles={{*/}
//                 {/*            body: {*/}
//                 {/*                ...bodyStyle*/}
//                 {/*            },*/}
//                 {/*            mask: {*/}
//                 {/*                backgroundColor: 'transparent'*/}
//                 {/*            }*/}
//                 {/*        }}*/}
//                 {/*        style={style}*/}
//                 {/*        extra={*/}
//                 {/*            <IconButton onClick={() => setDrawerOpen(false)} className="h-9 w-9 hover:scale-105">*/}
//                 {/*                <CloseOutlined className="text-gray-400"/>*/}
//                 {/*            </IconButton>*/}
//                 {/*        }*/}
//                 {/*        // 页脚全屏组件*/}
//                 {/*        footer={*/}
//                 {/*            <Button type="dashed" block size="large" onClick={toggleFullScreen}>*/}
//                 {/*                <div className="flex items-center justify-center">*/}
//                 {/*                    {isFullscreen ? (*/}
//                 {/*                            <>*/}
//                 {/*                                <Icon icon="ant-design:fullscreen-exit-outlined" className="text-xl"/>*/}
//                 {/*                                <span className="ml-2">{intl.formatMessage(messages.headerSettingExitFullScreen)}</span>*/}
//                 {/*                            </>*/}
//                 {/*                    ) : (*/}
//                 {/*                            <>*/}
//                 {/*                                <Icon icon="ant-design:fullscreen-outlined" className="text-xl"/>*/}
//                 {/*                                <span className="ml-2 text-gray">{intl.formatMessage(messages.headerSettingFullScreen)}</span>*/}
//                 {/*                            </>*/}
//                 {/*                    )}*/}
//                 {/*                </div>*/}
//                 {/*            </Button>*/}
//                 {/*        }*/}
//                 {/*>*/}
//                 {/*    /!*<StyleWrapper $themeMode={themeMode} className={`overflow-auto`}>*!/*/}
//
//                 {/*    <div className="flex flex-col gap-6 p-6">*/}
//                 {/*        /!* theme mode *!/*/}
//                 {/*        /!*<div>*!/*/}
//                 {/*        /!*    <div className="mb-3 text-base font-semibold" style={{color: colorTextSecondary}}>*!/*/}
//                 {/*        /!*        Mode*!/*/}
//                 {/*        /!*    </div>*!/*/}
//                 {/*        /!*    <div className="flex flex-row gap-4">*!/*/}
//                 {/*        /!*        <Card*!/*/}
//                 {/*        /!*                onClick={(event) => setThemeMode(ThemeMode.Light, event)}*!/*/}
//                 {/*        /!*                className="flex h-20 w-full cursor-pointer items-center justify-center"*!/*/}
//                 {/*        /!*        >*!/*/}
//                 {/*        /!*            <Icon icon="line-md:sunny-outline-loop"*!/*/}
//                 {/*        /!*                  className={themeMode === ThemeMode.Light ? "text-xl text-antd-primary" : 'text-xl'}/>*!/*/}
//                 {/*        /!*        </Card>*!/*/}
//                 {/*        /!*        <Card*!/*/}
//                 {/*        /!*                onClick={(event) => setThemeMode(ThemeMode.Dark, event)}*!/*/}
//                 {/*        /!*                className="flex h-20 w-full cursor-pointer items-center justify-center"*!/*/}
//                 {/*        /!*        >*!/*/}
//                 {/*        /!*            <Icon icon="line-md:sunny-outline-to-moon-alt-loop-transition"*!/*/}
//                 {/*        /!*                  className={themeMode === ThemeMode.Dark ? "text-xl text-antd-primary" : 'text-xl'}/>*!/*/}
//
//                 {/*        /!*        </Card>*!/*/}
//
//                 {/*        /!*    </div>*!/*/}
//                 {/*        /!*</div>*!/*/}
//
//                 {/*        /!* theme layout *!/*/}
//                 {/*        <div>*/}
//                 {/*            <div className="mb-3 text-base font-semibold" style={{color: colorTextSecondary}}>*/}
//                 {/*                Layout*/}
//                 {/*            </div>*/}
//                 {/*            <div className="grid grid-cols-2 gap-4">*/}
//                 {/*                <Card*/}
//                 {/*                        onClick={() => setThemeLayout(ThemeLayout.Vertical)}*/}
//                 {/*                        className="h-20 cursor-pointer w-full"*/}
//                 {/*                        style={{flexGrow: 1, flexShrink: 0}}*/}
//                 {/*                        styles={{*/}
//                 {/*                            body: {*/}
//                 {/*                                padding: 0,*/}
//                 {/*                                display: 'flex',*/}
//                 {/*                                justifyContent: 'center',*/}
//                 {/*                                alignItems: 'center',*/}
//                 {/*                                height: '100%',*/}
//                 {/*                            }*/}
//                 {/*                        }}*/}
//                 {/*                >*/}
//                 {/*                    <div className="flex h-full w-7 flex-shrink-0 flex-col gap-1 p-1">*/}
//                 {/*                        <div*/}
//                 {/*                                className="h-2 w-2 flex-shrink-0 rounded"*/}
//                 {/*                                style={{background: layoutBackground(ThemeLayout.Vertical)}}*/}
//                 {/*                        />*/}
//                 {/*                        <div*/}
//                 {/*                                className="h-1 w-full flex-shrink-0 rounded opacity-50"*/}
//                 {/*                                style={{background: layoutBackground(ThemeLayout.Vertical)}}*/}
//                 {/*                        />*/}
//                 {/*                        <div*/}
//                 {/*                                className="h-1 max-w-[12px] flex-shrink-0 rounded opacity-20"*/}
//                 {/*                                style={{background: layoutBackground(ThemeLayout.Vertical)}}*/}
//                 {/*                        />*/}
//                 {/*                    </div>*/}
//                 {/*                    <div className="h-full w-full flex-1 flex-grow p-1">*/}
//                 {/*                        <div*/}
//                 {/*                                className="h-full w-full rounded opacity-20"*/}
//                 {/*                                style={{background: layoutBackground(ThemeLayout.Vertical)}}*/}
//                 {/*                        />*/}
//                 {/*                    </div>*/}
//                 {/*                </Card>*/}
//                 {/*                <Card*/}
//                 {/*                        onClick={() => setThemeLayout(ThemeLayout.Horizontal)}*/}
//                 {/*                        className="h-20 cursor-pointer"*/}
//                 {/*                        style={{flexGrow: 1, flexShrink: 0}}*/}
//                 {/*                        styles={{*/}
//                 {/*                            body: {*/}
//                 {/*                                padding: 0,*/}
//                 {/*                                display: 'flex',*/}
//                 {/*                                flexDirection: 'column',*/}
//                 {/*                                justifyContent: 'center',*/}
//                 {/*                                alignItems: 'center',*/}
//                 {/*                                height: '100%',*/}
//                 {/*                            }*/}
//                 {/*                        }}*/}
//                 {/*                >*/}
//                 {/*                    <div className="flex h-4 w-full items-center gap-1  p-1">*/}
//                 {/*                        <div*/}
//                 {/*                                className="h-2 w-2 flex-shrink-0 rounded"*/}
//                 {/*                                style={{background: layoutBackground(ThemeLayout.Horizontal)}}*/}
//                 {/*                        />*/}
//                 {/*                        <div*/}
//                 {/*                                className="h-1 w-4 flex-shrink-0 rounded opacity-50"*/}
//                 {/*                                style={{background: layoutBackground(ThemeLayout.Horizontal)}}*/}
//                 {/*                        />*/}
//                 {/*                        <div*/}
//                 {/*                                className="h-1 w-3 flex-shrink-0 rounded opacity-20"*/}
//                 {/*                                style={{background: layoutBackground(ThemeLayout.Horizontal)}}*/}
//                 {/*                        />*/}
//                 {/*                    </div>*/}
//                 {/*                    <div className="h-full w-full flex-1 flex-grow p-1">*/}
//                 {/*                        <div*/}
//                 {/*                                className="h-full w-full rounded opacity-20"*/}
//                 {/*                                style={{background: layoutBackground(ThemeLayout.Horizontal)}}*/}
//                 {/*                        />*/}
//                 {/*                    </div>*/}
//                 {/*                </Card>*/}
//                 {/*            </div>*/}
//                 {/*        </div>*/}
//
//                 {/*        /!* theme stretch *!/*/}
//                 {/*        <div>*/}
//                 {/*            <div className=" mb-3 text-base font-semibold" style={{color: colorTextSecondary}}>*/}
//                 {/*                <span className="mr-2">Stretch</span>*/}
//                 {/*                <Tooltip title="伸缩模式">*/}
//                 {/*                    <QuestionCircleOutlined/>*/}
//                 {/*                </Tooltip>*/}
//                 {/*            </div>*/}
//
//                 {/*            <Card*/}
//                 {/*                    onClick={() => setThemeStretch(!themeStretch)}*/}
//                 {/*                    className="flex h-20 w-full cursor-pointer items-center justify-center"*/}
//                 {/*                    styles={{*/}
//                 {/*                        body: {*/}
//                 {/*                            width: '50%',*/}
//                 {/*                            padding: 0,*/}
//                 {/*                            display: 'flex',*/}
//                 {/*                            justifyContent: 'center',*/}
//                 {/*                            alignItems: 'center',*/}
//                 {/*                        }*/}
//                 {/*                    }}*/}
//                 {/*            >*/}
//                 {/*                {themeStretch ? (*/}
//                 {/*                        <div*/}
//                 {/*                                className="flex w-full items-center justify-between"*/}
//                 {/*                                style={{*/}
//                 {/*                                    color: colorPrimary,*/}
//                 {/*                                    transition: 'width 300ms 0ms',*/}
//                 {/*                                }}*/}
//                 {/*                        >*/}
//                 {/*                            <LeftOutlined/>*/}
//                 {/*                            <div className="flex flex-grow border-b border-dashed"/>*/}
//                 {/*                            <RightOutlined/>*/}
//                 {/*                        </div>*/}
//                 {/*                ) : (*/}
//                 {/*                        <div*/}
//                 {/*                                className="flex w-1/2 items-center justify-between"*/}
//                 {/*                                style={{*/}
//                 {/*                                    transition: 'width 300ms 0ms',*/}
//                 {/*                                }}*/}
//                 {/*                        >*/}
//                 {/*                            <RightOutlined/>*/}
//                 {/*                            <div className="flex-grow border-b border-dashed"/>*/}
//                 {/*                            <LeftOutlined/>*/}
//                 {/*                        </div>*/}
//                 {/*                )}*/}
//                 {/*            </Card>*/}
//                 {/*        </div>*/}
//
//                 {/*        /!*theme presets *!/*/}
//                 {/*        <div>*/}
//                 {/*            <div className="mb-3 text-base font-semibold" style={{color: colorTextSecondary}}>*/}
//                 {/*                Presets*/}
//                 {/*            </div>*/}
//                 {/*            <Row gutter={[16, 16]}>*/}
//
//                 {/*                {colorPreset.map((item, i) => (*/}
//                 {/*                        <Col span={24 / colorPreset.length} key={i}>*/}
//                 {/*                            <div className="flex flex-col justify-center items-center">*/}
//                 {/*                                <ColorPicker presets={item.presets} placement="top" defaultValue={item.defaultValue} onChange={item.changeColor}*/}
//                 {/*                                />*/}
//                 {/*                                <div className="my-1" style={{color: colorTextTertiary}}>{item.title}</div>*/}
//                 {/*                            </div>*/}
//                 {/*                        </Col>*/}
//                 {/*                ))}*/}
//                 {/*            </Row>*/}
//                 {/*        </div>*/}
//
//                 {/*        /!*Page config*!/*/}
//                 {/*        <div>*/}
//                 {/*            <div className="mb-3 text-base font-semibold" style={{color: colorTextSecondary}}>*/}
//                 {/*                Page*/}
//                 {/*            </div>*/}
//                 {/*            <div className="flex flex-col gap-2">*/}
//                 {/*                <div*/}
//                 {/*                        className="flex items-center justify-between"*/}
//                 {/*                        style={{color: colorTextTertiary}}*/}
//                 {/*                >*/}
//                 {/*                    <div>BreadCrumb</div>*/}
//                 {/*                    <Switch*/}
//                 {/*                            size="small"*/}
//                 {/*                            checked={breadCrumb}*/}
//                 {/*                            onChange={(checked) => setBreadCrumb(checked)}*/}
//                 {/*                    />*/}
//                 {/*                </div>*/}
//                 {/*                <div*/}
//                 {/*                        className="flex items-center justify-between"*/}
//                 {/*                        style={{color: colorTextTertiary}}*/}
//                 {/*                >*/}
//                 {/*                    <div>Multi Tab</div>*/}
//                 {/*                    <Switch*/}
//                 {/*                            size="small"*/}
//                 {/*                            checked={multiTab}*/}
//                 {/*                            onChange={(checked) => setMultiTab(checked)}*/}
//                 {/*                    />*/}
//                 {/*                </div>*/}
//                 {/*                <div*/}
//                 {/*                        className="flex items-center justify-between"*/}
//                 {/*                        style={{color: colorTextTertiary}}*/}
//                 {/*                >*/}
//                 {/*                    <div>WaterMark</div>*/}
//                 {/*                    <Switch*/}
//                 {/*                            size="small"*/}
//                 {/*                            checked={watermark}*/}
//                 {/*                            onChange={(checked) => setWatermark(checked)}*/}
//                 {/*                    />*/}
//                 {/*                </div>*/}
//
//                 {/*            </div>*/}
//                 {/*        </div>*/}
//
//                 {/*        <div>*/}
//                 {/*            <div className="mb-3 text-base font-semibold" style={{color: colorTextSecondary}}>*/}
//                 {/*                Animation*/}
//                 {/*            </div>*/}
//                 {/*            <div className="flex flex-col gap-2">*/}
//                 {/*                <div*/}
//                 {/*                        className="flex items-center justify-between"*/}
//                 {/*                        style={{color: colorTextTertiary}}*/}
//                 {/*                >*/}
//                 {/*                    <div>Page Animation</div>*/}
//                 {/*                    <Switch*/}
//                 {/*                            size="small"*/}
//                 {/*                            checked={pageAnimation}*/}
//                 {/*                            onChange={(checked) => setPageAnimation(checked)}*/}
//                 {/*                    />*/}
//                 {/*                </div>*/}
//
//                 {/*                <div*/}
//                 {/*                        className="flex items-center justify-between"*/}
//                 {/*                        style={{color: colorTextTertiary}}*/}
//                 {/*                >*/}
//                 {/*                    <Select*/}
//                 {/*                            defaultValue={animateValue}*/}
//                 {/*                            disabled={!pageAnimation}*/}
//                 {/*                            allowClear={true}*/}
//                 {/*                            showSearch*/}
//                 {/*                            className="w-full"*/}
//                 {/*                            filterOption={(input, option) =>*/}
//                 {/*                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())*/}
//                 {/*                            }*/}
//                 {/*                            options={animationArr}*/}
//                 {/*                            onChange={setAnimateValue}*/}
//                 {/*                    >*/}
//                 {/*                    </Select>*/}
//                 {/*                </div>*/}
//
//
//                 {/*            </div>*/}
//                 {/*        </div>*/}
//
//
//                 {/*    </div>*/}
//                 {/*    /!*</StyleWrapper>*!/*/}
//                 {/*</Drawer>*/}
//             </>
//
//     )
// }
//
// export default Setting
