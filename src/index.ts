import { IConfig } from './interface/IConfig';
import { IDrawer } from './interface/IDrawer';
import { IDataProcesser } from './interface/IDataProcesser';

import { Drawer } from './Drawer';
import { DataProcesser } from './DataProcesser'
import { IBase } from './interface/IBase';
import { IAudio } from './interface/IElement';

export class Audio2Wave implements IBase {
    private drawer: IDrawer;
    private processer: IDataProcesser;
    private config: IConfig;

    private proxyStart: () => void;
    private proxyStop: () => void;

    constructor(config: IConfig) {
        this.config = config;
        const fftSize = config.dataConfig && config.dataConfig.fftSize || 512;
        this.drawer = new Drawer(config.container, fftSize, config.drawerConfig);
        this.processer = new DataProcesser(config.audio, config.dataConfig);
        (<any>window).queueMicrotask(() => {
            this.addEventListener(this.config.audio);
        });
    }
    
    start(): void {
        this.drawer.beforeDraw = () => {
            this.processer.getByteFrequenceData();
            this.drawer.waveData = this.processer.byteFrequencyData.slice(0);
        }

        this.processer.start();
        this.drawer.start();
    }

    private addEventListener(audio: IAudio) {
        this.proxyStart = () => this.start();

        audio.addEventListener('play', this.proxyStart);

        this.proxyStop = () => this.stop();
        audio.addEventListener('pause', this.proxyStop);
    }

    private removeEventListener(audio: IAudio) {
        audio.removeEventListener('play', this.proxyStart);

        audio.removeEventListener('pause',this.proxyStop);

        this.proxyStart = this.proxyStop = () => {};
    }
    
    stop(): void {
        this.drawer.stop();
        this.processer.stop();
    }
    
    destroy(): Promise<void> {
        this.removeEventListener(this.config.audio);
        this.drawer.destroy();
        this.processer.destroy();
        return Promise.resolve();
    }

}