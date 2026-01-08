/**
 * ================================
 * Axios 二次封装（企业级版本）
 * ================================
 *
 * 设计目标：
 * 1. 所有接口统一入口
 * 2. 统一请求头（token / 语言 / 时间戳 / 客户端标识）
 * 3. 统一业务状态码处理
 * 4. 统一 HTTP 状态码处理
 * 5. 支持取消重复请求（防止按钮连点）
 * 6. 支持在 JS / TS 文件中进行路由跳转
 * 7. 支持文件上传与下载
 *
 * 使用方式：
 * import request from "@/utils/request"
 * request.get(...)
 */

/* ================================
 * 1️⃣ 依赖导入
 * ================================ */

/**
 * axios 核心库
 * AxiosInstance        : axios 实例类型
 * AxiosRequestConfig   : 请求配置类型
 * AxiosResponse        : 响应类型
 * AxiosError           : 错误类型
 * InternalAxiosRequestConfig : axios 内部使用的请求配置（拦截器中必须用它）
 */
import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    AxiosError,
    type InternalAxiosRequestConfig
} from 'axios'

/**
 * 本地存储工具（通常是 localStorage / sessionStorage 的封装）
 * 用于存储 token、语言等
 */
import storage from './storage'

/**
 * 全局配置
 * 包含 baseApi、API 版本号、默认语言等
 */
import configInfo from '@/config'

/**
 * antd 的 message 全局提示
 * 用于统一错误提示
 */
import { message } from '@/components/antdGlobal'

/**
 * 全局路由跳转方法
 * ⚠️ 这是一个“非 React 组件环境”的 navigate
 * 可以在 JS / TS 文件中使用
 */
import { navigateTo } from "@/router/navigate.ts"

/**
 * 生成随机字符串
 * 用于客户端唯一标识（client-id）
 */
import { generateRandomString } from "@/utils/generate.ts"

/**
 * 枚举定义
 * - RequestHeaderEnum : 请求头字段名
 * - RequestSourceEnum : 请求来源（Web / App）
 * - ResultCode        : 后端业务状态码
 * - ResultMessage     : 业务状态码对应的默认提示
 */
import {
    RequestHeaderEnum,
    RequestSourceEnum,
    ResultCode,
    ResultMessage
} from "@/types/enum.ts"


/* ================================
 * 2️⃣ 后端返回数据结构定义
 * ================================ */

/**
 * 后端统一返回格式
 *
 * 示例：
 * {
 *   code: "200",
 *   traceId: "xxx",
 *   message: "success",
 *   data: {...}
 * }
 *
 * T 是 data 的具体类型
 */
interface Result<T = any> {
    code: string            // 业务状态码（不是 HTTP 状态码）
    traceId: string         // 链路追踪 ID（方便后端排查）
    message: string         // 提示信息
    data: T                 // 实际业务数据
}


/* ================================
 * 3️⃣ 请求配置类型扩展
 * ================================ */

/**
 * 扩展 AxiosRequestConfig
 * 增加 cancelRepeatRequest 字段
 *
 * 作用：
 * - 是否开启“取消重复请求”
 * - 常用于按钮点击、列表搜索等场景
 */
interface RequestConfig extends AxiosRequestConfig {
    cancelRepeatRequest?: boolean
}

/**
 * 扩展 axios 内部请求配置
 *
 * ⚠️ 为什么需要这个？
 * 因为拦截器中拿到的是 InternalAxiosRequestConfig
 * 如果不扩展，TS 无法识别 cancelRepeatRequest
 */
interface InternalRequestConfig extends InternalAxiosRequestConfig {
    cancelRepeatRequest?: boolean
}


/* ================================
 * 4️⃣ Request 核心类
 * ================================ */

class Request {

    /**
     * axios 实例
     * 所有请求都通过这个实例发送
     */
    private instance: AxiosInstance

    /**
     * pendingMap 用于存储“正在进行中的请求”
     *
     * key   : 请求唯一标识
     * value : AbortController（用于中断请求）
     */
    private pendingMap: Map<string, AbortController>

