
/**产生区间随机数
* @param {number} min  最小区间
* @param {number} max  最大区间
* @param {boolean} bool  包含最大值
* @return {IObject[IKey]} 对象某个属性
**/
export const randomNum = (min: number, max: number, bool?: boolean) => {
    return Math.floor(Math.random() * (max - min + (bool ? 1 : 0)) + min);
}
/**获取url的参数
* @param {string} url  待截取的地址
* @return {object} 参数对象
**/
export const urlSplit = (url: string) => {
    const result = {};
    if (!url.includes("?")) {
        return result;
    }
    const params = url.split("?")[1].split("&");
    params.forEach((i) => {
        const key = i.split("=")[0];
        result[key] = i.split("=")[1];
    })
    return result;
}

/**添加url的参数
* @param {string} url  待添加参数的地址
* @param {object} query  待添加的参数
* @return {string} 添加参数后的url
**/
export const urlJoin = (url: string, query: object) => {
    const params = Object.keys(query).map(i => `${i}=${query[i]}`)
    return `${url}${url.includes("?") ? "&" : '?'}${params.join("&")}`;
}