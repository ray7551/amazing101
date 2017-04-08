import Point from './Point';
class Rectangle {
  /**
   * @param {Point|{x: Number, y: Number}} leftTopPoint
   * @param {Number} width
   * @param {Number} height
   */
  constructor(leftTopPoint = new Point(0, 0), width, height) {
    this.x = leftTopPoint.x;
    this.y = leftTopPoint.y;
    this.width = width;
    this.height = height;
  }

  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }

  get leftTopPoint() {
    return new Point(this.x, this.y);
  }
  get rightBottomPoint() {
    return new Point(this.right, this.bottom);
  }

  clone() {
    return new Rectangle(this.leftTopPoint, this.width, this.height);
  }

  /**
   * The intersection of two axis-aligned rectangles
   * @param {Rectangle} rect1
   * @param {Rectangle} rect2
   * @return {Rectangle|Null}the intersection rectangle or null
   */
  static intersect(rect1, rect2) {
    let leftTopPoint = new Point(
      Math.max(rect1.left, rect2.left),
      Math.max(rect1.top, rect2.top)
    );
    let rightBottomPoint = new Point(
      Math.min(rect1.right, rect2.right),
      Math.min(rect1.bottom, rect2.bottom)
    );
    if(leftTopPoint.x <= rightBottomPoint.x
      && leftTopPoint.y <= rightBottomPoint.y) {
      return new Rectangle(
        leftTopPoint,
        rightBottomPoint.x - leftTopPoint.x,
        rightBottomPoint.y - leftTopPoint.y
      );
    }
    return null;
  }
}

export default Rectangle;