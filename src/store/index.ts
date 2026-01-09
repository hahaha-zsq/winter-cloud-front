import {create} from 'zustand'
import storage from "@/utils/storage";
import type {Configuration, LoginResponseDTO} from "@/types";
import {StorageEnum, ThemeLayout, ThemeMode, UNLanguagesEnum} from "@/types/enum.ts";

// 定义了一个SettingStore类型，settings是一个SettingsType类型的对象，而actions是一个对象，其中包含用于操作settings的方法
type Store = {
    userInfo: LoginResponseDTO;
    configuration:Configuration
    // 使用 actions 命名空间来存放所有的 action
    actions: {
        setUserInfo: (settings: LoginResponseDTO) => void;
        setConfiguration: (settings: Configuration) => void;
        clearUserInfo: () => void;
    };
};

export const useStore = create<Store>(set => ({
    // 首先尝试从存储中读取设置，如果没有找到，则使用默认值
    userInfo: storage.get(StorageEnum.UserInfo) || {},
    configuration: storage.get(StorageEnum.Configuration) || {
        isCollapsed: false,
        isFullScreen: false,
        isEnablePageAnimation:false,
        mode: ThemeMode.Auto,
        layout: ThemeLayout.Horizontal,
        isStretch: false,
        isEnableWaterMark: false,
        language:UNLanguagesEnum.CHINESE,
    },
    actions: {
        setUserInfo: (userInfo) => {
            // set函数被用来更新store中的settings。当设置更新时，zustand会通知所有订阅者，从而触发组件的重新渲染。
            set({userInfo});
            storage.set(StorageEnum.UserInfo, userInfo);
        },
        setConfiguration: (configuration) => {
            // set函数被用来更新store中的settings。当设置更新时，zustand会通知所有订阅者，从而触发组件的重新渲染。
            set({configuration});
            storage.set(StorageEnum.Configuration, configuration);
        },
        clearUserInfo() {
            storage.remove(StorageEnum.UserInfo);
        },
    },
}))
