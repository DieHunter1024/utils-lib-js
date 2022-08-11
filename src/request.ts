import { urlJoin, defer, jsonToString, IRequest, IRequestBase, IInterceptors } from "./index.js"
import { request } from "node:http"

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
        if (typeof Window !== "undefined") {
            return "Window"
        }
        return "Node"
    }

    errorFn = reject => err => reject(this.errFn?.(err) ?? err)

    clearTimer = opts => !!opts.timer && (clearTimeout(opts.timer), opts.timer = null)

    requestType = () => {
        switch (this.envDesc()) {
            case "Window":
                return this.fetch
            case "Node":
                return this.http
        }
    }

    initDefaultParams = (url, { method = "GET", query = {}, headers = {}, body = null, timeout = 30 * 1000, controller = new AbortController(), type = "json", ...others }) => ({
        url: urlJoin(this.fixOrigin(url), query), method, headers, body: method === "GET" ? null : jsonToString(body), timeout, signal: controller.signal, controller, type, timer: null, ...others
    })

    initFetchParams = (url, opts) => {
        const params = this.initDefaultParams(url, opts)
        const { controller, timer, timeout } = params
        !!!timer && (params.timer = setTimeout(() => controller.abort(), timeout))
        return this.reqFn?.(params) ?? params
    }

    initHttpParams = (url, opts) => {
        const params = this.initDefaultParams(url, opts)
        return this.reqFn?.(params) ?? params
    }

    getDataByType = (type, response) => {
        switch (type) {
            case "text":
            case "json":
            case "blob":
            case "formData":
            case "arrayBuffer":
                return response[type]()
            default:
                return response['json']()
        }
    }

}
export class Request extends RequestBase implements IRequest {
    request: Function
    constructor(origin) {
        super(origin)
        this.request = this.requestType()
    }

    fetch = (_url, _opts) => {
        const { promise, resolve, reject } = defer()
        const { url, ...opts } = this.initFetchParams(_url, _opts)
        const { signal } = opts
        signal.addEventListener('abort', this.errorFn(reject));
        fetch(url, opts).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return this.getDataByType(opts.type, response)
            }
            return this.errorFn(reject)
        }).then(res => resolve(this.resFn?.(res) ?? res)).catch(this.errorFn(reject)).finally(() => this.clearTimer(opts))
        return promise
    }

    http = (_url, _opts) => {
        const { promise, resolve, reject } = defer()
        return promise
    }

    GET = (url, query = {}, _, opts) => {
        return this.request(url, { query, method: "GET", ...opts })
    }

    POST = (url, query = {}, body, opts) => {
        return this.request(url, { query, method: "POST", body, ...opts })
    }

    PUT = (url, query = {}, body, opts) => {
        return this.request(url, { query, method: "PUT", body, ...opts })
    }

    DELETE = (url, query = {}, body, opts) => {
        return this.request(url, { query, method: "DELETE", body, ...opts })
    }

    OPTIONS = (url, query = {}, body, opts) => {
        return this.request(url, { query, method: "OPTIONS", body, ...opts })
    }

    HEAD = (url, query = {}, body, opts) => {
        return this.request(url, { query, method: "HEAD", body, ...opts })
    }

    PATCH = (url, query = {}, body, opts) => {
        return this.request(url, { query, method: "PATCH", body, ...opts })
    }
}
