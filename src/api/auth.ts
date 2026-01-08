import request from "@/utils/request.ts";
import type {loginReq, LoginResponseDTO} from "@/types";

const loginApi = async (param: loginReq) => {
        return await request.post<LoginResponseDTO>('/auth/login', param); // 返回接口响应数据
}

export {loginApi}