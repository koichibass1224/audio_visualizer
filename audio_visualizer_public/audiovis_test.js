//web audio APIで音源からデータ抽出：図形の直径（もしくは線の太さ）の箇所に変動データを挿入。
//createAnimationでループし、audio visualizerを生成しました。

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var analyser;
var gradient;

//audio再生
var gainNode = audioCtx.createGain();

//audio play
var userMusic = document.getElementById('sound');
/*userMusic.volume = 1;*/

//発火スイッチ・最下に起点のwindows.onloadがある。
function init() {
  canvas.addEventListener('dragover', dragoverHandler);
  canvas.addEventListener('drop', dropHandler);
  canvas.addEventListener('click', togglePlay);

  createGradient1();
  createGradient2();
  createGradient3();
  createAnalyser();
  //changeGain();

  source = audioCtx.createMediaElementSource(userMusic);
  source.connect(analyser);//analyser受け渡し
  source.connect(gainNode);//audio音源受け渡し


//destination
gainNode.connect(audioCtx.destination);
var dist = audioCtx.createWaveShaper();
var gain = audioCtx.createGain();

source.connect(gain);
gain.connect(dist);
dist.connect(audioCtx.destination);

gain.gain.value = 1;
dist.curve = makeDistortionCurve(0);

var range = document.querySelector('#range');
range.addEventListener('input', function(){
  var value = parseInt(this.value) * 5;
  dist.curve = makeDistortionCurve(value);
});

// http://stackoverflow.com/a/22313408/1090298
function makeDistortionCurve( amount ) {
  var k = typeof amount === 'number' ? amount : 0,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};


// LFOの作成
const lfo = audioCtx.createOscillator();
const depth = audioCtx.createGain();
depth.gain.value = 50;
//let sourse = userMusic;

source.connect(gainNode);//audio音源受け渡し

/*document.querySelector("#play").addEventListener("click", () => {
  // 再生中なら二重に再生されないようにする
  if (isPlaying) return;*/
  //oscillator = audioCtx.createOscillator();
  //sourse.type = "sine";
  // frequencyのvalueは直接代入も可能
  sourse.frequency.value = 440;

  // lfoの波形をサイン派に
  lfo.type = "sine";
  // lfoの周波数を10Hzに設定
  lfo.frequency.value = 10

  // ここで出力にgainNodeをつなげる
  sourse.connect(gainNode).connect(audioCtx.destination);
  //oscillator.start();

  // lfoを、depthを経由してオシレーターの周波数パラメータにつなげる
  //lfo.connect(depth).connect(oscillator.frequency);
  lfo.connect(depth).connect(audioCtx.frequency);
  lfo.start();


// ビブラートの速さを調節
document.querySelector("#hz-plus").addEventListener("click", () => {
  lfo.frequency.value += 3
});

document.querySelector("#hz-minus").addEventListener("click", () => {
  if (lfo.frequency.value > 3) {
  lfo.frequency.value -= 3
  }
});

//ビブラートの深さを調節
document.querySelector("#depth-plus").addEventListener("click", () => {
  depth.gain.value += 5;
});

document.querySelector("#depth-minus").addEventListener("click", () => {
  if (depth.gain.value > 5) {
    depth.gain.value -= 5;
  }
});

}



function createAnalyser() {
  analyser = audioCtx.createAnalyser();//analyzer生成
  analyser.smoothingTimeConstant = 0.85;//参考：https://www.g200kg.com/jp/docs/webaudio/analyser.html
  analyser.fftSize =32; 
  // avaliable values: 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768
  //bit数によって模様が変わる。averageは2048だが256以降読み込みが遅くなる上、図形が潰れる。
}

//UI向上：画面clickでオンオフ
function togglePlay() {
  return userMusic.paused ? userMusic.play() : userMusic.pause();
}
function dragoverHandler(e) {
  e.preventDefault();
}
function dropHandler(e) {
  e.preventDefault();

  if ( e.dataTransfer.items ) {
    if ( e.dataTransfer.items[0].kind === 'file' ) {
      var file = e.dataTransfer.items[0].getAsFile();
      //var blobURL = window.URL.createObjectURL( file );//blobURLに変換
      var blobURL = URL.createObjectURL( file );

      document.getElementById('sound').setAttribute('src', blobURL);//読み込んでいる
      document.querySelector('.songtitle').innerHTML = file.name;//インラインを置き換えてtitle反映する

      visualize();//dropHandlerを起点にして描写→最下にvisualizeのfunctionがあり。

      //userMusic.play();//playのコマンド。safariは自動再生が無いので不可能。
      //audioCtx.resume();// Chrome 66 autoplay fix （参考：https://qiita.com/zprodev/items/7fcd8335d7e8e613a01f）
    }
  }
}


