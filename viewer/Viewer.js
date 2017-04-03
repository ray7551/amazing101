/**
 * @author ray7551@gmail.com
 */
class Viewer {
  constructor(canvas, thumbCanvas, gfx, thumbGfx) {
    this.image = null;
    this.scale = 1;
    this.canvas = canvas; // main canvas
    this.thumbCanvas = thumbCanvas; // thumb canvas
    this.gfx = gfx;
    this.thumbGfx = thumbGfx;

    this.draw();
    this.thumbGfx.drawRect(0, 0, 'rgb(255, 255, 255)', this.thumbCanvas.width, this.thumbCanvas.height);

    this.canvas.addEventListener('wheel', (e) => {
      if(!e.deltaY) return;

      this.resizeImage(e.deltaY, {
        x: e.offsetX,
        y: e.offsetY
      });
    });
    // todo: drag and drop
    // todo: draw grid
  }

  _initThumb() {
    if(this.image === null) {
      return;
    }
    let w = this.image.width, h = this.image.height,
      cw = this.thumbCanvas.width, ch = this.thumbCanvas.height,
      tan = h / w, cTan = ch / cw;
    this.thumbSw = this.image.width;
    this.thumbSh = this.image.height;
    // calc where to draw img in the thumb canvas
    // if tan <= cTan, then fit to thumb canvas width,
    // otherwise, fit to thumb canvas height
    if(tan <= cTan) {
      this.thumbDw = cw;
      this.thumbDh = cw * tan;
      this.thumbDx = 0;
      this.thumbDy = (ch - this.thumbDh) / 2;
    } else {
      this.thumbDh = ch;
      this.thumbDw = ch / tan;
      this.thumbDx = (cw - this.thumbDw) / 2;
      this.thumbDy = 0;
    }
    this.thumbScale = this.thumbDw / w;
    this.thumbGfx.drawImage(this.image, 0, 0, this.thumbSw, this.thumbSh, this.thumbDx, this.thumbDy, this.thumbDw, this.thumbDh);
    this._updateThumbRect();
  }

  _updateThumbRect() {
    let lineWidth = 2,
      x = this.thumbScale * this.sx + this.thumbDx,
      y = this.thumbScale * this.sy + this.thumbDy,
      width = this.thumbScale * this.image.width,
      height = this.thumbScale * this.image.height;
    console.log('update thumb rect', x, y, width, height, lineWidth);
    this.thumbGfx.strokeInnerRect(x, y, 'red', width, height, lineWidth);
  }

  addImage(img) {
    img.addEventListener('load', () => {
      this.image = img;
      this.draw(0, 0, img.width, img.height, 0, 0);
      this._initThumb();
    });
  }

  draw(sx = 0, sy =0, sw, sh, dx=0, dy=0) {
    this.gfx.background('rgb(255, 255, 255)');
    this.gfx.grid('gray');

    if(!this.image) {
      return;
    }

    this.sx = sx;
    this.sy = sy;
    this.sw = sw || this.image.width;
    this.sh = sh || this.image.height;
    let canvas = this.canvas;

    // calc where to draw img in the main canvas,
    // put img at left top corner and resize image to make it all visible
    let dWidth, dHeight;
    if(this.sw <= canvas.width && this.sh <= canvas.height) {
      dWidth = this.sw;
      dHeight = this.sh;
    } else if(this.sh / this.sw >= canvas.height / canvas.width) {
      dHeight = canvas.height;
      dWidth = this.sw * canvas.height / this.sh;
    } else {
      dWidth = canvas.width;
      dHeight = this.sh * canvas.width / this.sw;
    }
    // todo: add loading notice before image really show up
    this.gfx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, dx, dy, dWidth, dHeight);
    this.gfx.strokeInnerRect(200, 200, 'red', 200, 200, 2);
  }

  resizeImage(wheelDeltaY, centerPoint = {x: 0, y: 0}) {
    // TODO if centerPoint is not in image, should replace it with image center 
    let isZoomIn = wheelDeltaY < 0;
    let zoomStep = isZoomIn ? Viewer.zoomStep : -Viewer.zoomStep;
    let nextScale = this.gfx.scale.x * (1 + zoomStep);
    if(nextScale > Viewer.zoomMax || nextScale < Viewer.zoomMin) {
      return;
    }

    this.gfx.clear();
    this.gfx.zoom(zoomStep, centerPoint, () => this.draw());
  }
}
Viewer.zoomStep = .1;
Viewer.zoomMax = 5;
Viewer.zoomMin = .001;