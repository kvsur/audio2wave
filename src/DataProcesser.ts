import { IDataConfig } from './interface/IConfig';
import { IEvent, IEvents } from './interface/IDataProcesser';
import { IDataProcesser } from './interface/IDataProcesser';
import { IAudio, IStream } from './interface/IElement';
import { IPartial } from './interface/base';
import { Emitor } from './utils/Emitor/index';

const DEFAULT_CONFIG: IDataConfig = {
    fftSize: 512,
};

export class DataProcesser implements IDataProcesser {
    private audio: IAudio | IStream;
    private config: IPartial<IDataConfig>;
    private emitor: Emitor;
    private audioContext: AudioContext;
    private state: AudioContextState = 'suspended';
    private analyser: AnalyserNode;
    private audioSourceNode: MediaElementAudioSourceNode | MediaStreamAudioSourceNode;

    public byteFrequencyData: Uint8Array;

    private running = false;

    constructor(audio: IAudio | IStream, config: IPartial<IDataConfig> = DEFAULT_CONFIG) {
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
        // this.audioContext.onstatechange
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

    private createAudioSource(elementOrStream: IAudio | IStream) {
        if (elementOrStream instanceof HTMLMediaElement) {
            return this.audioContext.createMediaElementSource(<IAudio>elementOrStream);
        }
        return this.audioContext.createMediaStreamSource(<IStream>elementOrStream);
    }

    getByteFrequenceData(): void {
        this.analyser.getByteFrequencyData(this.byteFrequencyData);
    }

    start(): Promise<any> {
        if (this.running) return Promise.reject('Processor still running');
        this.running = true;
        if (!this.analyser) {
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.config.fftSize || 512;
        }
        if (!this.audioSourceNode) {
            const bufferLength = this.analyser.frequencyBinCount;
        this.byteFrequencyData = new Uint8Array(bufferLength);
        this.audioSourceNode = this.createAudioSource(this.audio);
        }

        this.audioSourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        return this.audioContext.resume();
    }

    stop(): Promise<any> {
        if (!this.running) return Promise.reject('Processor was stoped');
        this.running = false;
        this.analyser.disconnect();
        this.audioSourceNode.disconnect();
        this.audioContext.suspend().catch(e => {
            this.emitor.emit('error', new IEvent<Error>('error', e))
        }).finally(() => {
            // this.analyser = null;
            // this.audioSourceNode = null;
        });
        return Promise.resolve();
    }

    destroy(): Promise<any> {
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