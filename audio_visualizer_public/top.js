(()=>{
  let $ = c.getContext("2d"),
          h = c.height = window.innerHeight,
          w = c.width = window.innerWidth,
          random = (n)=>Math.random()*n,
          stars = new Array(1000).fill().map(()=>{
              return {r: random(w),   s: random(0.01), a: random(Math.PI*2)};
          });
  function loop(){
      $.fillStyle="rgba(0,0,0,.1)";
      $.fillRect(0,0,w,h);
      stars.forEach(e=>{
          e.a+=e.s;
          $.save();
          $.beginPath();
          $.translate(w/2, h/2);
          $.rotate(e.a);
          $.arc(e.r,e.r,1,0,Math.PI*2);
          //$.arc(Math.cos(e.a)*e.r + w/2, Math.sin(e.a)*e.r + h/2,1,0,Math.PI*2);
          $.closePath();
          $.fillStyle = "blue";
          $.fill();
          $.restore()
      })
      requestAnimationFrame(loop)
  }
  loop();
  window.addEventListener("resize", (e)=>{
      w=c.width=window.innerWidth;
      h=c.height=window.innerHeight;
  });
})()
//上は拝借したデータ：配列で置き換えている。


{
let t = 0 ;
//function draw() {//動かない
var draw = function() {
const can = $("#c2")[0];
const ctx = can.getContext("2d");
var intendedWidth = document.querySelector('.wrapper').clientWidth;
can.setAttribute('width',intendedWidth);

var WIDTH = can.width;
var HEIGHT = can.height;
ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.beginPath();
    ctx.font = 'bold 64px Futura';
    ctx.strokeStyle = "white";
    ctx.textAlign = 'center';//起点からの文字配列：横方向
    //ctx.textBaseline = 'top';//起点からの文字配列：縦方向（ベースラインから）
    //let t = Math.floor( Math.random() * 10 );//ガタガタ動くパターン
    ctx.strokeText('Audio Visualizer 2.0',(WIDTH/2) + Math.sin(t), HEIGHT/2+ Math.sin(t), 1000);//('文字', x, y, **文字の幅!）;
    ctx.fill();
    //requestAnimationFrame(draw);
    t++;
    setTimeout(draw, 50);//tを10ミリ秒ごとdrawしていく
};
draw();
}

