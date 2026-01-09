import {Divider, Menu, Popover, type MenuProps} from "antd";
import "../index.less";
import {useThemeToken} from "@/hooks/use-theme-token";
import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import storage from "@/utils/storage";
import {StorageEnum} from "@/types/enum.ts";
import {navigateTo} from "@/router/navigate.ts";
import IconButton from "@/components/icon/icon-button.tsx";

const UserDropdown = () => {
    const userInfo = storage.get(StorageEnum.UserInfo);
    const [open, setOpen] = useState(false);

    const logout = () => {
        try {
            storage.clear();
        } catch (error) {
            console.log(error);
        } finally {
            setOpen(false); // 关闭弹窗
            navigateTo("/");
        }
    };

    const {colorBgElevated, borderRadiusLG, boxShadowSecondary} = useThemeToken();

    const contentStyle: React.CSSProperties = {
        backgroundColor: colorBgElevated,
        borderRadius: borderRadiusLG,
        boxShadow: boxShadowSecondary,
        padding: 0, // Menu 会自带 padding，所以设为 0
    };

    const items: MenuProps['items'] = [
        {
            label: <NavLink to="/userInfo/profile">个人简介</NavLink>,
            key: '1',
        },
        {
            label: <NavLink to="/userInfo/account">账户信息</NavLink>,
            key: '2',
        },
        {type: 'divider'},
        {
            label: <button className="font-bold text-antd-warning w-full text-left">退出</button>,
            key: '3',
            onClick: logout,
        },
    ];

    const popoverContent = (
        <div style={contentStyle}>
            <div className="flex flex-col items-start p-4">
                <div>{userInfo?.userName || '用户'}</div>
                <div className="text-gray">{userInfo?.email || ''}</div>
            </div>
            <Divider style={{margin: 0}}/>
            <Menu
                items={items}
                style={{boxShadow: 'none', border: 'none'}}
                inlineIndent={0}
                mode="vertical"
            />
        </div>
    );

    return (
        <Popover
            content={popoverContent}
            trigger="hover"
            open={open}
            onOpenChange={setOpen}
            styles={
                {
                    container:
                        {padding: 0}
                }
            }
        >
            <IconButton className="h-10 w-10 transform-none px-0 hover:scale-105">
                <img
                    className="h-8 w-8 rounded-full"
                    src={userInfo?.avatar || '/default-avatar.png'}
                    alt="avatar"
                />
            </IconButton>
        </Popover>
    );
};

export default UserDropdown;