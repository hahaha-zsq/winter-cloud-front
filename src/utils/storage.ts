/**
 * localStorage模块封装
 */
import config from "@/config";

export default {
	/**
	 * storage存储
	 * @param key {string} 参数名称
	 * @param value {any} 写入值
	 */
	set(key: string, value: any) {
		const storage = this.getStorage();
		storage[key] = value;
		localStorage.setItem(config.namespace, JSON.stringify(storage))
	},
	getStorage() {
		return JSON.parse(window.localStorage.getItem(config.namespace) || '{}');
	},
	/**
	 * storage读取
	 * @param key {string} 参数名称
	 * @returns storage值
	 */
	get(key: string) {
		return this.getStorage()[key]
	},
	/**
	 * 删除localStorage值
	 * @param key {string} 参数名称
	 */
	remove(key: string) {
		// 获取命名空间下的内容
		const storage = this.getStorage();
		// 删除该对象的某一个key
		delete storage[key]
		// 重新存储
		localStorage.setItem(config.namespace, JSON.stringify(storage));
	},
	/**
	 * 清空localStorage值
	 */
	clear() {
		localStorage.clear()
	}
}
