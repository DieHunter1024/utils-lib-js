
export type IKey = string | symbol | number
// 对象类型
export type IObject<T> = {
    [key: IKey]: T | IObject<any>
}
// base
/**产生区间随机数
* @param {number} min  最小区间
* @param {number} max  最大区间
* @param {boolean} bool  包含最大值
* @return {number} 随机数
**/
export type IRandomNum = (min: number, max: number, bool?: boolean) => number
/**获取url的参数
* @param {string} url  待截取的地址
* @return {object} 参数对象
**/
export type IUrlSplit = (url: string) => IObject<any>
/**添加url的参数
* @param {string} url  待添加参数的地址
* @param {object} query  待添加的参数
* @return {string} 添加参数后的url
**/
export type IUrlJoin = (url: string, query: object) => string
/**获取数据类型
* @param {any} data  待检测数据
* @return {string} 数据类型
**/
export type IGetType<T> = (data: any) => typeof data | T[keyof T] | "null";


// object
/**lodash中的 _.get()，获取对象某级属性
* @param {IObject} object  目标对象
* @param {string} key  对象层级
* @param {any} defaultValue  未取得时默认值
* @return {IObject[IKey]} 对象某个属性
**/
export type IGetValue = <T>(object: IObject<T> | IObject<T>[IKey], key: string, defaultValue?: any) => IObject<T>[IKey]
/**lodash中的 _.set()，赋值对象某级属性
* @param {IObject} object  目标对象
* @param {string} key  对象层级
* @param {any} value  需要赋的值
* @return {IObject} 目标对象
**/
export type ISetValue = <T>(object: IObject<T>, key: string, value?: any) => IObject<T>
/**对象混入
* @param {IObject} target  目标对象
* @param {string} source  需要混入的对象集合
* @param {boolean} overwrite  是否重写覆盖原有属性
* @return {IObject} 目标对象
**/
export type IMixIn = <U extends IObject<any>>(target?: U, source?: IObject<any>, overwrite?: boolean) => U
/**await与try catch 捕获异常处理方法
 * @param {Promise<any>} defer  延迟函数
 * @returns {Promise<any>} Promise { <pending> }  返回异步结果数组，第一个参数是是否抛错
 */

// function
export type ICatchAwait<T extends Promise<any>> = (defer: T) => T