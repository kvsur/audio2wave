import { IDataConfig, IDrawerConfig, IConfig } from './IConfig';
import { IContainer, IAudio } from './IElement';
import { IDrawer } from './IDrawer';
import { IDataProcesser } from './IDataProcesser';

export declare class Audio2Wave {
    private drawer: IDrawer;
    private processer: IDataProcesser;


    constructor(config: IConfig);

    
}
