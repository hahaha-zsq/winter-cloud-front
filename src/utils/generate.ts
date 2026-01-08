/**
 * 生成随机字母数字字符串
 * @param min 最小长度 (默认 8)
 * @param max 最大长度 (默认 32)
 * @returns 随机字符串
 */
export const generateRandomString = (min: number = 8, max: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // 1. 确定生成的字符串长度
    const length = Math.floor(Math.random() * (max - min + 1)) + min;

    let result = '';
    // 2. 循环拼接
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
};