import { IRequest, IGet } from "./types"
export class Request implements IRequest {
    origin: string
    constructor() {
        // return this.envDesc()
    }
    fixOrigin(origin) {
        return origin
    }
    envDesc() {
        if (Window) {
            return "Window"
        }
        return "Node"
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