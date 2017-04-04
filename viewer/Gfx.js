/**
 * Graphic methods
 */
class Gfx {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Transform2D} transform
   */
  constructor(canvas, transform = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.lastScale = 1;
    if (transform) {
      transform.track(this.ctx);
    }
  }

  background(color) {
    this.ctx.save();
    this.ctx.resetTransform();
    this.drawRect(0, 0, color, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  grid(color = 'gray') {

  }

  drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    this.ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }

  clear() {
    this.ctx.save();
    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  drawCircle(x, y, color, radius) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, Math.PI * 2, 0);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  };

  strokeInnerRect(x, y, color, width, height, lineWidth = 1) {
    // default strokeRect method actually draw 'centerRect',
    // so we have to recalculate x, y, width, height here
    x = x + lineWidth / 2;
    y = y + lineWidth / 2;
    width = width > 2 * lineWidth ? width - lineWidth : width;
    height = height > 2 * lineWidth ? height - lineWidth : height;
    height = height === void 0 ? width : height;
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(x, y, width, height);
    this.ctx.restore();
  };

  drawRect(x, y, color, width, height) {
    height = height === void 0 ? width : height;
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.fillRect(x, y, width, height);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  };

  drawText(text, width, height) {
    this.ctx.save();
    this.ctx.font = height + "px/1.4 arial";
    this.ctx.fillText(text, 0, height);
    this.ctx.restore();
  }

  getImageDataBuffer32() {
    let imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    return {
      buffer32: new Uint32Array(imgData.data.buffer),
      width: this.canvas.width,
      height: this.canvas.height
    };
  }

  zoom(zoomStep, centerPoint = {x: 0, y: 0}, callback) {
    let scale = 1 + zoomStep;
    let tCenterPoint = this.ctx.transformMousePoint(centerPoint);
    
    this.ctx.translate(tCenterPoint.x, tCenterPoint.y);
    this.ctx.scale(scale, scale);
    this.ctx.translate(-tCenterPoint.x, -tCenterPoint.y);
    // clog('c', centerPoint.x, centerPoint.y);
    // clog('currentScale', this.scale.x, this.scale.y);
    // clog("transform matrix", this.ctx.transformMatrix);
    clog('======');
    callback();
  }

  get scale() {
    return {
      x: this.ctx.transformMatrix[0],
      y: this.ctx.transformMatrix[3]
    };
  }
}
Gfx.round = function (floatNum, i = 6) {
  i = Math.pow(10, i);
  return Math.floor(floatNum * i) / i;
};