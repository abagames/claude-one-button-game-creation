#!/usr/bin/env node
// Deterministic, taste-blind interaction recorder for crisp-game-lib games.
//
// Usage:
//   node archive/retired-batch-selection/scripts/observe_game.mjs <index.html-or-url> \
//     --actions "wait:60,tap,wait:30,hold:45,wait:90" --out <directory>
//
// Actions are interpreted at 60 frames/second:
//   wait:N  do not press for N frames
//   tap     press and release at the canvas center
//   hold:N  hold for N frames, then release
//
// The recorder reports only observable state, screenshots, and runtime errors.
// It deliberately does not assign quality, novelty, or fun judgments.

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const FRAME_MS = 1000 / 60;

function failUsage(message) {
  if (message) console.error(`observe-game: ${message}`);
  console.error(
    "usage: node archive/retired-batch-selection/scripts/observe_game.mjs <index.html-or-url> " +
      '--actions "wait:60,tap,hold:45" --out <directory>'
  );
  process.exit(2);
}

function parseArgs(argv) {
  const result = { target: null, actions: null, out: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--actions") result.actions = argv[++i];
    else if (arg === "--out") result.out = argv[++i];
    else if (!result.target) result.target = arg;
    else failUsage(`unexpected argument '${arg}'`);
  }
  if (!result.target || !result.actions || !result.out) failUsage();
  return result;
}

function parseActions(source) {
  return source.split(",").map((raw, index) => {
    const token = raw.trim();
    if (token === "tap") return { type: "tap", frames: 1 };
    const match = /^(wait|hold):(\d+)$/.exec(token);
    if (!match) failUsage(`invalid action ${index + 1}: '${token}'`);
    const frames = Number(match[2]);
    if (!Number.isSafeInteger(frames) || frames < 1 || frames > 3600) {
      failUsage(`action ${index + 1} frame count must be 1..3600`);
    }
    return { type: match[1], frames };
  });
}

function loadChromium() {
  const bases = [
    path.join(process.cwd(), "package.json"),
    new URL(import.meta.url).pathname,
  ];
  for (const base of bases) {
    try {
      return createRequire(base)("playwright").chromium;
    } catch {
      // Try the next resolution base.
    }
  }
  throw new Error("cannot resolve playwright from the current project");
}

async function sleepFrames(frames) {
  await new Promise((resolve) => setTimeout(resolve, frames * FRAME_MS));
}

async function readPublicState(page) {
  return page.evaluate(() => {
    const safeRead = (expression) => {
      try {
        // Indirect eval runs against the page's global environment and can see
        // crisp-game-lib's public globals even when they are lexical bindings.
        const value = (0, eval)(expression);
        return typeof value === "number" && Number.isFinite(value)
          ? value
          : null;
      } catch {
        return null;
      }
    };
    const canvas = document.querySelector("canvas");
    return {
      score: safeRead("score"),
      ticks: safeRead("ticks"),
      canvas: canvas
        ? { width: canvas.width, height: canvas.height }
        : null,
      bodyText: document.body?.innerText?.trim().slice(0, 500) || "",
    };
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const actions = parseActions(args.actions);
  const targetUrl = /^[a-z]+:\/\//i.test(args.target)
    ? args.target
    : pathToFileURL(path.resolve(args.target)).href;
  const outDir = path.resolve(args.out);
  await fs.mkdir(outDir, { recursive: true });

  const chromium = loadChromium();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const errors = [];
  let phase = "load";
  const recordError = (kind, value) => {
    errors.push({ phase, kind, text: String(value) });
  };
  page.on("pageerror", (error) => recordError("pageerror", error.message));
  page.on("console", (message) => {
    if (message.type() === "error") recordError("console.error", message.text());
  });
  page.on("crash", () => recordError("crash", "page crashed"));

  const steps = [];
  try {
    await page.goto(targetUrl, { waitUntil: "load", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 10000 });
    await sleepFrames(30);

    const canvas = page.locator("canvas");
    await canvas.screenshot({ path: path.join(outDir, "00-loaded.png") });
    steps.push({ index: 0, action: "loaded", state: await readPublicState(page) });

    for (let i = 0; i < actions.length; i += 1) {
      const action = actions[i];
      phase = `action-${i + 1}-${action.type}`;
      const before = await readPublicState(page);
      if (action.type === "wait") {
        await sleepFrames(action.frames);
      } else if (action.type === "tap") {
        await canvas.click({ position: { x: 50, y: 50 }, delay: FRAME_MS });
        await sleepFrames(2);
      } else {
        const box = await canvas.boundingBox();
        if (!box) throw new Error("canvas has no bounding box");
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await sleepFrames(action.frames);
        await page.mouse.up();
        await sleepFrames(2);
      }
      const after = await readPublicState(page);
      const screenshot = `${String(i + 1).padStart(2, "0")}-${action.type}.png`;
      await canvas.screenshot({ path: path.join(outDir, screenshot) });
      steps.push({
        index: i + 1,
        action: action.type,
        frames: action.frames,
        before,
        after,
        screenshot,
      });
    }
  } catch (error) {
    recordError("harness", error.message);
  } finally {
    await browser.close();
  }

  const report = {
    schemaVersion: 1,
    target: targetUrl,
    actions,
    steps,
    errors,
    generatedAt: new Date().toISOString(),
  };
  const reportPath = path.join(outDir, "observation.json");
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(reportPath);
  if (errors.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`observe-game: ${error.message}`);
  process.exit(2);
});
