
/**节流(throttle):高频事件触发，但在 n 秒内只会执行一次
* @param {Function} fn  节流处理的函数
* @param {number} time  执行间隔/毫秒
* @return {Function} 处理后的函数
**/
export const throttle = (fn: Function, time: number) => {
    let count = null;
    return (...args) => {
        if (count) return;
        count = setTimeout(() => {
            fn.call(this, ...args);
            count = null;
        }, time);
    };
};
/**防抖(debounce):触发高频事件后 n 秒内函数只会执行一次
* @param {Function} fn  防抖处理的函数
* @param {number} time  允许运行函数间隔/毫秒
* @return {Function} 处理后的函数
**/
export const debounce = (fn: Function, time: number) => {
    let _timer = null;
    return () => {
        if (_timer) {
            clearTimeout(_timer);
            _timer = null;
        }
        _timer = setTimeout(fn, time);
    };
}