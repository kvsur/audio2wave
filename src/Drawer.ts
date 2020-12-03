import { IDrawerConfig, ALIGN } from './interface/IConfig';
import { IDrawer } from './interface/IDrawer';
import { IContainer } from './interface/IElement';

const DEFAULT_CONFIG: IDrawerConfig = {
    color: 'red',
    barWidth: 1,
    align: ALIGN.LEFT
}

export class Drawer implements IDrawer {
    private config: IDrawerConfig = null;
    private container: IContainer = null;

    constructor(container: IContainer, config?: IDrawerConfig) {
        this.config = config;
        this.container = container;
    }
    init(): void {
        throw new Error('Method not implemented.');
    }
    start(): void {
        throw new Error('Method not implemented.');
    }
    stop(): void {
        throw new Error('Method not implemented.');
    }
    destroy(): void {
        throw new Error('Method not implemented.');
    }
    beforeDraw: () => {};
    
}