export type IKey = string | symbol | number
// 对象类型
export type IObject<T> = {
    [key: IKey]: T | IObject<any>
}
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
export type ICatchAwait<T extends Promise<any>> = (defer: T) => T