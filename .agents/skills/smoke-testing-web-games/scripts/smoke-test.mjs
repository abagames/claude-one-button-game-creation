#!/usr/bin/env node
// Browser smoke test for web games: opens a page headlessly, lets it run
// idle, then sends input bursts (taps, holds, Space, arrow keys), and fails on
// any console error, uncaught exception, page crash, or failed page load.
//
// Usage:
//   node smoke-test.mjs <index.html path or URL> [--idle <sec>] [--input <sec>]
//
// Exit codes: 0 = pass, 1 = errors detected (or page failed to load),
//             2 = harness problem (playwright missing, bad arguments).
//
// Playwright is resolved from the directory you run the script in, so the
// game project (not this skill) provides it:
//   npm i -D playwright && npx playwright install chromium

import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

function loadChromium() {
  const bases = [
    path.join(process.cwd(), "package.json"),
    new URL(import.meta.url).pathname,
  ];
  for (const base of bases) {
    try {
      return createRequire(base)("playwright").chromium;
    } catch {
      /* try next resolution base */
    }
  }
  console.error(
    "smoke-test: cannot resolve 'playwright' from the current directory.\n" +
      "Run inside a project with it installed: npm i -D playwright && npx playwright install chromium"
  );
  process.exit(2);
}

function parseArgs(argv) {
  const args = { idle: 3, input: 6, target: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--idle") args.idle = Number(argv[++i]);
    else if (a === "--input") args.input = Number(argv[++i]);
    else if (!args.target) args.target = a;
    else {
      console.error(`smoke-test: unexpected argument '${a}'`);
      process.exit(2);
    }
  }
  if (!args.target || Number.isNaN(args.idle) || Number.isNaN(args.input)) {
    console.error(
      "usage: node smoke-test.mjs <index.html path or URL> [--idle <sec>] [--input <sec>]"
    );
    process.exit(2);
  }
  return args;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const url = /^[a-z]+:\/\//.test(args.target)
    ? args.target
    : pathToFileURL(path.resolve(args.target)).href;

  const chromium = loadChromium();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });

  const errors = [];
  let phase = "load";
  const record = (kind, text) => {
    errors.push({ phase, kind, text });
    console.error(`[${phase}] ${kind}: ${text}`);
  };

  page.on("pageerror", (err) => record("pageerror", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") record("console.error", msg.text());
  });
  page.on("crash", () => record("crash", "page crashed"));

  try {
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
  } catch (err) {
    record("navigation", err.message);
    await browser.close();
    console.error("FAIL: page did not load");
    process.exit(1);
  }

  phase = "idle";
  await sleep(args.idle * 1000);

  phase = "input";
  const deadline = Date.now() + args.input * 1000;
  const rnd = (min, max) => min + Math.random() * (max - min);
  while (Date.now() < deadline) {
    // burst of quick taps at scattered positions
    for (let i = 0; i < 3 && Date.now() < deadline; i++) {
      await page.mouse.click(rnd(160, 640), rnd(120, 480), { delay: 30 });
      await sleep(120);
    }
    await page.keyboard.press("Space");
    // arrow keys: tap each, then a short held arrow (movement-driven games
    // keep their main input path untested by pointer+Space alone)
    for (const key of ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"]) {
      if (Date.now() >= deadline) break;
      await page.keyboard.press(key);
      await sleep(60);
    }
    if (Date.now() < deadline) {
      await page.keyboard.down("ArrowLeft");
      await sleep(250);
      await page.keyboard.up("ArrowLeft");
    }
    // hold-and-release
    await page.mouse.move(400, 300);
    await page.mouse.down();
    await sleep(400);
    await page.mouse.up();
    // intentional pause so timers/spawns advance between bursts
    await sleep(500);
  }

  // let any error thrown by the last inputs surface
  await sleep(500);
  await browser.close();

  if (errors.length > 0) {
    console.error(`FAIL: ${errors.length} error(s) detected`);
    process.exit(1);
  }
  console.log(
    `PASS: no console errors, uncaught exceptions, or crashes ` +
      `(idle ${args.idle}s, input ${args.input}s)`
  );
}

main().catch((err) => {
  console.error(`smoke-test: harness failure: ${err.message}`);
  process.exit(2);
});
