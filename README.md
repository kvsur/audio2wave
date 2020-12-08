# audio2wave
[![npm](https://img.shields.io/npm/v/audio2wave.svg)](https://npm.im/audio2wave)
![downloads](https://img.shields.io/npm/dt/audio2wave.svg)
![dependencies](https://img.shields.io/:dependencies-none-green.svg)
[![license](https://img.shields.io/:license-MIT-blue.svg)](https://mvr.mit-license.org)

Draw the wave in canvas use processed data from audio Element or MediaStream

## install
Import the module and bundle it for the browser with your favorite module bundler,

```bash
$ npm install audio2wave
```

## example
```javascript
import { Audio2Wave } from '../lib/index.js';

const audio = document.getElementById('audio');

const container = document.getElementById('container')

const audio2wave = new Audio2Wave({
    audio,
    container,
    drawerConfig: {
        color: '#007fff'
    },
    dataConfig: {
        fftSize: 512
    }
});

audio.onplay = () => {
    audio2wave.start();
}

audio.onpause = () => {
    audio2wave.stop();
}

window.onunload = () => {
    audio2wave.destroy();
}
```

Or

```javascript
import { Audio2Wave } from '../lib/index.js';

const audio = new MediaStrem();

// .... TODO: add tracks

const container = document.getElementById('container')

const audio2wave = new Audio2Wave({
    audio,
    container,
    drawerConfig: {
        color: '#007fff'
    },
    dataConfig: {
        fftSize: 512
    }
});

queueMicrotask(() => {
  audio2wave.start()  
});

window.onunload = () => {
    audio2wave.destroy();
}
```

## API

#### Audio2Wave

```ts
export declare class Audio2Wave implements IBase {
    private drawer;
    private processer;
    private config;
    constructor(config: IConfig);
    start(): void;
    stop(): void;
    private stateChagneHandler;
    private addEventListener;
    private removeEventListener;
    destroy(): Promise<void>;
}
```

#### IConfig

```ts
export interface IDataConfig {
    fftSize?: 128 | 256 | 512 | 1024;
}
export declare enum ALIGN {
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2
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
```

#### IConfig.audio, IConfig.container

```ts
export interface IContainer extends HTMLElement {
}
export interface IAudio extends HTMLMediaElement {
}
export interface IStream extends MediaStream {
}
```
