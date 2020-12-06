import { IAudio, IContainer } from './IElement';

export interface IDataConfig {
    fftSize?: 128|256|512|1024;
}

export enum ALIGN {
    LEFT,
    CENTER,
    RIGHT,
}

export interface CanvasWH {
    width: number;
    height: number;
}

export interface IDrawerConfig {
    color?: string;
    barWidth?: number;
    align?: ALIGN;
    xSpace?: number;
    canvasWH?: CanvasWH;
}

export interface IConfig {
    audio: IAudio;
    container: IContainer;
    dataConfig?: IDataConfig;
    drawerConfig?: IDrawerConfig;
}