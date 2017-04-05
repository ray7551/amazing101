/**
 * @author ray7551@gmail.com
 */
class Viewer {
  constructor(canvas, thumbCanvas, gfx, thumbGfx) {
    this.imageElement = null;
    this.scale = 1;
    this.canvas = canvas; // main canvas
    this.thumbCanvas = thumbCanvas; // thumb canvas
    this.gfx = gfx;
    this.thumbGfx = thumbGfx;

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
      isDragging = this.imageElement && this.inImageRect({x: e.offsetX, y: e.offsetY});
      dragPosition = {x: e.offsetX, y: e.offsetY};
    });
    this.canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      let translateX = (e.offsetX - dragPosition.x) / this.gfx.scale.x;
      let translateY = (e.offsetY - dragPosition.y) / this.gfx.scale.y;
      this.gfx.ctx.translate(translateX, translateY);
      // this.gfx.ctx.translate(e.offsetX - dragPosition.x, e.offsetY - dragPosition.y);
      // Util.debounce(() => this.draw(), 100)();
      this.drawOnMove && this.draw();
      // this.startAnimation();
      dragPosition = {x: e.offsetX, y: e.offsetY};
    });
    this.canvas.addEventListener('mouseup', () => {
      if (!isDragging) return;

      this.draw();
      isDragging = false;
    });
    this.canvas.addEventListener('mouseleave', () => {
      if (!isDragging) return;

      this.draw();
      isDragging = false;
    });
  }

  // todo: if not need, just draw part of image by controlling sx, sy, sw, sh
  draw(sx = 0, sy = 0, sw, sh) {
    if (!this.imageElement) {
      return;
    }

    this.gfx.background('rgb(255, 255, 255)');
    // this.gfx.background('gray');
    // this.gfx.grid();

    this.sx = sx;
    this.sy = sy;
    this.sw = this.imageElement.width;
    this.sh = this.imageElement.height;
    clog('this.image.width > this.canvas.width', this.imageElement.width > this.canvas.width);
    clog('sx, sy', this.sx, this.sy);
    clog('sw, sh', this.sw, this.sh);

    let fit = this.fitImage(this.sw, this.sh, this.canvas.width, this.canvas.height);
    this.imagePosition = {x: fit.position.x, y: fit.position.y};
    this.imageWidth = fit.size.width;
    this.imageHeight = fit.size.height;

    // todo: add loading notice before image really show up
    this.gfx.drawImage(this.imageElement, this.sx, this.sy, this.sw, this.sh,
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

    if (nextWidth <= Viewer.renderedWidthMin * this.imageElement.width
      || nextWidth >= Viewer.renderedWidthMax * this.imageElement.width) {
      return;
    }
    let centerPosition = this.inImageRect(mousePosition) ? mousePosition : this.imageCenterPoint;

    this.gfx.clear();
    this.gfx.zoom(zoomStep, centerPosition, () => this.draw());
  }

  _initThumb() {
    if (this.imageElement === null) {
      return;
    }
    let w = this.imageElement.width, h = this.imageElement.height,
      cw = this.thumbCanvas.width, ch = this.thumbCanvas.height,
      fit = this.fitImage(w, h, cw, ch, Viewer.fitMode.fillCanvas);
    this.thumbPosition = {x: fit.position.x, y: fit.position.y};
    this.thumbResize = fit.size.width / w;

    this.thumbGfx.drawImage(this.imageElement, 0, 0, w, h,
      this.thumbPosition.x, this.thumbPosition.y, fit.size.width, fit.size.height);
    this._updateThumbRect();
  }

  _updateThumbRect() {
    // let lineWidth = 2, imageOriginPoint = this.gfx.ctx.transformPoint(0, 0),
    //   leftTopPoint;
    //
    // if(imageOriginPoint.x > 0 && imageOriginPoint.y > 0) {
    //   leftTopPoint = Util.deepAssign({}, imageOriginPoint);
    // } else {}
    //
    // let x = this.thumbResize * leftTopPoint.x + this.thumbDx,
    //   y = this.thumbResize * leftTopPoint.y + this.thumbDy,
    //   width = this.thumbResize * this.imageElement.width,
    //   height = this.thumbResize * this.imageElement.height;
    // this.thumbGfx.strokeInnerRect(x, y, 'red', width, height, lineWidth);
  }

  openImage(img) {
    img.addEventListener('load', () => {
      this.imageElement = img;
      this.draw();
      this._initThumb();
    });
  }

  /**
   * Put img at canvas center and resize image to make it all visible.
   * Calc the destination imageWidth and imageHeight it should be
   * @param imageWidth
   * @param imageHeight
   * @param canvasWidth
   * @param canvasHeight
   * @param {Symbol} [fitMode=Viewer.fitMode.center]
   */
  fitImage(imageWidth, imageHeight, canvasWidth, canvasHeight, fitMode = Viewer.fitMode.center) {
    let imageRatio = imageHeight / imageWidth,
      canvasRatio = canvasHeight / canvasWidth;
    let ret = {
      position: {x: 0, y: 0},
      size: {width: imageWidth, height: imageHeight}
    };
    if (fitMode === Viewer.fitMode.center && this.sw <= canvasWidth && this.sh <= canvasHeight) {
      ret.size.width = imageWidth;
      ret.size.height = imageHeight;
    } else if (imageRatio >= canvasRatio) {
      ret.size.height = canvasHeight;
      ret.size.width = canvasHeight / imageRatio;
    } else {
      ret.size.width = canvasWidth;
      ret.size.height = canvasWidth * imageRatio;
    }
    ret.position = {
      x: (canvasWidth - ret.size.width) / 2,
      y: (canvasHeight - ret.size.height) / 2
    };
    return ret;
  }

  /**
   * if image larger than 10000 x 10000, don't draw when mouse moving
   */
  get drawOnMove() {
    return this.imageElement && this.imageElement.width * this.imageElement.height < 1e8;
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

}
Viewer.zoomStep = .1;
Viewer.renderedWidthMin = .01;
Viewer.renderedWidthMax = 8;
Viewer.fitMode = {
  // if image is smaller than canvas, enlarge it to fill canvas
  fillCanvas: Symbol(),
  // if image is smaller than canvas, do not enlarge it,
  // just place it at center of canvas
  center: Symbol()
};