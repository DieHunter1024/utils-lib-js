import { IGetValue, ISetValue, IMixIn } from "./types"
//lodash中的 _.get()，获取对象多级属性
export const getValue: IGetValue = (object, key, defaultValue = '') => {
    const paths = key.split('.')
    for (const i of paths) { //逐层遍历path
        object = object[i]
        if (object === undefined) { //不能用 '!value' null，0，false等等会等于false
            return defaultValue
        }
    }
    return object
}

//lodash中的 _.set()，赋值对象某级属性
export const setValue: ISetValue = (object, key, value = {}) => {
    const paths = key.split('.')
    const last = paths[paths.length - 1]//为何要在length - 1时赋值：因为object的引用关系使得我们可以一级一级赋值，而当最后一项是基本类型时，无法将引用的值赋给原始的object
    let _object: unknown = object
    for (const i of paths) {
        if (typeof _object !== "object" && _object !== undefined) {
            return object
        }
        !_object && (_object = {})
        !_object[i] && (_object[i] = {})
        last === i && (_object[last] = value)
        _object = _object[i]

    }
    return object
}
export const MixIn: IMixIn = (target, source = {}, overwrite = false) => {
    for (const k in source) {
        for (const key in source[k]) {
            const proto = target.prototype ?? target
            if (target[key] === undefined || overwrite) {
                proto[key] = source[k][key]
            }
        }
    }
    return target
}
