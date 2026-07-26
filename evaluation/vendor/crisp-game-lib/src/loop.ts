import * as view from "./view";
import * as letter from "./letter";
import * as input from "./input";
import * as audio from "./audio";

let _init: () => void;
let _update: () => void;
const targetFps = 68;
const deltaTime = 1000 / targetFps;
let nextFrameTime = 0;
let textCacheEnableTicks = 10;
let loopFrameRequestId: number | undefined;
let isCapturing;
let executionMode: "auto" | "manual" = "auto";
let manualPressed = false;

export type ManualInputState = {
  pressed: boolean;
  pos?: { x: number; y: number };
};

export async function init(
  __init: () => void,
  __update: () => void,
  _isCapturing: boolean,
  _executionMode: "auto" | "manual" = "auto"
) {
  _init = __init;
  _update = __update;
  isCapturing = _isCapturing;
  executionMode = _executionMode;
  manualPressed = false;
  await _init();
  if (executionMode === "auto") {
    update();
  }
}

function update() {
  loopFrameRequestId = requestAnimationFrame(update);
  const now = window.performance.now();
  if (now < nextFrameTime - targetFps / 12) {
    return;
  }
  nextFrameTime += deltaTime;
  if (nextFrameTime < now || nextFrameTime > now + deltaTime * 2) {
    nextFrameTime = now + deltaTime;
  }
  runFrame();
}

function runFrame(manualInput?: ManualInputState) {
  audio.update();
  if (manualInput == null) {
    input.update();
  } else {
    const isJustPressed = !manualPressed && manualInput.pressed;
    const isJustReleased = manualPressed && !manualInput.pressed;
    input.set({
      pos: manualInput.pos ?? input.pos,
      isPressed: manualInput.pressed,
      isJustPressed,
      isJustReleased,
    });
    manualPressed = manualInput.pressed;
    if (isJustPressed) {
      audio.resume();
    }
  }
  _update();
  if (isCapturing) {
    view.capture();
  }
  textCacheEnableTicks--;
  if (textCacheEnableTicks === 0) {
    letter.enableCache();
  }
}

export function step(manualInput: ManualInputState) {
  if (executionMode !== "manual") {
    throw new Error("loop.step() is only available in manual execution mode.");
  }
  runFrame(manualInput);
}

export function resetManualInput(pressed = false) {
  if (executionMode !== "manual") {
    return;
  }
  manualPressed = pressed;
  input.set({
    pos: input.pos,
    isPressed: pressed,
    isJustPressed: false,
    isJustReleased: false,
  });
}

export function stop() {
  if (loopFrameRequestId) {
    cancelAnimationFrame(loopFrameRequestId);
    loopFrameRequestId = undefined;
  }
  executionMode = "auto";
  manualPressed = false;
}