//動作まで起動させない
const eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
document.addEventListener(eventName, initAudioContext);
function initAudioContext(){
document.removeEventListener(eventName, initAudioContext);
// wake up AudioContext
audioCtx.resume();
}

//canvas1
var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

var intendedWidth = document.querySelector('.wrapper').clientWidth;
canvas.setAttribute('width',intendedWidth);
//canvasの大きさをfixできる。(https://qiita.com/GRGSIBERIA/items/bbe4ead1773f072dde1d)

var x = canvas.width/2;//x軸：/2で中心
var y = canvas.height/2;//y軸：/2で中心

//createGradient＝gradationを作る
function createGradient1() {
  gradient = canvasCtx.createRadialGradient(x,y,5,x,y,290);
  //（中心の座標x,y+半径：前半3つは開始〜後半3つは終了位置）
  gradient.addColorStop(0,"#2FB9D0");
  gradient.addColorStop(0.5,"#65F7E4");
  gradient.addColorStop(1,"#E9E7DF");
  //参考：https://www.palettable.io/A2985B
}

//drawCircle→var draw内から引っ張っている
function drawCircle1(circleRadius) {
  //saveしないと次の図形で影響
  canvasCtx.save();
  canvasCtx.beginPath();
  canvasCtx.arc(x, y, circleRadius, 0, Math.PI * 2);//３番目が直径。
  canvasCtx.strokeStyle = gradient;
  canvasCtx.lineWidth = 2;//線の幅(strokeweightでも可)
  canvasCtx.stroke();//fillでなくstrokeで描いているのがお洒落！
  canvasCtx.closePath();
  canvasCtx.restore();  
}

//canvas2
function createGradient2() {
  gradient2 = canvasCtx.createRadialGradient(x,y,5,x,y,290);
  //グラデ2
  gradient2.addColorStop(0,"#D64F4F");
  gradient2.addColorStop(0.5,"#7D1197");
  gradient2.addColorStop(1,"#3D076A");
}
//drawCircleはインデント必要。いち動作を複数に反映はできない。
function drawCircle2(circleRadius) {
  var canvas = document.querySelector('.visualizer2');
  var canvasCtx = canvas.getContext("2d");
  canvasCtx.save();
  canvasCtx.beginPath();
  canvasCtx.arc(x, y, circleRadius, 0, Math.PI * 2);
  canvasCtx.strokeStyle = gradient2;
  canvasCtx.lineWidth = 2;
  canvasCtx.stroke();
  canvasCtx.closePath();
  canvasCtx.restore();  
}

//canvas3
function createGradient3() {
  gradient3 = canvasCtx.createRadialGradient(x,y,5,x,y,290);
  //グラデ3
  gradient3.addColorStop(0,"#FDFD9D");
  gradient3.addColorStop(0.5,"#FF6C00");
  gradient3.addColorStop(1,"#D24F23");
}
function drawCircle3(circleRadius) {
  var canvas = document.querySelector('.visualizer3');
  var canvasCtx = canvas.getContext("2d");
  canvasCtx.save();
  canvasCtx.beginPath();
  canvasCtx.arc(x, y, circleRadius, 0, Math.PI * 2);
  canvasCtx.strokeStyle = gradient3;
  canvasCtx.lineWidth = 10;
  //太さを変えた
  canvasCtx.stroke();
  canvasCtx.closePath();
  canvasCtx.restore();  
}

//canvas4:四角version
function drawRect(rectRadius) {
  var canvas = document.querySelector('.visualizer4');
  var canvasCtx = canvas.getContext("2d");
  
  canvasCtx.save();
  canvasCtx.beginPath();
  canvasCtx.rect(rectRadius, rectRadius, rectRadius*3, rectRadius*3);//x,y,幅,高さ
  canvasCtx.strokeStyle =  "#"+rectRadius;//カラーをランダムに
  canvasCtx.lineWidth = 2;
  canvasCtx.stroke();
  canvasCtx.closePath();
  canvasCtx.restore();
}

