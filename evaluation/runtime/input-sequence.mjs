import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const schema = JSON.parse(
  fs.readFileSync(
    fileURLToPath(new URL("../schemas/input-sequence.v1.schema.json", import.meta.url)),
    "utf8"
  )
);
const validateSchema = new Ajv2020({ allErrors: true, strict: true }).compile(schema);

export function validateInputSequence(value) {
  const errors = [];
  if (!validateSchema(value)) {
    errors.push(...(validateSchema.errors ?? []).map((error) => `${error.instancePath} ${error.message}`));
  }
  let previous = -1;
  const seen = new Set();
  for (const transition of value?.transitions ?? []) {
    if (!Number.isInteger(value?.duration_ticks)) continue;
    if (transition.tick >= value.duration_ticks) {
      errors.push(`tick ${transition.tick} is outside duration`);
    }
    if (transition.tick <= previous) {
      errors.push("transition ticks must be strictly increasing");
    }
    if (seen.has(transition.tick)) errors.push(`duplicate tick ${transition.tick}`);
    previous = transition.tick;
    seen.add(transition.tick);
  }
  return errors;
}

export function assertValidInputSequence(value) {
  const errors = validateInputSequence(value);
  if (errors.length > 0) throw new Error(`Invalid input sequence: ${errors.join("; ")}`);
  return value;
}

export function expandPressedStates(sequence) {
  assertValidInputSequence(sequence);
  const states = [];
  let pressed = false;
  let transitionIndex = 0;
  for (let tick = 0; tick < sequence.duration_ticks; tick++) {
    const transition = sequence.transitions[transitionIndex];
    if (transition?.tick === tick) {
      pressed = transition.pressed;
      transitionIndex++;
    }
    states.push(pressed);
  }
  return states;
}

export function canonicalJson(value) {
  return JSON.stringify(sortValue(value));
}

export function hashCanonicalJson(value) {
  return crypto.createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value != null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortValue(value[key])])
    );
  }
  return value;
}