    /**
     * 构造函数
     * 在这里创建 axios 实例并初始化拦截器
     */
    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config)
        this.pendingMap = new Map()
        this.setupInterceptors()
    }


    /* ================================
     * 5️⃣ 重复请求处理逻辑
     * ================================ */

    /**
     * 生成请求唯一 key
     *
     * 一个请求是否“相同”，由以下因素决定：
     * - url
     * - method
     * - params
     * - data
     */
    private getPendingKey(config: InternalRequestConfig | AxiosRequestConfig): string {
        const { url, method, params, data } = config
        return [
            url,
            method,
            JSON.stringify(params),
            JSON.stringify(data)
        ].join('&')
    }

    /**
     * 添加请求到 pendingMap
     *
     * 流程：
     * 1. 判断是否开启 cancelRepeatRequest
     * 2. 创建 AbortController
     * 3. 将 signal 挂载到 axios config
     * 4. 存入 pendingMap
     */
    private addPending(config: InternalRequestConfig) {
        if (!config.cancelRepeatRequest) return

        const key = this.getPendingKey(config)
        const controller = new AbortController()

        // axios v1.x 使用 signal 中断请求
        config.signal = controller.signal

        if (!this.pendingMap.has(key)) {
            this.pendingMap.set(key, controller)
        }
    }

    /**
     * 移除并中断 pending 请求
     *
     * 使用场景：
     * - 新请求发起前（取消旧请求）
     * - 请求完成后（清理内存）
     */
    private removePending(config: InternalRequestConfig | AxiosRequestConfig) {
        const key = this.getPendingKey(config)

        if (this.pendingMap.has(key)) {
            const controller = this.pendingMap.get(key)
            controller?.abort()      // 主动中断请求
            this.pendingMap.delete(key)
        }
    }


    /* ================================
     * 6️⃣ 拦截器初始化
     * ================================ */

    private setupInterceptors() {

        /* ---------- 请求拦截器 ---------- */
        this.instance.interceptors.request.use(
            (config: InternalRequestConfig) => {

                /**
                 * ① 处理重复请求
                 * 先取消旧请求，再添加新请求
                 */
                if (config.cancelRepeatRequest) {
                    this.removePending(config)
                    this.addPending(config)
                }

                /**
                 * ② 从本地存储中读取信息
                 */
                const token = storage.get(RequestHeaderEnum.AUTHORIZATION)
                const language = storage.get(RequestHeaderEnum.ACCEPT_LANGUAGE)

                /**
                 * ③ 设置 token
                 */
                if (token) {
                    config.headers[RequestHeaderEnum.AUTHORIZATION] = token
                }

                /**
                 * ④ 设置统一请求头
                 */
                config.headers[RequestHeaderEnum.CLIENT_ID] = generateRandomString()
                config.headers[RequestHeaderEnum.REQUEST_SOURCE] = RequestSourceEnum.WEB
                config.headers[RequestHeaderEnum.API_VERSION] = configInfo.current_api_version
                config.headers[RequestHeaderEnum.TIMESTAMP] = Date.now()
                config.headers[RequestHeaderEnum.ACCEPT_LANGUAGE] = language || configInfo.language

                return config
            },
            error => Promise.reject(error)
        )


        /* ---------- 响应拦截器 ---------- */
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {

                const config = response.config as InternalRequestConfig

                /**
                 * 请求完成后，清除 pending
                 */
                if (config.cancelRepeatRequest) {
                    this.removePending(config)
                }

                /**
                 * 文件下载直接返回 response
                 */
                if (config.responseType === 'blob') {
                    return response
                }

                const data = response.data as Result

                /**
                 * 业务成功
                 */
                if (data.code === ResultCode.SUCCESS) {
                    return data.data
                }

                /**
                 * 业务失败（HTTP 200，但 code != SUCCESS）
                 */
                this.handleBusinessError(data.code, data.message)
                return Promise.reject(data)
            },

            /**
             * HTTP 错误处理（非 2xx）
             */
            (error: AxiosError) => {

                /**
                 * 如果是取消请求，不提示
                 */
                if (axios.isCancel(error)) {
                    return Promise.reject(error)
                }

                const msg =
                    error.response?.data &&
                    typeof error.response.data === 'object' &&
                    'message' in error.response.data
                        ? (error.response.data as any).message
                        : error.message

                this.handleHttpError(error.response?.status, msg)
                return Promise.reject(error)
            }
        )
    }


    /* ================================
     * 7️⃣ 错误处理
     * ================================ */

    /**
     * 处理业务错误（HTTP 200）
     */
    private handleBusinessError(code: string, msg: string) {
        const errorMsg = msg || ResultMessage[code] || '请求失败'

        if (code === ResultCode.UNAUTHENTICATED) {
            navigateTo("/")
        }

        if (code === ResultCode.UNAUTHORIZED) {
            navigateTo("/403")
        }

        message.error(errorMsg)
    }

    /**
     * 处理 HTTP 错误
     */
    private handleHttpError(status: number | undefined, msg: string) {
        let errorMsg = msg

        if (!status) {
            errorMsg = '网络异常'
        } else if (status === 401) {
            errorMsg = '未授权'
            navigateTo("/")
        } else if (status === 403) {
            errorMsg = '拒绝访问'
            navigateTo("/403")
        } else if (status === 502) {
            errorMsg = '网关错误'
            navigateTo("/502")
        }

        message.error(errorMsg)
    }


    /* ================================
     * 8️⃣ 请求方法封装
     * ================================ */

    request<T = any>(config: RequestConfig): Promise<T> {
        return this.instance.request(config)
    }

    get<T = any>(url: string, params?: object, config?: RequestConfig): Promise<T> {
        return this.instance.get(url, { params, ...config })
    }

    post<T = any>(url: string, data?: object, config?: RequestConfig): Promise<T> {
        return this.instance.post(url, data, config)
    }

    put<T = any>(url: string, data?: object, config?: RequestConfig): Promise<T> {
        return this.instance.put(url, data, config)
    }

    delete<T = any>(url: string, params?: object, config?: RequestConfig): Promise<T> {
        return this.instance.delete(url, { params, ...config })
    }
}


/* ================================
 * 9️⃣ 导出实例
 * ================================ */

const request = new Request({
    baseURL: configInfo.baseApi,
    timeout: 20000,
    timeoutErrorMessage: '请求超时'
})

export default request