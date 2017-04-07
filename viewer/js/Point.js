class Point {
  /**
   * @param {number} [x=0]
   * @param {number} [y=0]
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * @return {Point} a copy of the point
   */
  clone() {
    return new Point(this.x, this.y);
  }

  /**
   * Returns true if the given point is equal to this point
   * @param {Point} p - The point to check
   * @returns {boolean} Whether the given point equal to this point
   */
  equals(p) {
    return Point.isEqual(this, p);
  }

  /**
   * Sets the point to a new x and y position.
   * If y is omitted, both x and y will be set to x.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  set(x, y) {
    this.x = x || 0;
    this.y = y || ((y !== 0) ? this.x : 0);
  }

  /**
   * @param {{x: Number, y: Number}} obj
   * @return {Point}
   */
  static create(obj) {
    return new Point(obj.x, obj.y);
  }

  static isEqual(p1, p2) {
    return (p1.x === p2.x) && (p1.y === p2.y);
  }

  static distance(p1, p2) {
    let squareSum = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    return Math.sqrt(squareSum);
  }
}

export default Point;