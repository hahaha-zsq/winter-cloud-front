import {ApiVersionEnum, LocalEnum} from "@/types/enum.ts";

/**
 * 全局环境配置封装
 */
//定义了一个名为 ENV 的联合类型，它可以是以下四种字符串值之一：‘dev’、‘test’、‘prod’
type ENV = "development" | "test" | "production" ;
const env = (import.meta.env.MODE as ENV) ;
console.log("env", env);
const systemName = "winter-cloud";
const config = {
	development: {
		baseApi: "http://localhost:9997/api",
		minio: "http://localhost:8080",
		websocket: "ws://localhost:8888/websocket",
		namespace: "development",
		current_api_version: ApiVersionEnum.V2_1,
		language:LocalEnum.zh_CN
	},
	test: {
		baseApi: "http://localhost:8092",
		minio: "http://localhost:9886",
		websocket: "ws://localhost:8888/websocket",
		namespace: "test",
		current_api_version: ApiVersionEnum.V2_1,
		language:LocalEnum.zh_CN
	},
	production: {
		baseApi: "http://124.70.91.190:8092",
		minio: "http://124.70.91.190:9886",
		websocket: "ws://localhost:8888/websocket",
		namespace: "production",
		current_api_version: ApiVersionEnum.V2_1,
		language:LocalEnum.zh_CN
	},
};
export default {
	env,
	systemName,
	...config[env],
};
