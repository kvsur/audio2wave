export interface IBase {
    start(): Promise<any>;
    stop(): Promise<any>;
    destroy(): Promise<any>;
}