import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { assertValidInputSequence, hashCanonicalJson } from "./input-sequence.mjs";

const sourcePath = fileURLToPath(import.meta.url);

export function generateBaselinePolicy(options) {
  const { role, durationTicks } = options;
  const policyRole = role === "random" ? "seeded_random" : role;
  if (!Number.isInteger(durationTicks) || durationTicks < 1) {
    throw new Error("durationTicks must be a positive integer");
  }

  let transitions;
  let policySeed = null;
  let policyId;
  const notes = [];

  if (role === "idle") {
    transitions = [{ tick: 0, pressed: false }];
    policyId = "idle-v1";
  } else if (role === "hold") {
    transitions = [{ tick: 0, pressed: true }];
    policyId = "hold-v1";
  } else if (role === "periodic") {
    const periodTicks = options.periodTicks;
    const pressedTicks = options.pressedTicks;
    if (!Number.isInteger(periodTicks) || periodTicks < 2) {
      throw new Error("periodTicks must be an integer >= 2");
    }
    if (!Number.isInteger(pressedTicks) || pressedTicks < 1 || pressedTicks >= periodTicks) {
      throw new Error("pressedTicks must satisfy 1 <= pressedTicks < periodTicks");
    }
    transitions = [];
    for (let start = 0; start < durationTicks; start += periodTicks) {
      transitions.push({ tick: start, pressed: true });
      if (start + pressedTicks < durationTicks) {
        transitions.push({ tick: start + pressedTicks, pressed: false });
      }
    }
    policyId = `periodic-${periodTicks}-${pressedTicks}-v1`;
    notes.push(`period_ticks=${periodTicks}`, `pressed_ticks=${pressedTicks}`);
  } else if (role === "seeded_random" || role === "random") {
    const meanSegmentTicks = options.meanSegmentTicks;
    policySeed = options.policySeed;
    if (!Number.isInteger(meanSegmentTicks) || meanSegmentTicks < 2) {
      throw new Error("meanSegmentTicks must be an integer >= 2");
    }
    if (!Number.isInteger(policySeed) || policySeed < 0 || policySeed > 0xffffffff) {
      throw new Error("policySeed must be a uint32");
    }
    transitions = [{ tick: 0, pressed: false }];
    let pressed = false;
    const random = createXorshift32(policySeed);
    for (let tick = 1; tick < durationTicks; tick++) {
      if (random() % meanSegmentTicks === 0) {
        pressed = !pressed;
        transitions.push({ tick, pressed });
      }
    }
    policyId = `random-toggle-${meanSegmentTicks}-v1`;
    notes.push(`mean_segment_ticks=${meanSegmentTicks}`, "tick_0_pressed=false");
  } else {
    throw new Error(`Unsupported baseline role: ${role}`);
  }

  const inputSequence = assertValidInputSequence({
    schema_version: 1,
    duration_ticks: durationTicks,
    transitions,
  });
  const provenance = {
    schema_version: 0,
    policy_id: policyId,
    policy_role: policyRole,
    implementation: {
      name: "baseline-policy-generator",
      version: "1",
      source_ref: "runtime/baseline-policies.mjs",
      source_sha256: crypto.createHash("sha256").update(fs.readFileSync(sourcePath)).digest("hex"),
    },
    policy_seed: policySeed,
    input_sequence_sha256: hashCanonicalJson(inputSequence),
    uses_public_observation: false,
    uses_private_information: false,
    ...(notes.length === 0 ? {} : { notes }),
  };
  return { inputSequence, provenance };
}

function createXorshift32(seed) {
  let state = (seed >>> 0) || 0x6d2b79f5;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
}
