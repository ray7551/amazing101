/**
 * Please run it under newest chrome
 */
console.info('Please run it under latest chrome');
document.addEventListener('DOMContentLoaded', function () {
  /* @var canvas HTMLCanvasElement*/
  let canvas = document.querySelector('#paper');
  let thumbCanvas = document.querySelector('#thumb');
  let viewer = new Viewer(canvas, thumbCanvas, new Gfx(canvas, new Transform2D()), new Gfx(thumbCanvas));
  const demoImages = ['./img/man.jpg', './img/small.jpg', './img/body.jpg', './img/railway.png', './img/fractal.jpg', './img/100.jpg',
    './img/grid.jpg'];
  let img = new Image();
  img.src = demoImages[6];
  viewer.addImage(img);
});