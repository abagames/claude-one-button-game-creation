declare type Options = {
  // Screen size of the game, default: {x: 100, y: 100}.
  viewSize?: { x: number; y: number };
};
declare let options: Options;
// A function called every 1/60 second.
declare function update(): void;

// A variable incremented by one every 1/60 second.
declare let ticks: number;
// Game score.
declare let score: number;
// A variable that is one at the beginning of the game, two after 1 minute, and increasing by one every minute.
declare let difficulty: number;

// color
declare type Color =
  | "transparent"
  | "white"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "purple"
  | "cyan"
  | "black"
  | "light_red"
  | "light_green"
  | "light_yellow"
  | "light_blue"
  | "light_purple"
  | "light_cyan"
  | "light_black";
// Set the color for drawing shapes and texts.
declare function color(colorName: Color): void;

/*
 * A return value type for collision detection.
 * Draw functions return a collision info.
 * - **isColliding.rect** is used to test a collision to specific color shapes.
 *  e.g. `isColliding.rect.blue`
 * - **isColliding.text** is used to test a collision to specific text.
 *  e.g. `isColliding.text.e`
 */
type Collision = {
  isColliding: {
    rect?: {
      transparent?: boolean;
      white?: boolean;
      red?: boolean;
      green?: boolean;
      yellow?: boolean;
      blue?: boolean;
      purple?: boolean;
      cyan?: boolean;
      black?: boolean;
      light_red?: boolean;
      light_green?: boolean;
      light_yellow?: boolean;
      light_blue?: boolean;
      light_purple?: boolean;
      light_cyan?: boolean;
      light_black?: boolean;
    };
    text?: { [k: string]: boolean };
  };
};

/**
 * Draw a rectangle.
 * @param x An x-coordinate or `Vector` position of the top left corner.
 * @param y A y-coordinate of the top left corner.
 * @param width
 * @param height
 * @returns Information about objects that collided during drawing.
 */
declare function rect(
  x: number,
  y: number,
  width: number,
  height?: number
): Collision;
declare function rect(x: number, y: number, size: VectorLike): Collision;
declare function rect(
  pos: VectorLike,
  width: number,
  height?: number
): Collision;
declare function rect(pos: VectorLike, size: VectorLike): Collision;

/**
 * Draw a box. (center-aligned rect)
 * @param x An x-coordinate or `Vector` position of the center of the box.
 * @param y A y-coordinate of center of the box.
 * @param width
 * @param height
 * @returns Information about objects that collided during drawing.
 */
declare function box(
  x: number,
  y: number,
  width: number,
  height?: number
): Collision;
declare function box(x: number, y: number, size: VectorLike): Collision;
declare function box(
  pos: VectorLike,
  width: number,
  height?: number
): Collision;
declare function box(pos: VectorLike, size: VectorLike): Collision;

/**
 * Draw a bar (angled rect), which is a line specified by the center coordinates and length.
 * @param x An x-coordinate or `Vector` position of the center of the bar.
 * @param y A y-coordinate of center of the bar.
 * @param length
 * @param thickness
 * @param rotate Angle of the bar.
 * @param centerPosRatio A value from 0 to 1 that defines where the center coordinates are on the line, default: 0.5.
 * @returns Information about objects that collided during drawing.
 */
declare function bar(
  x: number,
  y: number,
  length: number,
  thickness: number,
  rotate: number,
  centerPosRatio?: number
): Collision;
declare function bar(
  pos: VectorLike,
  length: number,
  thickness: number,
  rotate: number,
  centerPosRatio?: number
): Collision;

/**
 * Draw a line.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param thickness
 * @returns Information about objects that collided during drawing.
 */
declare function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thickness?: number
): Collision;
declare function line(
  x1: number,
  y1: number,
  p2: VectorLike,
  thickness?: number
): Collision;
declare function line(
  p1: VectorLike,
  x2: number,
  y2: number,
  thickness?: number
): Collision;
declare function line(
  p1: VectorLike,
  p2: VectorLike,
  thickness?: number
): Collision;

