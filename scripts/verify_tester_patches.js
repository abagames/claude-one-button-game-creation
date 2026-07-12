#!/usr/bin/env node
/** Behavioral guard for the project's vendored crisp-game-lib tester fork. */

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createCrispGameAdapter } = require("./tester/crisp_game_adapter.js");
const { GameSimulator } = require("./tester/one_button_game_tester.js");

const fixture = `
title = "tester-patch-guard";
description = "";
options = {};

function update() {
  if (ticks === 0) {
    const sample = rndi(1);
    const clamped = vec(-2, 12).clamp(0, 10, 0, 10);
    const wrapped = vec(-1, 11).wrap(0, 10, 0, 10);
    if (difficulty !== 1) throw new Error("difficulty must start at 1");
    if (sample !== 0) throw new Error("rndi(max) must sample from 0..max-1");
    if (clamped.x !== 0 || clamped.y !== 10) throw new Error("vec.clamp mismatch");
    if (wrapped.x !== 9 || wrapped.y !== 1) throw new Error("vec.wrap mismatch");
    addScore(123);
  }
}
`;

const fixturePath = path.join(
  os.tmpdir(),
  `crisp-tester-patch-guard-${process.pid}.js`
);

try {
  fs.writeFileSync(fixturePath, fixture);
  const simulator = new GameSimulator();
  const concept = createCrispGameAdapter(fixturePath);
  simulator.initGame(concept.init);
  simulator.updateInput(false);
  concept.update(simulator.input, simulator);

  if (concept.hasCrashed()) {
    throw new Error(concept.getCrashError() || "adapter fixture crashed");
  }
  if (concept.getScore() !== 123) {
    throw new Error(`adapter fixture score ${concept.getScore()} !== 123`);
  }
  console.log(
    "PASS tester local patches: rndi(max), vec.clamp/wrap, difficulty starts at 1"
  );
} catch (error) {
  console.error(`FAIL tester local patches: ${error.message}`);
  process.exitCode = 1;
} finally {
  try {
    fs.unlinkSync(fixturePath);
  } catch (_) {
    // Nothing to clean if fixture creation itself failed.
  }
}
