import { IDataConfig, IDrawerConfig, IConfig } from './interface/IConfig';
import { IContainer, IAudio } from './interface/IElement';
import { IDrawer } from './interface/IDrawer';
import { IDataProcesser } from './interface/IDataProcesser';

import { Drawer } from './Drawer';
import { DataProcesser } from './DataProcesser'

export class Audio2Wave {
    private drawer: IDrawer = null;
    private processer: IDataProcesser = null;
    private config: IConfig = null;

    constructor(config: IConfig) {
        this.config = config;
        this.drawer = new Drawer(config.container, config.drawerConfig);
        this.processer = new DataProcesser(config.audio, config.dataConfig);
    }

}