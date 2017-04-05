/**
 * Please run it under newest chrome
 */
let clog = function (...args) {
  console.log(...args);
};

console.info('Please run it under latest chrome');
document.addEventListener('DOMContentLoaded', function () {
  let canvas = document.querySelector('#paper');
  let thumbCanvas = document.querySelector('#thumb');
  let viewer = new Viewer(canvas, thumbCanvas, new Gfx(canvas, new Transform2D()), new Gfx(thumbCanvas));
  const demoImages = ['./img/man.jpg', './img/small.jpg', './img/body.jpg', './img/railway.png', './img/fractal.jpg', './img/100.jpg', './img/15852x12392.jpg',
    './img/grid.jpg', './img/10000x7328.jpg', './img/phanfone_eye.jpg'];
  let img = new Image();
  img.src = demoImages[7];
  viewer.openImage(img);
});