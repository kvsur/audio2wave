import { IConfig } from './interface/IConfig';
import { IDrawer } from './interface/IDrawer';
import { IDataProcesser } from './interface/IDataProcesser';

import { Drawer } from './Drawer';
import { DataProcesser } from './DataProcesser'
import { IBase } from './interface/IBase';

export class Audio2Wave implements IBase {
    private drawer: IDrawer;
    private processer: IDataProcesser;
    private config: IConfig;

    constructor(config: IConfig) {
        this.config = config;
        const fftSize = config.dataConfig && config.dataConfig.fftSize || 512;
        this.drawer = new Drawer(config.container, fftSize, config.drawerConfig);
        this.processer = new DataProcesser(config.audio, config.dataConfig);
    }
    
    start(): void {
        this.drawer.beforeDraw = () => {
            this.processer.getByteFrequenceData();
            this.drawer.waveData = this.processer.byteFrequencyData.slice(0);
        }

        this.processer.start();
        this.drawer.start();
    }
    
    stop(): void {
        this.drawer.stop();
        this.processer.stop();
    }
    
    destroy(): Promise<void> {
        this.drawer.destroy();
        this.processer.destroy();
        return Promise.resolve();
    }

}