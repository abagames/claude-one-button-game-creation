/**
 * 2D Vector utilities for game simulation
 * Provides vector math operations for drawing functions
 */

/**
 * Simple Vector class for 2D operations needed by drawing functions.
 */
class Vector {
  constructor(x = 0, y = 0) {
    if (typeof x === "object") {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  set(x, y) {
    if (typeof x === "object") {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mul(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  div(scalar) {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  rotate(angle) {
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const x = this.x * ca - this.y * sa;
    const y = this.x * sa + this.y * ca;
    this.x = x;
    this.y = y;
    return this;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

module.exports = { Vector };
