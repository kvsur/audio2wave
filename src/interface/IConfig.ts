import { IAudio, IContainer, IStream } from './IElement';

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
    audio: IAudio | IStream;
    container: IContainer;
    dataConfig?: IDataConfig;
    drawerConfig?: IDrawerConfig;
}