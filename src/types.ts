import { types } from "./static"

export type IKey = string | symbol | number
// 对象类型
export interface IObject<T> {
    [key: IKey]: T | IObject<any>
}
export interface IPromise extends IObject<any> {
    promise: Promise<void>
    resolve: () => unknown
    reject: () => unknown
}

export type IDemoteArray<T> = Array<IDemoteArray<T> | T>

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

/**枚举值反向映射
* @param {IObject<string>} target  目标对象
* @return {IObject<string>} 目标对象
**/
export type IEnumInversion = (target: IObject<string>) => IObject<string>

/**对象复制
* @param {IObject<any>} target  目标对象
* @return {IObject} 目标对象
**/
export type ICloneDeep = (target?: any) => any

/**生成 对象 类型的初始值
* @param {string} type  数据类型
* @param {any} __init  初始值
* @return {any} 目标对象
**/
export type ICreateObjectVariable = (type: string, source?: any) => any

// function
/**节流(throttle):高频事件触发，但在 n 秒内只会执行一次
* @param {Function} fn  节流处理的函数
* @param {number} time  执行间隔/毫秒
* @return {Function} 处理后的函数
**/
export type IThrottle = (fn: Function, time: number) => (...args: any[]) => void

/**防抖(debounce):触发高频事件后 n 秒内函数只会执行一次
* @param {Function} fn  防抖处理的函数
* @param {number} time  允许运行函数间隔/毫秒
* @return {Function} 处理后的函数
**/
export type IDebounce = (fn: Function, time: number) => (...args: any[]) => void

/**
 * Promise扁平化，避免Promise嵌套
 * @returns {Promise,resolve,reject} 
 */
export type IDefer = () => IPromise

/**await与try catch 捕获异常处理方法
 * @param {Promise<any>} defer  延迟函数
 * @returns {Promise<any>} [error, result]
 */
export type ICatchAwait<T extends Promise<any>> = (defer: T) => T

// array
/**数组乱序
 * @param {Array<any>} arr  目标数组
 * @returns {Array<any>} 乱序后的数组
 */
export type IArrayRandom<T extends any[]> = (arr: T) => T

/**数组数组去重
 * @param {Array<any>} arr  目标数组
 * @returns {Array<any>} 去重后的数组
 */
export type IArrayUniq<T extends any[]> = (arr: T) => T

/**数组扁平化
 * @param {Array<any>} arr  目标数组
 * @returns {Array<any>} 扁平化的数组
 */

export type IArrayDemote<T extends IDemoteArray<any>> = (arr: T, result?: T) => T

// element
/**IElementParams
 * @param {string} ele 标签类型
 * @param {CSSStyleDeclaration} style 样式
 * @param {Attr} attr 属性
 * @param {object} parent 父元素
 */
interface IElementParams<T> {
    ele: T | string
    style: CSSStyleDeclaration
    attr: Attr
    parent: T
}
/**新增标签，设置属性及样式
 * @param {IElementParams} params 配置
 * @return {ElementObject} 生成的标签
 */
export type ICreateElement<T = HTMLElement> = (params: IElementParams<T>) => T