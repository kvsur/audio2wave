import { IDrawerConfig, ALIGN } from './interface/IConfig';
import { IDrawer } from './interface/IDrawer';
import { IContainer } from './interface/IElement';
import { IPartial } from './interface/base';

const DEFAULT_CONFIG: Partial<IDrawerConfig> = {
    color: '',
    barWidth: 2,
    align: ALIGN.LEFT,
    xSpace: 2
}


export class Drawer implements IDrawer {
    private config: IPartial<IDrawerConfig>;
    private container: IContainer;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private height = 0;
    private width = 0;
    private drawing = false;
    private heightScale = 0;
    private fftSize: number;
    private animationFrameId: number;
    private proxySetSize: () => void;

    constructor(container: IContainer, fftSize: number, config?: IPartial<IDrawerConfig>) {
        this.config = <IPartial<IDrawerConfig>>({
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
        this.animationFrameId = requestAnimationFrame(this.run);
    }

    beforeDraw: () => {}

    private init(): void {
        this.canvas = (<any>document).createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.setCanvasSize();
        this.container.appendChild(this.canvas);
        // 将canvas画布原点移动到整个画布y轴中间
        this.context.translate(0, this.height / 2);
        this.proxySetSize = () => {
            this.setCanvasSize();
        };
        window.addEventListener('resize', this.proxySetSize);
    }

    private setCanvasSize():void {
        // this.context.translate(0, this.height / 2);
        if (this.config.canvasWH) {
            this.height = this.canvas.height = this.config.canvasWH.height;
            this.width = this.canvas.width = this.config.canvasWH.width;
        } else {
            const styleInfo = getComputedStyle(this.container);

            this.height = this.canvas.height = parseFloat(styleInfo.height);
            this.width = this.canvas.width = parseFloat(styleInfo.width);
        }
        this.heightScale = (this.height / 2) / ((this.fftSize / 2) - 1);

        // 将canvas画布原点移动到整个画布y轴中间
    }

    start(): Promise<any> {
        if (!this.drawing) {
            this.run = this.innerRun;
            this.run();
            this.drawing = true;
            return Promise.resolve();
        }

        return Promise.reject('Drawer still drawing');
    }

    stop(): Promise<any> {
        if (this.drawing) {
            cancelAnimationFrame(this.animationFrameId);
            this.run = () => {};
            this.drawing = false;
            return Promise.resolve();
        }

        return Promise.reject('Drawer was stoped');
    }

    private draw(): void {
        this.context.clearRect(0, -(this.height / 2), this.width, this.height);
        if (this.config.color) {
            this.context.fillStyle = this.config.color;
        } else {
            this.context.fillStyle = `rgb(${85} 8 156)`;
        }
        this.context.fillRect(0,0,this.width,1);

        const length = this.waveData.length;

        for(let index = 0, x = 4; index < length; index++) {
            const byteFrequenceData = this.waveData[index];

            const Y = byteFrequenceData * this.heightScale;
            const negativeY = -Y;

            // this.context.fillStyle = this.config.color;
            if (this.config.color) {
                this.context.fillStyle = this.config.color;
            } else {
                this.context.fillStyle = `rgb(${index} 8 156)`;
                // this.context.fillStyle = `rgb(${85} 8 156)`;
            }
            this.context.fillRect(x, negativeY, this.config.barWidth, 2*Y);

            x += this.config.barWidth + this.config.xSpace;
        }
    }

    destroy(): Promise<any> {
        cancelAnimationFrame(this.animationFrameId);
        this.container.removeChild(this.canvas);
        this.canvas = null;
        this.context = null;
        window.removeEventListener('resize', this.proxySetSize);
        this.proxySetSize = () => {};
        return Promise.resolve();
    }
}