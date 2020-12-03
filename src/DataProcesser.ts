import { IDataConfig } from './interface/IConfig';
import { IEvent, IEvents } from './interface/IDataProcesser';
import { IDataProcesser } from './interface/IDataProcesser';
import { IAudio } from './interface/IElement';
import { Emitor } from './utils/Emitor';

const DEFAULT_CONFIG: IDataConfig = {
    fftSize: 512,
};

export class DataProcesser implements IDataProcesser {
    private audio: IAudio = null;
    private config: IDataConfig = null;
    private emitor: Emitor = null;
    private audioContext: AudioContext = null;
    private state: AudioContextState = 'suspended';

    constructor(audio: IAudio, config: IDataConfig = DEFAULT_CONFIG) {
        this.audio = audio;
        this.config = config;

        this.init();
    }

    private init(): void {
        this.emitor = new Emitor();
        this.audioContext = this.createAudioContext();
        this.audioContext.onstatechange = (event: Event) => {
            this.state = <AudioContextState>(<any>event.target).state;
            this.emitor.emit('statchange', new IEvent<AudioContextState>('statechange', this.state));
        };


    }

    private createAudioContext(): AudioContext {
        if((<any>window).AudioContext) {
            return new AudioContext();
        } else if((<any>window).webkitAudioContext) {
            return new webkitAudioContext();
        } else {
            throw new Error('当前浏览器版本不支持AudioContext和webkitAudioContext，请升级或者更换浏览器');
        }
    }

    start(): void {
        throw new Error('Method not implemented.');
    }
    stop(): void {
        throw new Error('Method not implemented.');
    }

    destory(): void {
        this.audioContext.close();
        this.audioContext = null;
        this.emitor.emit('destroy', new IEvent<null>('destroy', null));
    }
    addEventListener<K extends keyof IEvents>(eventName: K, listener: (event: IEvents[K]) => void): void {
        this.emitor.addListener(eventName, listener);
    }
    removeEventListener<K extends keyof IEvents>(eventName: K, listener: (event: IEvents[K]) => void): void {
        this.emitor.removeListener(eventName, listener);
    }
    
}