// 1. 对于自动递增的数字枚举 (BasicStatus, PermissionType)
// 你需要手动写出 0, 1, 2...

export const BasicStatus = {
  DISABLE: 0,
  ENABLE: 1,
} as const;
// 定义类型别名，以便在类型定义中使用
export type BasicStatus = typeof BasicStatus[keyof typeof BasicStatus];


// 2. 对于有具体数值的枚举 (ResultEnum)

export const ResultEnum = {
  SUCCESS: 0,
  ERROR: -1,
  TIMEOUT: 401,
} as const;
export type ResultEnum = typeof ResultEnum[keyof typeof ResultEnum];


// 3. 对于字符串枚举 (StorageEnum, ThemeMode 等)

export const StorageEnum = {
  UserInfo: 'userInfo',
  Configuration: 'configuration',
  Token: 'token',
  I18N: 'i18nextLng',
} as const;
export type StorageEnum = typeof StorageEnum[keyof typeof StorageEnum];

// 其他同理...
export const ThemeMode = {
  Light: 'light',
  Dark: 'dark',
  Auto: 'auto',
} as const;
export type ThemeMode = typeof ThemeMode[keyof typeof ThemeMode];

export const ThemeLayout = {
  Vertical: 'vertical',
  Horizontal: 'horizontal',
} as const;
export type ThemeLayout = typeof ThemeLayout[keyof typeof ThemeLayout];

export const Mode = {
  Disabled: 'disabled',
  Filter: 'filter',
} as const;
export type Mode = typeof Mode[keyof typeof Mode];

export const LocalEnum = {
  en_US: 'en_US',
  zh_CN: 'zh_CN',
} as const;
export type LocalEnum = typeof LocalEnum[keyof typeof LocalEnum];

export const MultiTabOperation = {
  FULLSCREEN: 'fullscreen',
  REFRESH: 'refresh',
  CLOSE: 'close',
  CLOSEOTHERS: 'closeOthers',
  CLOSEALL: 'closeAll',
  CLOSELEFT: 'closeLeft',
  CLOSERIGHT: 'closeRight',
} as const;
export type MultiTabOperation = typeof MultiTabOperation[keyof typeof MultiTabOperation];

export const PermissionType = {
  CATALOGUE: 0,
  MENU: 1,
  BUTTON: 2,
} as const;
export type PermissionType = typeof PermissionType[keyof typeof PermissionType];


/**
 * @description: 请求头 Key 的枚举
 */
export const RequestHeaderEnum = {
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer ',
  ACCEPT_LANGUAGE: 'Accept-Language',
  CLIENT_ID: 'X-Client-Id',
  REQUEST_SOURCE: 'X-Request-Source',
  API_VERSION: 'X-API-Version',
  TIMESTAMP: 'X-Request-Timestamp',
} as const;
// 定义类型（可选，如果你的函数参数需要限制类型时使用）
export type RequestHeaderEnum = typeof RequestHeaderEnum[keyof typeof RequestHeaderEnum];


/**
 * @description: 请求来源枚举
 */
export const RequestSourceEnum = {
  WEB: 'web',
  MOBILE: 'mobile',
  API: 'api',
  ADMIN: 'admin',
  SYSTEM: 'system',
} as const;
export type RequestSourceEnum = typeof RequestSourceEnum[keyof typeof RequestSourceEnum];


/**
 * @description: API 版本枚举
 */
export const ApiVersionEnum = {
  V1_0: 'v1.0',
  V1_1: 'v1.1',
  V2_0: 'v2.0',
  V2_1: 'v2.1',
} as const;
export type ApiVersionEnum = typeof ApiVersionEnum[keyof typeof ApiVersionEnum];


/**
 * @description: 响应码常量 (对应 Java 的 code)
 */
export const ResultCode = {
  SUCCESS: '200',
  FAIL: '500',
  REQUEST_PARAMETER_ERROR: '412',
  BODY_PARAMETER_ERROR: '413',
  METHOD_ERROR: '414',
  UN_ERROR: '0001',
  ILLEGAL_PARAMETER: '0002',
  LOGIN_FAILED: '0003',
  DUPLICATE_KEY: '0004',
  NOT_FOUND: '0005',
  UNAUTHORIZED: '0006',
  FORBIDDEN: '0007',
  DISABLED: '0008',
  UNAUTHENTICATED: '0009',
} as const;

// 提取 value 类型，例如: '200' | '500' | ...
export type ResultCode = typeof ResultCode[keyof typeof ResultCode];


/**
 * @description: 响应码对应的中文描述 (对应 Java 的 message)
 * 用于当后端未返回 msg 字段时，前端做兜底展示
 */
export const ResultMessage: Record<string, string> = {
  [ResultCode.SUCCESS]: '成功',
  [ResultCode.FAIL]: '失败',
  [ResultCode.REQUEST_PARAMETER_ERROR]: '请求参数异常',
  [ResultCode.BODY_PARAMETER_ERROR]: '请求体异常',
  [ResultCode.METHOD_ERROR]: '请求方式不支持',
  [ResultCode.UN_ERROR]: '未知失败',
  [ResultCode.ILLEGAL_PARAMETER]: '非法参数',
  [ResultCode.LOGIN_FAILED]: '用户名或密码错误',
  [ResultCode.DUPLICATE_KEY]: '数据已存在',
  [ResultCode.NOT_FOUND]: '数据不存在',
  [ResultCode.UNAUTHORIZED]: '未授权',
  [ResultCode.FORBIDDEN]: '禁止访问',
  [ResultCode.DISABLED]: '禁用',
  [ResultCode.UNAUTHENTICATED]: '未认证',
};

/**
 * @description: 联合国官方语言枚举
 */
export const UNLanguagesEnum = {
  ENGLISH: 'en',
  SPANISH: 'es',
  CHINESE: 'zh',
  FRENCH: 'fr',
  RUSSIAN: 'ru',
  ARABIC: 'ar',
} as const;

export type UNLanguagesEnum = typeof UNLanguagesEnum[keyof typeof UNLanguagesEnum];
