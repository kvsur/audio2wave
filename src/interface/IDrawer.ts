export interface IDrawer {
    init(): void;
    start(): void;
    stop(): void;
    destroy(): void;
    beforeDraw: () => {};
}