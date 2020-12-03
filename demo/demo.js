var btn = document.getElementById("play-btn");
var audio = document.getElementById("audio");

btn.onclick = function () {
    btn.style.display = "none";

    audio.play();
    onLoadAudio();

};

function onLoadAudio() {
    var context = new(window.AudioContext || window.webkitAudioContext)();
    var analyser = context.createAnalyser();
    analyser.fftSize = 512;
    var source = context.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(context.destination);

    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var ctx = canvas.getContext("2d");
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = WIDTH / bufferLength * 1.5;
    var barHeight;

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0, x = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            var r = barHeight + 25 * (i / bufferLength);
            var g = 250 * (i / bufferLength);
            var b = 50;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 2;
        }
    }

    renderFrame();
    // setInterval(renderFrame, 44);
}