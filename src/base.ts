
/**产生区间随机数
* @param {number} min  最小区间
* @param {number} max  最大区间
* @param {boolean} bool  包含最大值
* @return {IObject[IKey]} 对象某个属性
**/
export const randomNum = (min, max, bool) => {
    return Math.floor(Math.random() * (max - min + bool) + min);
}