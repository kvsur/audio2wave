export type IPartial<T> = {
    [P in keyof T]?: T[P]
}

export type IReadOnly<T> = {
    readonly [P in keyof T]: T[P]
}

export type IRequired<T> = {
    [P in keyof T]-?: T[P]
}

export type IPick<T, K extends keyof T> = {
    [P in K]: T[P]
}