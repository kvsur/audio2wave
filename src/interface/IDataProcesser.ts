export interface IEvents {
    "destroy": IEvent<null>;
    "statechange": IEvent<AudioContextState>;
    "error": Error
}

export class IEvent<Data> {
    constructor(eventName: string, data: Data){
        this.eventName = eventName;
        this.data = data;
    }
    
    eventName: string;
    data: Data;
}

export interface IDataProcesser {
    start(): void;
    stop(): void;
    destory(): void;

    addEventListener<K extends keyof IEvents>(eventName: K, listener: (event: IEvents[K])=> void): void;
    removeEventListener<K extends keyof IEvents>(eventName: K, listener: (event: IEvents[K])=> void): void;
}