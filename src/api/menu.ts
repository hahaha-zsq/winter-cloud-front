import request from "@/utils/request.ts";
import type {MenuResponseDTO} from "@/types";

const dynamicRoutingApi = async (userId:number) => {
	return await request.get<MenuResponseDTO[]>('/auth/getDynamicRouting', {id: userId}); // 返回接口响应数据
}

export {dynamicRoutingApi}