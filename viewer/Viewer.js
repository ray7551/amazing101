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

    this.addEventListener();
    // todo: draw grid
  }

  addEventListener() {
    this.canvas.addEventListener('wheel', (e) => {
      if (!e.deltaY) return;

      this.zoom(e.deltaY, {
        x: e.offsetX,
        y: e.offsetY
      });
    });
    let isDragging = false;
    let dragPosition = {};
    this.canvas.addEventListener('mousedown', (e) => {
      isDragging = this.image && this.inImageRect({x: e.offsetX, y: e.offsetY});
      dragPosition = {x: e.offsetX, y: e.offsetY};
    });
    this.canvas.addEventListener('mousemove', (e) => {
      if(!isDragging) {
        return;
      }
      let translateX = (e.offsetX - dragPosition.x) / this.gfx.scale.x;
      let translateY = (e.offsetY - dragPosition.y) / this.gfx.scale.y;
      this.gfx.ctx.translate(translateX, translateY);
      // this.gfx.ctx.translate(e.offsetX - dragPosition.x, e.offsetY - dragPosition.y);
      // Util.debounce(() => this.draw(), 100)();
      // this.draw();
      // this.startAnimation();
      dragPosition = {x: e.offsetX, y: e.offsetY};
    });
    this.canvas.addEventListener('mouseup', () => {
      this.draw();
      isDragging = false;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.draw();
      isDragging = false;
    });
  }

  _initThumb() {
    if (this.image === null) {
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
    if (tan <= cTan) {
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
    clog('update thumb rect', x, y, width, height, lineWidth);
    this.thumbGfx.strokeInnerRect(x, y, 'red', width, height, lineWidth);
  }

  addImage(img) {
    img.addEventListener('load', () => {
      this.image = img;
      this.draw(0, 0, img.width, img.height, 0, 0);
      this._initThumb();
    });
  }

  // todo: if not need, just draw part of image by controlling sx, sy, sw, sh
  draw(sx = 0, sy = 0, sw, sh, dx = 0, dy = 0) {
    this.gfx.background('rgb(255, 255, 255)');
    // this.gfx.grid();

    if (!this.image) {
      return;
    }

    this.sx = sx;
    this.sy = sy;
    this.imagePosition = {x: dx, y: dy};
    this.sw = sw || this.image.width;
    this.sh = sh || this.image.height;
    let canvas = this.canvas;

    // Put img at left top corner and resize image to make it all visible.
    // Calc the destination imageWidth and imageHeight it should be
    if (this.sw <= canvas.width && this.sh <= canvas.height) {
      this.imageWidth = this.sw;
      this.imageHeight = this.sh;
    } else if (this.sh / this.sw >= canvas.height / canvas.width) {
      this.imageHeight = canvas.height;
      this.imageWidth = this.sw * canvas.height / this.sh;
    } else {
      this.imageWidth = canvas.width;
      this.imageHeight = this.sh * canvas.width / this.sw;
    }
    // todo: add loading notice before image really show up
    this.gfx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh,
      this.imagePosition.x, this.imagePosition.y, this.imageWidth, this.imageHeight);
    // this.gfx.strokeInnerRect(200, 200, 'red', 200, 200, 2);
  }

  /**
   * Zooming in mouse point or image center
   * @param {Number} wheelDeltaY
   * @param {{x: Number, y: Number}} mousePosition x,y distance relative to canvas left top dot
   */
  zoom(wheelDeltaY, mousePosition = {x: 0, y: 0}) {
    let isZoomIn = wheelDeltaY < 0;
    let zoomStep = isZoomIn ? Viewer.zoomStep : -Viewer.zoomStep;
    let nextScale = this.gfx.scale.x * (1 + zoomStep);
    let nextWidth = nextScale * this.imageWidth;
    
    if (nextScale >= Viewer.zoomMax || nextScale <= Viewer.zoomMin
      || nextWidth <= Viewer.renderedWidthMin * this.image.width
      || nextWidth >= Viewer.renderedWidthMax * this.image.width) {
      return;
    }
    let centerPosition = this.inImageRect(mousePosition) ? mousePosition : this.imageCenterPoint;

    this.gfx.clear();
    this.gfx.zoom(zoomStep, centerPosition, () => this.draw());
  }
  
  get imageLeftTopPoint() {
    return this.gfx.ctx.transformPoint(this.imagePosition);
  }
  get imageCenterPoint() {
    let width = this.imageWidth * this.gfx.scale.x;
    let height = this.imageHeight * this.gfx.scale.y;
    return {
      x: this.imageLeftTopPoint.x + width / 2,
      y: this.imageLeftTopPoint.y + height / 2
    };
  }

  /**
   * if a mousePosition on top of image
   * @param {{x: Number, y: Number}} mousePosition x,y distance relative to canvas left top dot
   */
  inImageRect(mousePosition) {
    let topLeft = this.imageLeftTopPoint;
    let width = this.imageWidth * this.gfx.scale.x;
    let height = this.imageHeight * this.gfx.scale.y;
    return mousePosition.x >= topLeft.x && mousePosition.x <= topLeft.x + width
      && mousePosition.y >= topLeft.y && mousePosition.y <= topLeft.y + height;
  }

  /**
   * Drag and drop to move image
   */
  pan() {

  }
}
Viewer.zoomStep = .1;
Viewer.zoomMax = 25;
Viewer.zoomMin = .001;
Viewer.renderedWidthMin = .01;
Viewer.renderedWidthMax = 10;