import {ConfigProvider, theme} from 'antd';
import 'antd/dist/reset.css';

import {useSettings} from '@/store/settingStore';

import {
    customThemeTokenConfig,
    themeModeToken,
    customComponentConfig,
} from './theme';

import {ThemeMode} from '@/types/enum';
import React from "react";
// import enUS from "@/i18n/modules/en-US.json";
// import zhCN from "@/i18n/modules/zh-CN.json";
// import enAntdUS from "antd/locale/en_US";
// import zhAntdCN from "antd/locale/zh_CN";
// import {IntlProvider} from "react-intl";
import {useStore} from "@/store";
// import {StyleProvider} from "@ant-design/cssinjs";
import 'dayjs/locale/zh-cn';

type Props = {
    children: React.ReactNode;
};
export default function AntdConfig({children}: Props) {
    const {
        themeMode, themeColorPrimary
        , themeColorWarning, themeColorError, themeColorSuccess
    } = useSettings();

    // console.log(useSettings())
    // const {isTranslate} = useStore()
    // const messages: Record<string, any> = {
    //     'en-US': enUS,
    //     'zh-CN': zhCN
    // }
    // const locale = isTranslate ? 'en-US' : "zh-CN";
    // const localeAntd = isTranslate ? enAntdUS : zhAntdCN;

    // 模式
    const algorithm = themeMode === ThemeMode.Light ? theme.defaultAlgorithm : [theme.darkAlgorithm];
    const colorPrimary = themeColorPrimary;
    const colorWarning = themeColorWarning;
    const colorError = themeColorError;
    const colorSuccess = themeColorSuccess;
    // console.table({
    // 	"colorPrimary":colorPrimary,
    // 	"colorWarning":colorWarning,
    // 	"colorError":colorError,
    // 	"colorSuccess":colorSuccess,
    // })


    return (
            // <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="zh_CN">
                <ConfigProvider
                        // locale={localeAntd}
                        // renderEmpty={() =><BunEmpty description={"暂无数据"}/>}  全局为空组件
                        theme={{
                            // cssVar: true, //开启后审查元素，就可以看到 antd 组件样式中一些原本具体的数值被替换为了 CSS 变量
                            token: {...customThemeTokenConfig, colorPrimary, colorError, colorSuccess, colorWarning, ...themeModeToken[themeMode].token},
                            components: {...customComponentConfig, ...themeModeToken[themeMode].components},
                            algorithm,
                        }}
                >
                    {/* https://ant.design/docs/react/compatible-style-cn#styleprovider */}
                    {/*<StyleProvider hashPriority="high">{children}</StyleProvider>*/}
                    {children}
                </ConfigProvider>
            {/*</IntlProvider>*/}
    );
}
