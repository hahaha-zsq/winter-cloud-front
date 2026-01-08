// 导入create函数，这是zustand用来创建store的主要方法
import {create} from 'zustand';

import storage from '@/utils/storage'
import {StorageEnum, ThemeLayout, ThemeMode} from "@/types/enum";
import {color} from "@/configuration/theme";

const {colorInfo, colorSuccess, colorWarning, colorError} = color
// 定义了一个SettingsType类型
type SettingsType = {
    themeColorPrimary: string;
    themeColorSuccess: string;
    themeColorWarning: string;
    themeColorError: string;
    themeMode: ThemeMode;
    themeLayout: ThemeLayout;
    themeStretch: boolean;
    breadCrumb: boolean;
    multiTab: boolean;
    watermark: boolean;
    pageAnimation: boolean;
    animateValue: string;
    autoTheme: boolean,
};
// 定义了一个SettingStore类型，settings是一个SettingsType类型的对象，而actions是一个对象，其中包含用于操作settings的方法
type SettingStore = {
    settings: SettingsType;
    // 使用 actions 命名空间来存放所有的 action
    actions: {
        setSettings: (settings: SettingsType) => void;
        clearSettings: () => void;
    };
};
// 调用 create() API 的时候，Zustand 还会额外传入一个 set 参数，它是一个函数，用于设置状态
const useSettingStore = create<SettingStore>((set) => ({
    // 首先尝试从存储中读取设置，如果没有找到，则使用默认值
    settings: storage.get(StorageEnum.Settings) || {
        themeColorPrimary: colorInfo,
        themeColorSuccess: colorSuccess,
        themeColorWarning: colorWarning,
        themeColorError: colorError,
        themeMode: ThemeMode.Light,
        themeLayout: ThemeLayout.Horizontal,
        themeStretch: true,
        breadCrumb: true,
        multiTab: true,
        watermark: false,
        pageAnimation: false,
        autoTheme: false,
        animateValue: "zoomIn",
    },
    actions: {
        setSettings: (settings) => {
            // set函数被用来更新store中的settings。当设置更新时，zustand会通知所有订阅者，从而触发组件的重新渲染。
            set({settings});
            storage.set(StorageEnum.Settings, settings);
        },
        clearSettings() {
            storage.remove(StorageEnum.Settings);
        },
    },
}));
// 获取settings返回settings
export const useSettings = () => useSettingStore((state) => state.settings);
// 获取actions返回actions
export const useSettingActions = () => useSettingStore((state) => state.actions);
