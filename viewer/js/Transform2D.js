/*
 Simple class for keeping track of the current 2D transformation matrix
 Based on transform.js By Simon Sarris:
 https://github.com/simonsarris/Canvas-tutorials/blob/master/transform.js
 Free to use and distribute at will
 So long as you are nice to people, etc

 @usage For instance:
 let t = new Transform2D();
 t.rotate(5).scale(2);
 ctx.setTransform(...t.m);

 Is equivalent to:
 ctx.rotate(5);
 ctx.scale(2);

 But now you can retrieve it :)

 @usage You can track 2D context:
 let t = new Transform2D();
 let ctx = canvas.getContext('2d');
 t.track(canvasContext);
 ctx.translate(100, 200);
 ctx.scale(2, 2);
 console.log(ctx.transformMatrix); // [2, 0, 0, 2, 100, 200]
 // if your firefox support mozCurrentTransform
 console.log(ctx.mozCurrentTransform); // [2, 0, 0, 2, 100, 200]


 @notice Remember that this does not account for any CSS transforms applied to the canvas
 */

class Transform2D {
  constructor(m) {
    this.m = (Array.isArray(m) && m.length === 6) ? [...m] : [...Transform2D.identityMatrix];
  }

  // this getter make sure identityMatrix will not change
  static get identityMatrix() {
    return [1, 0, 0, 1, 0, 0];
  }

  static get deg2rad() {
    return Math.PI / 180;
  }

  static isTransformMatrix(m) {
    return Array.isArray(m) && m.length === 6 || Transform2D.isNumber(...m);
  }

  static isNumber(...args) {
    for (let arg of args) {
      if (typeof arg !== 'number' || isNaN(arg) || !isFinite(arg)) {
        return false;
      }
    }
    return true;
  }

  static inverse(m) {
    if (!Transform2D.isTransformMatrix(m)) {
      throw new Error('inverse parameters invalid.');
    }
    let [m0, m1, m2, m3, m4, m5] = m,
      d = 1 / (m0 * m3 - m1 * m2);
    return [
      m3 * d,
      -m1 * d,
      -m2 * d,
      m0 * d,
      d * (m2 * m5 - m3 * m4),
      d * (m1 * m4 - m0 * m5)
    ];
  }

  static transformPoint(point, matrix) {
    let {x, y} = point;
    if (!Transform2D.isNumber(x, y) || !Transform2D.isTransformMatrix(matrix)) {
      throw new Error('transformPoint parameters invalid.');
    }
    return {
      x: x * matrix[0] + y * matrix[2] + matrix[4],
      y: x * matrix[1] + y * matrix[3] + matrix[5]
    };
  }

  setMatrix(matrix) {
    if (!Array.isArray(matrix) || matrix.length !== 6 || !Transform2D.isNumber(...matrix)) {
      throw new Error('setMatrix parameters invalid.');
    }
    this.m = [...matrix];
  }

  reset() {
    this.m = [...Transform2D.identityMatrix];
    return this;
  }

  clone() {
    return new Transform2D(this.m);
  }

  multiply(transform2D) {
    let tm = transform2D.m;
    if (!Array.isArray(tm) || tm.length !== 6 || !Transform2D.isNumber(...tm)) {
      throw new Error('multiply parameters invalid.');
    }
    let [m0, m1, m2, m3, m4, m5] = this.m;

    this.m[0] = m0 * tm[0] + m2 * tm[1];
    this.m[1] = m1 * tm[0] + m3 * tm[1];
    this.m[2] = m0 * tm[2] + m2 * tm[3];
    this.m[3] = m1 * tm[2] + m3 * tm[3];
    this.m[4] = m0 * tm[4] + m2 * tm[5] + m4;
    this.m[5] = m1 * tm[4] + m3 * tm[5] + m5;
    return this;
  }

  inverse() {
    this.m = Transform2D.inverse(this.m);
    return this;
  }

