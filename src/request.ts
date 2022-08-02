import { urlJoin, defer, IRequest, IGet } from "./index.js"
export class Request implements IRequest {
    origin: string
    constructor() {
        // return this.envDesc()
    }
    fixOrigin(origin) {
        this.origin = origin
        return this
    }
    envDesc() {
        if (Window) {
            return "Window"
        }
        return "Node"
    }
    ajax(url, opts) {
        const { promise, resolve, reject } = defer()
        const { method = "GET", params = {}, body = {}, async = true, timeout = 30 * 1000 } = opts
        const xhr = new XMLHttpRequest()
        switch (method) {
            case 'GET':
                // url = urlJoin(url, params);
                break;

            default:
                break;
        }
        // xhr.addEventListener('timeout', reject)
        xhr.addEventListener('load', () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    // resolve(JSON.parse(xhr.response))
                } catch (error) {
                    // reject(error)
                }
            } else {
                // reject(xhr)
            }
        })
        xhr.open(method, url, async);
        xhr.send(body)
        xhr.timeout = async && timeout
        // return promise
    }
    fetch() {
        return fetch("")
    }
    http() {

    }
}
export const GET = () => {

}

export const POST = () => {

}
export const PUT = () => {

}
export const DELETE = () => {

}
export const OPTION = () => {

}

// new Request().ajax("/api", { timeout: 115 })