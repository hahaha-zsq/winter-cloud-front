import type {MenuResponseDTO} from "@/types/menu.ts";

export interface loginReq {
    email: string
    password: string
}

export interface LoginResponseDTO {
    token?: string;
    id?: number;
    userName?: string;
    nickName?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    bgImg?: string;
    sex?: string;
    introduction?: string;
    menuAndButton?: MenuAndButtonResponseDTO;
}

export interface MenuAndButtonResponseDTO {
    menuList?: MenuResponseDTO[];
    buttonList?: string[];
}

