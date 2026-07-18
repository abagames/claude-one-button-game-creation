#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const gamesDir = path.resolve(projectRoot, process.argv[2] || "tmp/games");
const smokeRunner = path.join(
  projectRoot,
  ".agents/skills/smoke-testing-web-games/scripts/smoke-test.mjs"
);
const requiredFiles = ["index.html", "main.js", "README.md"];

function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

if (process.argv.length > 3) {
  console.error("Usage: node scripts/check_batch.js [games-directory]");
  process.exit(2);
}

if (!fs.existsSync(gamesDir) || !fs.statSync(gamesDir).isDirectory()) {
  console.error(`Batch directory does not exist: ${gamesDir}`);
  process.exit(1);
}

const gameNames = fs
  .readdirSync(gamesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let failed = false;

if (gameNames.length !== 10) {
  console.error(
    `Expected exactly 10 game directories in ${gamesDir}, found ${gameNames.length}.`
  );
  failed = true;
}

if (!fs.existsSync(smokeRunner)) {
  console.error(`Smoke-test runner does not exist: ${smokeRunner}`);
  console.error("Run 'npm run skills:install' from the project root.");
  process.exit(1);
}

for (const gameName of gameNames) {
  const gameDir = path.join(gamesDir, gameName);
  const missingFiles = requiredFiles.filter(
    (fileName) => !isFile(path.join(gameDir, fileName))
  );

  if (missingFiles.length > 0) {
    console.error(
      `FAIL: ${gameName} is missing ${missingFiles.join(", ")}.`
    );
    failed = true;
    continue;
  }

  console.log(`Smoke testing ${gameName}...`);
  const result = spawnSync(
    process.execPath,
    [smokeRunner, path.join(gameDir, "index.html")],
    { cwd: projectRoot, stdio: "inherit" }
  );

  if (result.error) {
    console.error(`FAIL: ${gameName}: ${result.error.message}`);
    failed = true;
  } else if (result.status !== 0) {
    console.error(`FAIL: ${gameName} (exit ${result.status})`);
    failed = true;
  }
}

if (failed) {
  console.error("Batch verification failed.");
  process.exit(1);
}

console.log("Batch verification passed: 10 games and 10 smoke tests succeeded.");
