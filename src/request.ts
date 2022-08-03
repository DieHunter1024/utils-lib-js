import { urlJoin, defer, IRequest, IRequestBase, IInterceptors } from "./index.js"

export class Interceptors implements IInterceptors {
    private requestSuccess: Function
    private responseSuccess: Function
    private error: Function
    use(type, fn) {
        switch (type) {
            case "request":
                this.requestSuccess = fn
                break;
            case "response":
                this.responseSuccess = fn
                break;
            case "error":
                this.error = fn
                break;
        }
        return this
    }
    get reqFn() {
        return this.requestSuccess
    }
    get resFn() {
        return this.responseSuccess
    }
    get errFn() {
        return this.error
    }
}
export abstract class RequestBase extends Interceptors implements IRequestBase {
    origin: string
    constructor(origin) {
        super()
        this.origin = origin ?? ''
    }
    abstract fetch(url, opts): Promise<void>
    abstract http(url, opts): Promise<void>

    chackUrl = (url) => {
        return url.startsWith('/')
    }
    fixOrigin = (fixStr: string) => {
        if (this.chackUrl(fixStr)) return this.origin + fixStr
        return fixStr
    }
    envDesc = () => {
        if (Window) {
            return "Window"
        }
        return "Node"
    }
    requestType = () => {
        switch (this.envDesc()) {
            case "Window":
                return this.fetch
            case "Node":
                return this.http
        }
    }
    initFetchParams = (url, { method = "GET", query = {}, headers = {}, body = null, timeout = 30 * 1000, abort = new AbortController(), ...others }) => {
        const params: RequestInit = {
            method, headers, body: method === "GET" ? null : body, signal: abort.signal, ...others
        }
        return this.reqFn?.(params) ?? params
    }

}
export class Request extends RequestBase implements IRequest {
    request: Function
    constructor(origin) {
        super(origin)
        this.request = this.requestType()
    }

    fetch = (url, opts) => {
        const { promise, resolve, reject } = defer()
        url = this.fixOrigin(url)
        fetch(url, this.initFetchParams(url, opts)).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return response.json()
            }
            return reject(response.statusText)
        }).then(res => resolve(this.resFn?.(res) ?? res)).catch(err => reject(this.errFn?.(err) ?? err))
        return promise
    }
    http = (url, opts) => {
        const { promise, resolve, reject } = defer()
        return promise
    }

    GET = (url, params = {}) => {
        return this.request(url, { params, method: "GET" })
    }

    POST = (url, params = {}, body = {}) => {
        return this.request(url, { params, method: "POST", body })
    }
    PUT = (url, params = {}, body = {}) => {
        return this.request(url, { params, method: "PUT", body })
    }
    DELETE = (url, params = {}) => {
        return this.request(url, { params, method: "DELETE" })
    }
    OPTION = () => {
        const { promise, resolve, reject } = defer()
        return promise
    }
}
