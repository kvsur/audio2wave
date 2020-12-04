import { Audio2Wave } from '../lib/index.js';

const audio = document.getElementById('audio');

const container = document.getElementById('container')

const audio2wave = new Audio2Wave({
    audio,
    container,
});

audio.onplaying = () => {
    audio2wave.start();
}

audio.onpause = () => {
    audio2wave.stop();
}

window.onunload = () => {
    audio2wave.destroy();
}