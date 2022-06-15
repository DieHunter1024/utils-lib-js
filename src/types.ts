export type IKey = string | symbol | number
export type IObject<T> = {
    [key: IKey]: T | IObject<any>
}

export type IGetValue = <T>(object: IObject<T> | IObject<T>[IKey], key: string, defaultValue?: any) => IObject<T>[IKey]
export type ISetValue = <T>(object: IObject<T>, key: string, value?: any) => IObject<T>
export type IMixIn = <U extends IObject<any>>(target?: U, source?: IObject<any>, overwrite?: boolean) => U