//canvas5
function drawRect2(rectRadius) {
  var canvas = document.querySelector('.visualizer5');
  var canvasCtx = canvas.getContext("2d");
  var a = canvas.width/2/2;//x軸：1
  var b = canvas.height/2/2;//y軸：1
  var c = canvas.width/2*1.5;//y軸：2
  var d = canvas.height/2*1.5;//y軸：2
//x,y軸をpxでしない。固定にしないと構図が崩壊する。

  //var random = Math.floor(Math.random()); 
  //canvasCtx.rotate(random/ 180 * Math.PI);

  //canvasCtx.strokeStyle =  "#"+rectRadius;//これもこれで良いが少し目がチカチカしてしまう
  canvasCtx.strokeStyle = "#0148FD";
  canvasCtx.lineWidth = rectRadius/2;//縦横に反映してもよいが、lineに変化を与えた。

  canvasCtx.save();
  canvasCtx.beginPath();
  //canvasCtx.rect(185, 200, 1, 1);//x,y,幅,高さ：指定するとブラウザによってずれる
  canvasCtx.rect(a, b, 1, 1);
  canvasCtx.stroke();
  canvasCtx.closePath();
  canvasCtx.restore();

  canvasCtx.save();
  canvasCtx.beginPath();
  //canvasCtx.rect(185, 500, 1, 1);//x,y,幅,高さ
  canvasCtx.rect(a, d, 1, 1);
  canvasCtx.stroke();
  canvasCtx.closePath();
  canvasCtx.restore();

  canvasCtx.save();
  canvasCtx.beginPath();
  //canvasCtx.rect(880, 200, 1, 1);//x,y,幅,高さ
  canvasCtx.rect(c, b, 1, 1);
  canvasCtx.stroke();
  canvasCtx.closePath();
  canvasCtx.restore();

  canvasCtx.save();
  canvasCtx.beginPath();
  //canvasCtx.rect(880, 500, 1, 1);//x,y,幅,高さ
  canvasCtx.rect(c, d, 1, 1);
  canvasCtx.stroke();
  canvasCtx.closePath();
  canvasCtx.restore();
}

//canvas6: 図形がカオスになる機能・使わない
/*function drawRect3(rectRadius) {
  var canvas = document.querySelector('.visualizer6');
  var canvasCtx = canvas.getContext("2d");
  canvasCtx.rotate(rectRadius / 180 * Math.PI);
}*/

function visualize() {
  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;
//8bit変換（参考：https://www.g200kg.com/jp/docs/webaudio/analyser.html）
  var bufferLengthAlt = analyser.frequencyBinCount;
  var dataArrayAlt = new Uint8Array(bufferLengthAlt);
  //var dataArrayAlt = new Float32Array(bufferLengthAlt); //Float情報は処理しきれない情報。

  //描写
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  var draw = function() {
    requestAnimationFrame(draw);//変数へ渡して無限にfunctionしている(=call back関数？)

    //realtimedata取得している
    //(getByteTimeDomainData=信号の生データ/FrequencyData=スペクトル:波形データ)
    //Float32=FloatとUnit8=Byte→Float取得はFloat32Arrayで取得する。
    analyser.getByteFrequencyData(dataArrayAlt);
    //analyser.getByteTimeDomainData(dataArrayAlt);//:Time（信号データ）は図形激しくなる

    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
    var circleRadius;
    var rectRadius;
    var x = 0;

    for(var i = 0; i < bufferLengthAlt; i++) {
      circleRadius = dataArrayAlt[i];
      rectRadius = dataArrayAlt[i];
      drawCircle1(circleRadius);
      drawCircle2(circleRadius);
      drawCircle3(circleRadius);
      drawRect(rectRadius);
      drawRect2(rectRadius);

      //console.log(rectRadius);
      x += barWidth + 1;//引用：範囲内で収める
    }
  };
  draw();
}
//お洒落な書き方（冒頭に書かない）：window.onload = function () {→chromeのみ
//window.onload = function () {
$(window).on('load', function(){ 
  init();
//};
});
