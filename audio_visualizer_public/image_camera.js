//いくつかのサイトを参考にしました。
//なぜかchromeのみ動作（safariは不可）

//大きさを決めれる。
const cameraSize = { w: canvas.width, h: canvas.height };
const resolution = { w: 1080, h: 720 };
let video;
let media;

// video要素をつくる
video          = document.createElement('video');
video.id       = 'video';
video.width    = cameraSize.w;
video.height   = cameraSize.h;
video.autoplay = true;
//video要素はautoplayを有効にしておくか、もしくはplay()メソッドで再生させる。
document.getElementById('videoPreview').appendChild(video);

// video要素にWebカメラの映像を表示させる
media = navigator.mediaDevices.getUserMedia({
//getUserMedia()メソッドはカメラやマイクなどにアクセスするメソッド。
//声は必要ないのでaudio: falseで切ってある。
  //audio: true,
  audio: false,
  video: {
    width: { ideal: resolution.w },
    height: { ideal: resolution.h }
  }
}).then(function(stream) {
  video.srcObject = stream;
});
