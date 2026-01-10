/** Title of the game. Displayed in the game frame and browser tab. */
declare let title: string;
/** Description of the game. Displayed below the title. */
declare let description: string;
/** Array of character patterns used by `char()`. */
declare let characters: string[];
/** Theme names for the game's appearance. */
declare type ThemeName =
  | "simple"
  | "pixel"
  | "shape"
  | "shapeDark"
  | "crt"
  | "dark";
/** Options to configure game behavior and appearance. */
declare type Options = {
  /** Play background music if true. */
  isPlayingBgm?: boolean;
  /** Enable replay functionality if true. */
  isReplayEnabled?: boolean;
  /** Draw particles in front of other elements if true. */
  isDrawingParticleFront?: boolean;
  /** Draw score text in front of other elements if true. */
  isDrawingScoreFront?: boolean;
  /** Set the size of the game view. */
  viewSize?: { x: number; y: number };
  /** Seed for random number generation used in audio synthesis. */
  audioSeed?: number;
  /** Set the visual theme of the game. */
  theme?: ThemeName;
};
/** Game configuration options. */
declare let options: Options;
/** The main game loop function, called 60 times per second. */
declare function update(): void;

/** Frame counter. Increments by 1 every frame (1/60 seconds). */
declare let ticks: number;
/**
 * A variable that is one at the beginning of the game, two after 1 minute, and increasing by one every minute.
 */
declare let difficulty: number;
// score
/** Current game score. */
declare let score: number;

// Add score
/**
 * Add a score point.
 * @param value Point to add.
 * @param x An x-coordinate where added point is displayed.
 * @param y A y-coordinate where added point is displayed.
 */
declare function addScore(value: number, x: number, y: number): void;
/**
 * Add a score point.
 * @param value Point to add.
 * @param pos A `Vector` position where added point is displayed.
 */
declare function addScore(value: number, pos: VectorLike): void;

/**
 * End the current game session.
 * @param gameOverText Optional text to display when the game ends. Default: "Game Over"
 */
declare function end(gameOverText?: string): void;

/** Available color names. */
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
/** Set the current drawing color. */
declare function color(colorName: Color): void;

/** Represents collision information returned by drawing functions. */
declare type Collision = {
  /** Object containing flags for collisions with specific drawn elements. */
  isColliding: {
    /** Flags for collision with rectangles (drawn by `rect()`, `box()`, `bar()`, `line()`, `arc()`) drawn with specific colors. */
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
    /** Flags for collision with text drawn with specific characters. */
    text?: { [k: string]: boolean };
    /** Flags for collision with characters drawn with specific patterns. */
    char?: { [k: string]: boolean };
  };
};

/** Draw a rectangle. */
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

/** Draw a box (center-aligned rectangle). */
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
 * Draw a bar, which is a line specified by the center coordinates and length.
 * @param x An x-coordinate of the center of the bar.
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
/**
 * Draw a bar, which is a line specified by the center coordinates and length.
 * @param pos A `Vector` position of the center of the bar.
 * @param length
 * @param thickness
 * @param rotate Angle of the bar.
 * @param centerPosRatio A value from 0 to 1 that defines where the center coordinates are on the line, default: 0.5.
 * @returns Information about objects that collided during drawing.
 */
declare function bar(
  pos: VectorLike,
  length: number,
  thickness: number,
  rotate: number,
  centerPosRatio?: number
): Collision;

/** Draw a line segment. */
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

/** Draw an arc or a circle. */
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

/** Options for drawing text and characters. */
declare type LetterOptions = {
  /**
   * @defaultValue transparent
   */
  color?: Color | number;
  /**
   * @defaultValue transparent
   */
  backgroundColor?: Color | number;
  /**
   * A value from 0 to 3 that defines the direction of character rotation.
   * @defaultValue 0
   */
  rotation?: number;
  /** Mirroring options */
  mirror?: { x?: 1 | -1; y?: 1 | -1 };
  /** Scaling options */
  scale?: { x?: number; y?: number };
  /** Use small 3x3 font if true */
  isSmallText?: boolean;
  /**
   * Edge color for letters
   * @defaultValue transparent
   */
  edgeColor?: Color | number;
};

/** Draw text using the built-in font. */
declare function text(
  str: string,
  x: number,
  y: number,
  options?: LetterOptions
): Collision;
/** Draw text using the built-in font. */
declare function text(
  str: string,
  pos: VectorLike,
  options?: LetterOptions
): Collision;

/** Draw a character using patterns defined in `characters`. */
declare function char(
  str: string,
  x: number,
  y: number,
  options?: LetterOptions
): Collision;
/** Draw a character using patterns defined in `characters`. */
declare function char(
  str: string,
  pos: VectorLike,
  options?: LetterOptions
): Collision;