/**
 * Draw an arc.
 * @param centerX
 * @param centerY
 * @param radius
 * @param thickness
 * @param angleFrom
 * @param angleTo
 * @returns Information about objects that collided during drawing.
 */
declare function arc(
  centerX: number,
  centerY: number,
  radius: number,
  thickness?: number,
  angleFrom?: number,
  angleTo?: number
): Collision;
declare function arc(
  centerPos: VectorLike,
  radius: number,
  thickness?: number,
  angleFrom?: number,
  angleTo?: number
): Collision;

// Options for drawing text and characters.
declare type LetterOptions = {
  color?: Color;
  backgroundColor?: Color;
  // A value from 0 to 3 that defines the direction of character rotation.
  rotation?: number;
  mirror?: { x?: 1 | -1; y?: 1 | -1 };
  scale?: { x?: number; y?: number };
};

/**
 * Draw a text.
 * @param str
 * @param x
 * @param y
 * @param options
 * @returns Information about objects that collided during drawing.
 */
declare function text(
  str: string,
  x: number,
  y: number,
  options?: LetterOptions
): Collision;
declare function text(
  str: string,
  pos: VectorLike,
  options?: LetterOptions
): Collision;

// Get a new Vector instance.
declare function vec(x?: number | VectorLike, y?: number): Vector;

// Get a random float value.
declare function rnd(lowOrHigh?: number, high?: number): number;
// Get a random integer value.
declare function rndi(lowOrHigh?: number, high?: number): number;
/*
 * Get a random float value that becomes negative with a one-half probability.
 * If **high** parameter isn't specified, return a value from -**lowOrHigh** to **lowOrHigh**.
 */
declare function rnds(lowOrHigh?: number, high?: number): number;

// Input (mouse, touch, keyboard)
declare type Input = {
  // A variable that becomes `true` while the button is pressed.
  isPressed: boolean;
  // A variable that becomes `true` when the button is just pressed.
  isJustPressed: boolean;
  // A variable that becomes `true` when the button is just released.
  isJustReleased: boolean;
};
declare let input: Input;

declare const PI: number;
declare function abs(v: number): number;
declare function sin(v: number): number;
declare function cos(v: number): number;
declare function atan2(y: number, x: number): number;
declare function pow(b: number, e: number): number;
declare function sqrt(v: number): number;
declare function floor(v: number): number;
declare function round(v: number): number;
declare function ceil(v: number): number;
declare function clamp(v: number, low?: number, high?: number): number;
declare function wrap(v: number, low: number, high: number): number;
declare function range(v: number): number[];
declare function times<T>(count: number, func: (index: number) => T): T[];
/**
 * A function that takes an **array** as its first argument and a **func**tion as its second argument.
 * The function receives each element of the array as a first argument.
 * If the function returns `true`, this element is removed from the array.
 * @param array
 * @param func
 * @returns Removed array elements.
 */
declare function remove<T>(
  array: T[],
  func: (v: T, index?: number) => any
): T[];

// A two-dimensional vector class with functions useful for working with (x, y) coordinates.
declare interface Vector {
  x: number;
  y: number;
  constructor(x?: number | VectorLike, y?: number): Vector;
  set(x?: number | VectorLike, y?: number): this;
  add(x?: number | VectorLike, y?: number): this;
  sub(x?: number | VectorLike, y?: number): this;
  mul(v: number): this;
  div(v: number): this;
  clamp(xLow: number, xHigh: number, yLow: number, yHigh: number): this;
  wrap(xLow: number, xHigh: number, yLow: number, yHigh: number): this;
  addWithAngle(angle: number, length: number): this;
  swapXy(): this;
  normalize(): this;
  rotate(angle: number): this;
  angleTo(x?: number | VectorLike, y?: number): number;
  distanceTo(x?: number | VectorLike, y?: number): number;
  isInRect(x: number, y: number, width: number, height: number): boolean;
  equals(other: VectorLike): boolean;
  floor(): this;
  round(): this;
  ceil(): this;
  length: number;
  angle: number;
}

declare interface VectorLike {
  x: number;
  y: number;
}
