import { getType } from "./base"
// 数组乱序
export const arrayRandom = (arr: any[]) => arr.sort(() => Math.random() - 0.5);
// 数组去除
export const arrayUniq = (arr: any[]) => Array.from(new Set(arr))
// 数组扁平化
export const arrayDemote = (arr: any[], result: any[] = []) => {
    arr.forEach(i => getType(i) === "array" ? arrayDemote(i, result) : result.push(i))
    return result;
}