/**
 * Add particles.
 * @param x X coordinate
 * @param y Y coordinate
 * @param optionsOrCount Options object or count of particles
 * @param speed Speed of particles
 * @param angle Angle of particles spreading
 * @param angleWidth The range of angles over which particles diffuse. If omitted, it spreads in a circular shape
 */
declare function particle(
  x: number,
  y: number,
  optionsOrCount?:
    | number
    | {
        count?: number;
        speed?: number;
        angle?: number;
        angleWidth?: number;
        edgeColor?: Color | number;
      },
  speed?: number,
  angle?: number,
  angleWidth?: number
): void;
/**
 * Add particles.
 * @param pos Position vector
 * @param optionsOrCount Options object or count of particles
 * @param speed Speed of particles
 * @param angle Angle of particles spreading
 * @param angleWidth The range of angles over which particles diffuse. If omitted, it spreads in a circular shape
 */
declare function particle(
  pos: VectorLike,
  optionsOrCount?:
    | number
    | {
        count?: number;
        speed?: number;
        angle?: number;
        angleWidth?: number;
        edgeColor?: Color | number;
      },
  speed?: number,
  angle?: number,
  angleWidth?: number
): void;

/** Create a new Vector instance. */
declare function vec(x?: number | VectorLike, y?: number): Vector;

/** Return a random floating-point number. */
declare function rnd(lowOrHigh?: number, high?: number): number;
/** Return a random integer. */
declare function rndi(lowOrHigh?: number, high?: number): number;
/** Return a random floating-point number with a random sign (+/-). */
declare function rnds(lowOrHigh?: number, high?: number): number;

/** Represents the state of the primary input (mouse, touch, or keyboard spacebar/enter/z/x). */
declare type Input = {
  /** Current position of the input pointer. */
  pos: Vector;
  /** True if the input is currently pressed down. */
  isPressed: boolean;
  /** True only on the frame the input was pressed down. */
  isJustPressed: boolean;
  /** True only on the frame the input was released. */
  isJustReleased: boolean;
};
/** Global Input object containing the current input state. */
declare let input: Input;

/** Mathematical constant PI (approx. 3.14159). */
declare const PI: number;
/** Returns the absolute value of a number. */
declare function abs(v: number): number;
/** Returns the sine of a number (angle in radians). */
declare function sin(v: number): number;
/** Returns the cosine of a number (angle in radians). */
declare function cos(v: number): number;
/** Returns the angle in radians between the positive x-axis and the point (x, y). */
declare function atan2(y: number, x: number): number;
/** Returns the base to the exponent power. */
declare function pow(b: number, e: number): number;
/** Returns the square root of a number. */
declare function sqrt(v: number): number;
/** Returns the largest integer less than or equal to a number. */
declare function floor(v: number): number;
/** Returns the value of a number rounded to the nearest integer. */
declare function round(v: number): number;
/** Returns the smallest integer greater than or equal to a number. */
declare function ceil(v: number): number;
/** Returns the smaller of two numbers. */
declare function min(a: number, b: number): number;
/** Returns the larger of two numbers. */
declare function max(a: number, b: number): number;
/** Constrains a value within a specified range. */
declare function clamp(v: number, low?: number, high?: number): number;
/** Wraps a value around within a specified range. */
declare function wrap(v: number, low: number, high: number): number;
/** Returns an array containing numbers from 0 up to (but not including) the specified value. */
declare function range(v: number): number[];
/** Calls a function a specified number of times and returns an array of the results. */
declare function times<T>(count: number, func: (index: number) => T): T[];
/** Removes elements from an array based on a predicate function and returns the removed elements. */
declare function remove<T>(
  array: T[],
  func: (v: T, index?: number) => any
): T[];
/**
 * Return a character whose character code is the character code of the first argument **char** plus the value of the second argument **offset**.
 * It is mainly used to animate a character with the `char()`.
 * @param char Base character.
 * @param offset Offset value.
 * @returns Character with the calculated character code.
 */
declare function addWithCharCode(char: string, offset: number): string;

/** Represents a 2D vector with x and y components and provides methods for vector operations. */
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

/** An interface representing an object with x and y numeric properties, compatible with Vector. */
declare interface VectorLike {
  x: number;
  y: number;
}

/** Available sound effect types for `play()`. */
declare type SoundEffectType =
  | "coin"
  | "laser"
  | "explosion"
  | "powerUp"
  | "hit"
  | "jump"
  | "select"
  | "lucky"
  | "random"
  | "click"
  | "synth"
  | "tone";
/** Play a sound effect. */
declare function play(
  type: SoundEffectType,
  options?: {
    seed?: number;
    numberOfSounds?: number;
    volume?: number;
    pitch?: number;
    freq?: number;
    note?: string;
  }
): void;

/** Internal initialization function (usually not called directly by the user). */
declare function init(settings: {
  update: () => void;
  title?: string;
  description?: string;
  characters?: string[];
  options?: Options;
});
