import { MutiMap } from '../Map/index';

type Fn = (...args: Array<any>) => void;

export class Emitor {
    private map = new MutiMap<string, Fn>();

    addListener(eventName: string, listener: Fn) {
        this.map.add(eventName, listener);
    }

    removeListener(eventName: string, listener: Fn) {
        this.map.deleteItem(eventName, listener);
    }

    emit(eventName: string, ...args: any[]) {
        const listeners = this.map.get(eventName);

        try {
            listeners.forEach(listener => {
                listener(...args);
            });
        } catch (e) {
            console.error(e);
        }
    }
}
