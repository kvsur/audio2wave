export interface IBase {
    start(): void;
    stop(): void;
    destroy(): Promise<void>;
}