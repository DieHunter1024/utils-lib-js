// 数组乱序
export const arrayRandom = (arr: any[]) => arr.sort(() => Math.random() - 0.5);
// 数组去除
export const arrayUniq = (arr: any[]) => Array.from(new Set(arr))