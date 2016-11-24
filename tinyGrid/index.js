var colors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722'
];

var $message = util.$('#message');
$message.addEventListener('change', function () {
  renderer.ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
  stage.clearChildren();
  console.log('input changed to: ', this.value);
  var newImgBuffer32 = getTextImgBuffer32(this.value, false);
  console.log('newImgBuffer32', newImgBuffer32);
  stage.generate(newImgBuffer32);
});

var renderer = new Renderer(util.$('#canvas'));
// renderer.ctx.textAlign = "center";
var stage = new Stage();

var tmpCanvas = document.createElement('canvas');
var tmpCtx = tmpCanvas.getContext('2d');
document.body.appendChild(tmpCanvas);
function getTextImgBuffer32(text, render) {
  console.log('clear tmp canvas');
  tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
  if(render) Graphics.fillText(tmpCtx, text, 200, 80);
  console.log('getting imgDataBuffer32 in index.js');
  return Graphics.getImageDataBuffer32(tmpCtx);
}

// @TODO generate a caret inside particles, and i can edit it directly
stage.generate(getTextImgBuffer32($message.value, true));

(function drawFrame() {
  renderer.ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
  renderer.render(stage);
  stage.update();

  window.requestAnimationFrame(drawFrame);
}());

// function resize() {
//   renderer.canvas.width = document.body.clientWidth;
//   renderer.canvas.height = document.body.clientHeight * .8;
//   if(!stage) return;
//   stage.clearChildren();
//   stage.generate(renderer.ctx, type);
// }
// window.addEventListener('resize', resize);

window.addEventListener('resize', function () {
  renderer.ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
  // don't use window.innerWidth and window.innerHeight here,
  // or it will leave a block of space below the canvas
  // while change orientation to landscape.(iOS 7)
  // You should set html, body {width: 100%;height: 100%;}
  // with document.body.clientWidth and document.body.clientHeight
  stage.resize(document.body.clientWidth, document.body.clientHeight);
  renderer.resize(document.body.clientWidth, document.body.clientHeight);
});
