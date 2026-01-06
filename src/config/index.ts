/**
 * 环境配置封装
 */
//定义了一个名为 ENV 的联合类型，它可以是以下四种字符串值之一：‘dev’、‘test’、‘prod’ 或 ‘mock’。
type ENV = "development" | "test" | "production" | "mock";
const env = (import.meta.env.MODE as ENV) || "mock";
console.log("env", env);
const systemName = "winter-cloud";
const config = {
	development: {
		baseApi: "http://localhost:6667/api",
		minio: "http://localhost:8080",
		websocket: "ws://localhost:8888/websocket",
		namespace: "development",
	},
	test: {
		baseApi: "http://localhost:8092",
		minio: "http://localhost:9886",
		websocket: "ws://localhost:8888/websocket",
		namespace: "test",
	},
	production: {
		baseApi: "http://124.70.91.190:8092",
		minio: "http://124.70.91.190:9886",
		websocket: "ws://localhost:8888/websocket",
		namespace: "production",
	},
	mock: {
		baseApi: "http://mock:8092",
		minio: "http://mock:9886",
		websocket: "ws://mock:9000",
		namespace: "mock",
	},
};
export default {
	env,
	systemName,
	...config[env],
};
