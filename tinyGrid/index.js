var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.textAlign = "center";
resize();
var type = "circle";
var colors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722'
];
var $message = document.getElementById('message');
var particles = new Container($message.value);
$message.addEventListener('keyup', function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  particles.setText(this.value);
  particles.clearChildren();
  particles.render(context);
});

// @TODO particles 内生成一个光标，可直接编辑文字
// @TODO 可设置基础字体

particles.render(context);

(function drawFrame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  particles.children.forEach(function (particle) {
    particle.render(context);
  });

  window.requestAnimationFrame(drawFrame);
}());

function resize() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight * .8;
  if(!particles) return;
  particles.clearChildren();
  particles.render(context, type);
}
window.addEventListener('resize', resize);
