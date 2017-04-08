import Gfx from './Gfx';
import Transform2D from './Transform2D';
import Point from './Point';
import Rectangle from './Rectangle';
import {clog} from './util';

/**
 * @author ray7551@gmail.com
 */
class Viewer {
  constructor(canvas, thumbCanvas) {
    this.imageElement = null;
    this.canvas = canvas; // main canvas
    this.thumbCanvas = thumbCanvas; // thumb canvas
    this.gfx = new Gfx(canvas, new Transform2D());
    this.thumbGfx = new Gfx(thumbCanvas, new Transform2D());

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
      isDragging = this.imageElement && this._inImageRect({x: e.offsetX, y: e.offsetY});
      dragPosition = {x: e.offsetX, y: e.offsetY};
    });
    this.canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      let translateX = (e.offsetX - dragPosition.x) / this.gfx.scale.x;
      let translateY = (e.offsetY - dragPosition.y) / this.gfx.scale.y;
      this.gfx.ctx.translate(translateX, translateY);
      this.drawOnMove && this._draw();
      dragPosition = {x: e.offsetX, y: e.offsetY};
    });
    this.canvas.addEventListener('mouseup', () => {
      if (!isDragging) return;
      this._draw();
      isDragging = false;
    });
    this.canvas.addEventListener('mouseleave', () => {
      if (!isDragging) return;
      this._draw();
      isDragging = false;
    });
  }

  _initImage() {
    this.gfx.clear();
    this.gfx.background();

    this.imagePosition = {x: 0, y: 0};
    let fit = Viewer.fitImage(
      this.imageElement.width, this.imageElement.height,
      this.canvas.width, this.canvas.height
    );
    this.gfx.ctx.translate(fit.position.x, fit.position.y);
    this.gfx.ctx.scale(
      fit.size.width / this.imageElement.width,
      fit.size.height / this.imageElement.height
    );

    this.gfx.image(this.imageElement, {
      dx: this.imagePosition.x,
      dy: this.imageElement.y
    });
    this.imageZoom = 1;
  }

  // todo: if not need, just draw part of image by controlling sx, sy, sw, sh
  _draw() {
    if (!this.imageElement) {
      return;
    }

    this.gfx.clear();
    this.gfx.background();
    // this.gfx.background('gray');
    // this.gfx.grid();

    // todo: add loading notice before image really show up
    this.gfx.image(this.imageElement);

    this._drawThumb();
  }

  /**
   * Zooming in mouse point or image center
   * @param {Number} wheelDeltaY
   * @param {{x: Number, y: Number}} mousePosition x,y distance relative to canvas left top dot
   */
  zoom(wheelDeltaY, mousePosition = {x: 0, y: 0}) {
    let isZoomIn = wheelDeltaY < 0;
    let zoomStep = isZoomIn ? Viewer.zoomStep : -Viewer.zoomStep;
    let nextZoom = this.imageZoom * (1 + zoomStep);
    let nextScale = this.gfx.scale.x * (1 + zoomStep);

    if (nextZoom <= Viewer.zoomMin || nextScale >= Viewer.zoomMax) {
      return;
    }
    let centerPosition = this._inImageRect(mousePosition) ? mousePosition : this.imageCenterPoint;

    this.gfx.clear();
    this.gfx.zoom(zoomStep, centerPosition, () => this._draw());
    this.imageZoom *= 1 + zoomStep;
  }

  _initThumb() {
    this.thumbGfx.clear();
    this.thumbGfx.background();

    let w = this.imageElement.width, h = this.imageElement.height,
      cw = this.thumbCanvas.width, ch = this.thumbCanvas.height,
      fit = Viewer.fitImage(w, h, cw, ch, Viewer.fitMode.fillCanvas);

    this.thumbPosition = {x: fit.position.x, y: fit.position.y};
    this.thumbResize = fit.size.width / w;
    let transform = new Transform2D()
      .translate(fit.position.x, fit.position.y)
      .scale(fit.size.width / w, fit.size.height / h);
    this.thumbGfx.ctx.setTransform2D(transform);

    this.thumbGfx.image(this.imageElement);
  }

  _drawThumb() {
    if (this.imageElement === null) {
      return;
    }
    this.thumbGfx.clear();
    this.thumbGfx.background();

    this.thumbGfx.image(this.imageElement);

    // draw red rectangle
    let imgRect = new Rectangle({x: 0, y: 0}, this.imageElement.width, this.imageElement.height);
    let canvasPoint = Point.create(this.gfx.ctx.inverseTransformPoint(new Point(0, 0)));
    let canvasRect = new Rectangle(
      canvasPoint,
      this.canvas.width / this.gfx.scale.x,
      this.canvas.height / this.gfx.scale.y
    );
    // the visible rectangle of image
    let visibleRect = Rectangle.intersect(imgRect, canvasRect);
    if (!visibleRect) return;

    this.thumbGfx.innerRect(
      visibleRect.x,
      visibleRect.y,
      'red',
      visibleRect.width,
      visibleRect.height,
      2 / this.thumbGfx.scale.x
    );
  }

  openImage(img) {
    img.addEventListener('load', () => {
      this.imageElement = img;
      this._initImage();
      this._initThumb();
      this._draw();
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
   * @return {{
   *    position: {x: Number, y: Number},
   *    size: {width: Number, height: Number}
   * }}
   */
  static fitImage(imageWidth, imageHeight, canvasWidth, canvasHeight, fitMode = Viewer.fitMode.center) {
    let imageRatio = imageHeight / imageWidth,
      canvasRatio = canvasHeight / canvasWidth;
    let ret = {
      position: {x: 0, y: 0},
      size: {width: imageWidth, height: imageHeight}
    };
    if (fitMode === Viewer.fitMode.center
      && imageWidth <= canvasWidth && imageHeight <= canvasHeight) {
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
    let width = this.imageElement.width * this.gfx.scale.x;
    let height = this.imageElement.height * this.gfx.scale.y;
    return {
      x: this.imageLeftTopPoint.x + width / 2,
      y: this.imageLeftTopPoint.y + height / 2
    };
  }

  /**
   * if a mousePosition on top of image
   * @param {{x: Number, y: Number}} mousePosition x,y distance relative to canvas left top dot
   */
  _inImageRect(mousePosition) {
    let topLeft = this.imageLeftTopPoint;
    let width = this.imageElement.width * this.gfx.scale.x;
    let height = this.imageElement.height * this.gfx.scale.y;
    return mousePosition.x >= topLeft.x && mousePosition.x <= topLeft.x + width
      && mousePosition.y >= topLeft.y && mousePosition.y <= topLeft.y + height;
  }

}
Viewer.zoomStep = .1;
Viewer.zoomMin = .08; // rendered min width / initial rendered width
Viewer.zoomMax = 8;   // rendered man width / origin image width
Viewer.fitMode = {
  // if image is smaller than canvas, enlarge it to fill canvas
  fillCanvas: Symbol(),
  // if image is smaller than canvas, do not enlarge it,
  // just place it at center of canvas
  center: Symbol()
};

export default Viewer;