  rotate(rad) {
    if (!Transform2D.isNumber(rad)) {
      throw new Error('rotate parameters invalid.');
    }
    let cos = Math.cos(rad), sin = Math.sin(rad),
      [a, b, c, d] = this.m;
    this.m[0] = a * cos + c * sin;
    this.m[1] = b * cos + d * sin;
    this.m[2] = a * -sin + c * cos;
    this.m[3] = b * -sin + d * cos;
    return this;
  }

  translate(x, y) {
    if (!Transform2D.isNumber(x, y)) {
      throw new Error('translate parameters invalid.');
    }
    this.m[4] += this.m[0] * x + this.m[2] * y;
    this.m[5] += this.m[1] * x + this.m[3] * y;
    return this;
  }

  scale(sx, sy) {
    if (!sx || !sy || !Transform2D.isNumber(sx, sy)) {
      throw new Error('scale parameters invalid.');
    }
    this.m[0] *= sx;
    this.m[1] *= sx;
    this.m[2] *= sy;
    this.m[3] *= sy;
    return this;
  }

  transformPoint(point) {
    return Transform2D.transformPoint(point, this.m);
  }

  /**
   * Tracking 2D context's transform matrix
   * @notice You must track context before doing anything related to transform matrix,
   * or reset context before track it.
   * @param {CanvasRenderingContext2D} context
   */
  track(context) {
    this.ctx = context;
    if (context.transform2DTracked) {
      return;
    }

    // read only property, a copy of current transformMatrix
    Object.defineProperty(context, 'transformMatrix', {
      get: () => [...this.m],
      set: () => {
        throw Error('You should set transformMatrix by context.setTransform');
      }
    });

    // transform matrix stack
    let savedMatrix = [];
    const save = context.save;
    context.save = () => {
      // push a clone matrix instead of push this.m
      savedMatrix.push([...this.m]);
      return save.call(this.ctx);
    };
    const restore = context.restore;
    context.restore = () => {
      this.m = savedMatrix.pop();
      return restore.call(context);
    };

    // set/reset transform matrix
    const setTransform = context.setTransform;
    context.setTransform = (a, b, c, d, e, f) => {
      this.m = [a, b, c, d, e, f];
      return setTransform.call(context, ...this.m);
    };
    /**
     * @param {Transform2D} transform2D
     */
    context.setTransform2D = (transform2D) => {
      this.m = transform2D.clone().m;
      return setTransform.call(context, ...this.m);
    };
    if (context.resetTransform) {
      const resetTransform = context.resetTransform;
      context.resetTransform = () => {
        this.reset();
        return resetTransform.call(context);
      };
    } else {
      context.resetTransform = () => context.setTransform(...Transform2D.identityMatrix);
    }

    // basic transformations
    const transform = context.transform;
    context.transform = (a, b, c, d, e, f) => {
      this.multiply(new Transform2D([a, b, c, d, e, f]));
      return transform.call(context, ...this.m);
    };
    let scale = context.scale;
    context.scale = (sx, sy) => {
      this.scale(sx, sy);
      return scale.call(context, sx, sy);
    };

    let rotate = context.rotate;
    context.rotate = (radians) => {
      this.rotate(radians);
      return rotate.call(context, radians);
    };
    context.rotateDegree = (deg) => {
      let rad = deg * Transform2D.deg2rad;
      this.rotate(rad);
      return rotate.call(context, rad);
    };

    let translate = context.translate;
    context.translate = (dx, dy) => {
      this.translate(dx, dy);
      return translate.call(context, dx, dy);
    };

    /**
     * Transform a point position under current transform matrix,
     * return its real position(relative to the canvas left top dot)
     */
    context.transformPoint = (point) => {
      return this.transformPoint(point);
    };
    /**
     * Transform a mouse point position(relative to the canvas left top dot)
     * to its current transformed coordination position
     */
    context.transformMousePoint = (mousePoint) => {
      // coordination position -> this.m -> mousePoint position
      // mousePoint position -> Transform2D.inverse(this.m) -> coordination position
      // Here we use a inverse matrix because
      // we want to get its coordination position
      return Transform2D.transformPoint(mousePoint, Transform2D.inverse(this.m));
    };

    context.transform2DTracked = true;
  }
}

export default Transform2D;