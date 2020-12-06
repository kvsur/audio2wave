import { IDataConfig } from './interface/IConfig';
import { IEvent, IEvents } from './interface/IDataProcesser';
import { IDataProcesser } from './interface/IDataProcesser';
import { IAudio } from './interface/IElement';
import { Emitor } from './utils/Emitor/index';

const DEFAULT_CONFIG: IDataConfig = {
    fftSize: 512,
};

export class DataProcesser implements IDataProcesser {
    private audio: IAudio;
    private config: IDataConfig;
    private emitor: Emitor;
    private audioContext: AudioContext;
    private state: AudioContextState = 'suspended';
    private analyser: AnalyserNode;
    private audioSource: MediaElementAudioSourceNode;

    public byteFrequencyData: Uint8Array;

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

    getByteFrequenceData(): void {
        this.analyser.getByteFrequencyData(this.byteFrequencyData);
    }

    start(): Promise<void> {
        if (!this.analyser) {
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.config.fftSize || 512;
        }
        if (!this.audioSource) {
            const bufferLength = this.analyser.frequencyBinCount;
            this.byteFrequencyData = new Uint8Array(bufferLength);
            this.audioSource = this.audioContext.createMediaElementSource(this.audio);
        }

        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        return this.audioContext.resume();
    }

    stop(): Promise<void> {
        this.analyser.disconnect();
        this.audioSource.disconnect();
        this.audioContext.suspend().catch(e => {
            this.emitor.emit('error', new IEvent<Error>('error', e))
        }).finally(() => {
            // this.analyser = null;
            // this.audioSource = null;
        });
        return Promise.resolve();
    }

    destroy(): Promise<void> {
        this.stop().finally(() => {
            this.audioContext.close();
            this.audioContext = null;
            this.emitor.emit('destroy', new IEvent<null>('destroy', null));
        });

        return Promise.resolve();
    }

    addEventListener<K extends keyof IEvents>(eventName: K, listener: (event: IEvents[K]) => void): void {
        this.emitor.addListener(eventName, listener);
    }

    removeEventListener<K extends keyof IEvents>(eventName: K, listener: (event: IEvents[K]) => void): void {
        this.emitor.removeListener(eventName, listener);
    }
    
}