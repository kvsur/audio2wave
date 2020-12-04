import { IBase } from "./IBase";

export interface IDrawer extends IBase {
    beforeDraw: () => void;
    waveData: Uint8Array;
}