import { IDrawerConfig, ALIGN } from './interface/IConfig';
import { IDrawer } from './interface/IDrawer';
import { IContainer } from './interface/IElement';

const DEFAULT_CONFIG: IDrawerConfig = {
    color: 'rgb(61 126 154)',
    barWidth: 2,
    align: ALIGN.LEFT,
    xSpace: 2
}


export class Drawer implements IDrawer {
    private config: IDrawerConfig;
    private container: IContainer;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private height = 0;
    private width = 0;
    private drawing = false;
    private heightScale = 0;
    private fftSize: number;

    constructor(container: IContainer, fftSize: number, config?: IDrawerConfig) {
        this.config = <IDrawerConfig>({
            ...DEFAULT_CONFIG,
            ...config
        });
        this.container = container;
        this.fftSize = fftSize;

        this.init();
    }

    public waveData: Uint8Array;

    private run = () => {}

    private innerRun = () => {
        this.beforeDraw();
        // TODO draw work
        this.draw();
        requestAnimationFrame(this.run);
    }

    beforeDraw: () => {}

    private init(): void {
        this.canvas = (<any>document).createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.setCanvasSize();
        this.container.appendChild(this.canvas);
        // 将canvas画布原点移动到整个画布y轴中间
        this.context.translate(0, this.height / 2);
        window.addEventListener('resize', this.setCanvasSize);
    }

    private setCanvasSize():void {
        const styleInfo = getComputedStyle(this.container);

        this.height = this.canvas.height = parseFloat(styleInfo.height);
        this.width = this.canvas.width = parseFloat(styleInfo.width);
        this.heightScale = (this.height / 2) / ((this.fftSize / 2) - 1);
    }

    start(): void {
        if (!this.drawing) {
            this.run = this.innerRun;
            this.run();
            this.drawing = true;
        }
    }

    stop(): void {
        if (this.drawing) {
            this.run = () => {};
            this.drawing = false;
        }
    }

    private draw(): void {
        this.context.clearRect(0, -(this.height / 2), this.width, this.height);
        this.context.fillStyle = this.config.color;
        this.context.fillRect(0,0,this.width,this.config.barWidth);

        const length = this.waveData.length;

        for(let index = 0, x = 0; index < length; index++) {
            const byteFrequenceData = this.waveData[index];

            const Y = byteFrequenceData * this.heightScale;
            const negativeY = -Y;

            this.context.fillStyle = this.config.color;
            this.context.fillRect(x, negativeY, this.config.barWidth, 2*Y);

            x += this.config.barWidth + this.config.xSpace;
        }
    }

    destroy(): Promise<void> {
        this.container.removeChild(this.canvas);
        this.canvas = null;
        this.context = null;
        window.removeEventListener('resize', this.setCanvasSize);
        return Promise.resolve();
    }
}