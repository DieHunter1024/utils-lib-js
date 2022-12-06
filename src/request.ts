import { urlJoin, defer, jsonToString, stringToJson, IRequest, IRequestBase, IRequestInit, IInterceptors, IUrl, IObject, IRequestBody, IRequestOptions, IRequestBaseFn, IEnv } from "./index.js"
let httpRequest, httpsRequest, parse, CustomAbortController
if (typeof require !== "undefined") {
    CustomAbortController = require("abort-controller")
    httpRequest = require("http").request
    httpsRequest = require("https").request
    parse = require("url").parse
} else if (typeof AbortController !== "undefined") {
    CustomAbortController = AbortController
} else {
    CustomAbortController = () => {
        throw new Error('AbortController is not defined')
    }
}
class Interceptors implements IInterceptors {
    private requestSuccess: Function
    private responseSuccess: Function
    private error: Function
    use(type: "request" | "response" | "error", fn: Function): IInterceptors {
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
abstract class RequestBase extends Interceptors implements IRequestBase {
    readonly origin: IUrl
    constructor(origin: IUrl) {
        super()
        this.origin = origin ?? ''
    }
    abstract fetch(url: string, opts: IRequestOptions): Promise<void>
    abstract http(url: string, opts: IRequestOptions): Promise<void>

    chackUrl = (url: IUrl) => {
        return url.startsWith('/')
    }
    checkIsHttps = (url: IUrl) => {
        return url.startsWith('https')
    }
    fixOrigin = (fixStr: string) => {
        if (this.chackUrl(fixStr)) return this.origin + fixStr
        return fixStr
    }

    envDesc = (): IEnv => {
        if (typeof Window !== "undefined") {
            return "Window"
        }
        return "Node"
    }

    errorFn = reject => err => reject(this.errFn?.(err) ?? err)

    clearTimer = (opts) => !!opts.timer && (clearTimeout(opts.timer), opts.timer = null)

    initAbort = (params: IRequestOptions): IRequestOptions => {
        const { controller, timer, timeout } = params
        !!!timer && (params.timer = setTimeout(() => controller.abort(), timeout))
        return params
    }

    requestType = (): IRequestBaseFn => {
        switch (this.envDesc()) {
            case "Window":
                return this.fetch
            case "Node":
                return this.http
        }
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
    formatBodyString = (bodyString: string): IObject<Function> => {
        return {
            text: () => bodyString,
            json: () => stringToJson(bodyString) ?? bodyString,
            blob: () => stringToJson(bodyString),
            formData: () => stringToJson(bodyString),
            arrayBuffer: () => stringToJson(bodyString),
        }
    }

}
abstract class RequestInit extends RequestBase implements IRequestInit {
    constructor(origin) {
        super(origin)
    }
    abstract fetch(url, opts): Promise<void>
    abstract http(url, opts): Promise<void>
    initDefaultParams = (url: IUrl, { method = "GET", query = {}, headers = {}, body = null, timeout = 30 * 1000, controller = new CustomAbortController(), type = "json", ...others }) => ({
        url: urlJoin(this.fixOrigin(url), query), method, headers, body: method === "GET" ? null : jsonToString(body), timeout, signal: controller?.signal, controller, type, timer: null, ...others
    } as IRequestOptions)

    initFetchParams = (url: IUrl, opts: IRequestOptions) => {
        const params = this.initAbort(this.initDefaultParams(url, opts))
        return this.reqFn?.(params) ?? params
    }

    initHttpParams = (url: IUrl, opts: IRequestOptions) => {
        const params = this.initAbort(this.initDefaultParams(url, opts))
        const options = parse(params.url, true)
        return this.reqFn?.({ ...params, ...options }) ?? { ...params, ...options }
    }
}
export class Request extends RequestInit implements IRequest {
    private request: Function
    constructor(origin) {
        super(origin)
        this.request = this.requestType()
    }

    fetch = (_url: string, _opts: IRequestOptions): Promise<any> => {
        const { promise, resolve, reject } = defer()
        const { url, ...opts } = this.initFetchParams(_url, _opts)
        const { signal } = opts
        promise.finally(() => this.clearTimer(opts))
        signal.addEventListener('abort', () => this.errorFn(reject));
        fetch(url, opts).then((response) => {
            if (response?.status >= 200 && response?.status < 300) {
                return this.getDataByType(opts.type, response)
            }
            return this.errorFn(reject)
        }).then(res => resolve(this.resFn?.(res) ?? res)).catch(this.errorFn(reject))
        return promise
    }

    http = (_url: string, _opts: IRequestOptions): Promise<any> => {
        const { promise, resolve, reject } = defer()
        const params = this.initHttpParams(_url, _opts)
        const { signal, url } = params
        promise.finally(() => this.clearTimer(params))
        const request = this.checkIsHttps(url) ? httpsRequest : httpRequest
        const req = request(params, (response) => {
            if (response?.statusCode >= 200 && response?.statusCode < 300) {
                let data = "";
                response.setEncoding('utf8');
                response.on('data', (chunk) => data += chunk);
                return response.on("end", () => {
                    const result = this.getDataByType(params.type, this.formatBodyString(data))
                    resolve(this.resFn?.(result) ?? result)
                });
            }
            return this.errorFn(reject)(response?.statusMessage)
        })
        signal.addEventListener('abort', () => this.errorFn(reject)(req.destroy(new Error('request timeout'))));
        req.on('error', this.errorFn(reject));
        req.end();
        return promise
    }

    GET = (url?: IUrl, query?: IObject<any>, _?: IRequestBody | void, opts?: IRequestOptions) => this.request(url, { query, method: "GET", ...opts })

    POST = (url?: IUrl, query?: IObject<any>, body?: IRequestBody, opts?: IRequestOptions) => this.request(url, { query, method: "POST", body, ...opts })

    PUT = (url?: IUrl, query?: IObject<any>, body?: IRequestBody, opts?: IRequestOptions) => this.request(url, { query, method: "PUT", body, ...opts })

    DELETE = (url?: IUrl, query?: IObject<any>, body?: IRequestBody, opts?: IRequestOptions) => this.request(url, { query, method: "DELETE", body, ...opts })

    OPTIONS = (url?: IUrl, query?: IObject<any>, body?: IRequestBody, opts?: IRequestOptions) => this.request(url, { query, method: "OPTIONS", body, ...opts })

    HEAD = (url?: IUrl, query?: IObject<any>, body?: IRequestBody, opts?: IRequestOptions) => this.request(url, { query, method: "HEAD", body, ...opts })

    PATCH = (url?: IUrl, query?: IObject<any>, body?: IRequestBody, opts?: IRequestOptions) => this.request(url, { query, method: "PATCH", body, ...opts })
}
