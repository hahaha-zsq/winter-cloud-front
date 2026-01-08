import type {ThemeConfig} from 'antd';

/**
 * Antd theme editor: https://ant.design/theme-editor-cn
 */
const color = {
    colorSuccess: '#22c55e',
    colorWarning: '#ff7849',
    colorError: '#ff5630',
    colorInfo: '#00b8d9',
    colorPrimary: '#16c2c3',
    bodyBg: '#fafbfc',
}
const customThemeTokenConfig: ThemeConfig['token'] = {
    // 请看官方API，以下都来自官方的API
    colorSuccess: color.colorSuccess,
    colorWarning: color.colorWarning,
    colorError: color.colorError,
    colorInfo: color.colorInfo,
    colorPrimary: color.colorPrimary,


    // 线性化
    wireframe: false,

    borderRadiusSM: 2,
    borderRadius: 4,
    borderRadiusLG: 8,
};

const customComponentConfig: ThemeConfig['components'] = {
    Breadcrumb: {
        fontSize: 12,
        separatorMargin: 4,
    },
    Menu: {
        fontSize: 14,
        colorFillAlter: 'transparent',
        // itemColor: 'rgb(145, 158, 171)',
    },
};

//如果要定义一个对象的key和value类型,可以用到TS的Record,这行代码声明了一个常量 themeModeToken，并将其类型指定为前面定义的记录类型。这意味着 themeModeToken 必须是一个对象，其键为 'dark' 和 'light'，每个键对应的值必须是 ThemeConfig 类型的
const themeModeToken: Record<'dark' | 'light', ThemeConfig> = {
    dark: {
        token: {
            colorBgLayout: '#161c24',
            colorBgContainer: '#212b36',
            colorBgElevated: '#161c24',
        },
        components: {
            Modal: {
                headerBg: '#212b36',
                contentBg: '#212b36',
                footerBg: '#212b36',
            },
            Notification: {},
        },
    },
    light: {
        token: {
            colorBgLayout: color.bodyBg,
        },
    },
};

export {color, customThemeTokenConfig, customComponentConfig, themeModeToken};
