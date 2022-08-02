import { urlJoin, defer, IRequest, IRequestBase } from "./index.js"


export abstract class RequestBase implements IRequestBase {
    origin: string
    constructor(origin) {
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
    initOptions = (opts) => {
        const { method = "GET", params = {}, body = {}, async = true, timeout = 30 * 1000 } = opts
        return { method, params, body, async, timeout }
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
        const { method, params, body, async, timeout } = this.initOptions(opts)
        fetch(url, this.initOptions(opts)).then((res) => {
            console.log(res)
            return res.json()
        }).then((res) => {
            console.log(res)
        })
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
