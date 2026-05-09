#!/usr/bin/env node
/**
 * Validate generated one-button game artifacts and run the GA balance gate.
 *
 * Exit codes:
 *   0 pass
 *   1 validation/test failure
 *   2 game runs, but GA ratio indicates improvement is needed
 */

const fs = require("fs");
const path = require("path");
const {
  GameSimulator,
  GameAnalyzer,
} = require("./one_button_game_tester.js");
const { createCrispGameAdapter } = require("./crisp_game_adapter.js");
const { setGlobalSeed } = require("./tester_random.js");

const PASS_RATIO = 1.5;
const SEED = 42;
const GA_CONFIG = {
  populationSize: 50,
  generations: 30,
  seed: SEED,
  timeRanges: [
    { minValue: 30, maxValue: 500 },
    { minValue: 100, maxValue: 1500 },
  ],
};

function usage() {
  console.error(
    [
      "Usage: node scripts/check_generated_game.js <tmp/games/slug|main.js> [--verbose] [--progress] [--no-ga]",
      "",
      "Options:",
      "  --verbose   Run ga_tester.js with --verbose for detailed GA telemetry",
      "  --progress  Forward GA progress logs to stderr",
      "  --no-ga     Run artifact/static checks only",
    ].join("\n")
  );
}

function parseArgs(argv) {
  const options = {
    verbose: false,
    progress: false,
    noGa: false,
    target: null,
  };

  for (const arg of argv) {
    if (arg === "--verbose" || arg === "-v") {
      options.verbose = true;
    } else if (arg === "--progress" || arg === "-p") {
      options.progress = true;
    } else if (arg === "--no-ga") {
      options.noGa = true;
    } else if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else if (!options.target) {
      options.target = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  if (!options.target) {
    throw new Error("Missing generated game directory or main.js path");
  }

  return options;
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function addCheck(checks, name, ok, details) {
  checks.push({ name, ok, details });
}

function countTopLevelFunctions(source) {
  const matches = source.match(/^function\s+([A-Za-z_$][\w$]*)\s*\(/gm) || [];
  return matches.map((line) => line.replace(/^function\s+/, "").replace(/\s*\(.*/, ""));
}

function getReadmeSection(readme, heading) {
  const start = readme.indexOf(heading);
  if (start < 0) return "";
  const rest = readme.slice(start + heading.length);
  const nextHeading = rest.search(/\n##\s+/);
  return nextHeading < 0 ? rest : rest.slice(0, nextHeading);
}

function hasStateTableDataRow(readme) {
  const section = getReadmeSection(readme, "## 1.5 State Model and Tradeoff");
  return section
    .split(/\r?\n/)
    .some((line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false;
      if (/^\|\s*:?-+:?\s*\|/.test(trimmed)) return false;
      if (/State Variable/i.test(trimmed)) return false;
      return trimmed.split("|").length >= 5 && /[A-Za-z0-9_`]/.test(trimmed);
    });
}

function validateArtifacts(gameDir, mainPath) {
  const checks = [];
  const readmePath = path.join(gameDir, "README.md");
  const indexPath = path.join(gameDir, "index.html");

  addCheck(checks, "README.md exists", fs.existsSync(readmePath), readmePath);
  addCheck(checks, "index.html exists", fs.existsSync(indexPath), indexPath);
  addCheck(checks, "main.js exists", fs.existsSync(mainPath), mainPath);

  if (!fs.existsSync(readmePath) || !fs.existsSync(indexPath) || !fs.existsSync(mainPath)) {
    return checks;
  }

  const readme = readText(readmePath);
  const index = readText(indexPath);
  const main = readText(mainPath);

  [
    "# ",
    "**Seeds**:",
    "## 1. Core Mechanics",
    "## 1.5 State Model and Tradeoff",
    "## 2. Object Specifications",
    "## 3. Design Principle Analysis",
    "## 4. Relationship with Seeds",
    "## 5. Basis for Novelty",
    "## 6. Similarity Check",
  ].forEach((needle) => {
    addCheck(checks, `README includes ${needle}`, readme.includes(needle), needle);
  });

  [
    "Idle weakness",
    "Hold-only weakness",
    "Mashing weakness",
    "Skilled play",
  ].forEach((needle) => {
    addCheck(
      checks,
      `README documents ${needle}`,
      new RegExp(`\\b${needle}\\b`, "i").test(readme),
      `Expected "${needle}" bullet under ## 1.5 State Model and Tradeoff`
    );
  });

  addCheck(
    checks,
    "README state model table has at least one data row",
    hasStateTableDataRow(readme),
    "Expected at least one state row under ## 1.5 State Model and Tradeoff"
  );

  addCheck(
    checks,
    "index.html pins crisp-game-lib@1.5.0",
    index.includes("crisp-game-lib@1.5.0/docs/bundle.js"),
    "Use the project-pinned crisp-game-lib CDN URL"
  );
  addCheck(
    checks,
    "index.html does not use crisp-game-lib@latest",
    !index.includes("crisp-game-lib@latest"),
    "Do not use moving CDN versions in generated games"
  );

  [
    ["title", /\btitle\s*=/],
    ["description", /\bdescription\s*=/],
    ["characters", /\bcharacters\s*=/],
    ["options", /\boptions\s*=/],
    ["update()", /\bfunction\s+update\s*\(/],
  ].forEach(([label, pattern]) => {
    addCheck(checks, `main.js defines ${label}`, pattern.test(main), label);
  });

  const topLevelFunctions = countTopLevelFunctions(main);
  addCheck(
    checks,
    "main.js keeps top-level helper functions out of tester path",
    topLevelFunctions.every((name) => name === "update"),
    topLevelFunctions.length ? topLevelFunctions.join(", ") : "none"
  );

  addCheck(
    checks,
    "main.js does not manually draw score text",
    !/\btext\s*\(\s*["'`]?\s*score/i.test(main),
    "crisp-game-lib displays score automatically"
  );

  return checks;
}

function runGa(mainPath, options) {
  try {
    const simulator = new GameSimulator();
    if (typeof simulator.setSeed === "function") {
      simulator.setSeed(SEED);
    }
    setGlobalSeed(SEED);
    const gameConcept = createCrispGameAdapter(mainPath);
    const gameName = path.basename(mainPath, ".js");
    const startedAt = Date.now();
    const progressCallback = options.progress
      ? ({ generation, generations, bestFitness, avgFitness, rangeIndex, totalRanges }) => {
          const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);
          console.error(
            `[GA] range ${rangeIndex + 1}/${totalRanges} gen ${generation + 1}/${generations}` +
              ` best=${bestFitness.toFixed(3)} avg=${avgFitness.toFixed(3)} elapsed=${elapsedSec}s`
          );
        }
      : null;

    return {
      ok: true,
      result: GameAnalyzer.testGame(simulator, gameConcept, gameName, {
        includeGA: true,
        gaConfig: GA_CONFIG,
        verbose: options.verbose,
        progressCallback,
      }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
    };
  }
}

function classifyDiagnostic(ratio) {
  if (ratio > PASS_RATIO) return "pass";
  if (ratio < 0.85) return "mono_dominant";
  if (ratio <= 1.15) return "tied";
  return "marginal";
}

function computeRatio(gaResult) {
  const gaScore = gaResult && gaResult.ga && Number(gaResult.ga.bestScore);
  const monotonousMax =
    gaResult &&
    gaResult.monotonous &&
    gaResult.monotonous.summary &&
    Number(gaResult.monotonous.summary.maxScore);

  if (!Number.isFinite(gaScore) || !Number.isFinite(monotonousMax)) {
    return { ratio: null, reason: "Missing ga.bestScore or monotonous.summary.maxScore" };
  }
  if (monotonousMax === 0) {
    if (gaScore > 0) {
      return {
        ratio: null,
        ratioLabel: "Infinity",
        passes: true,
        diagnostic: "pass",
        reason: "Monotonous max score is 0 and GA scored above 0",
      };
    }
    return {
      ratio: 0,
      ratioLabel: "0.000",
      passes: false,
      diagnostic: "tied",
      reason: "Both GA and monotonous max scores are 0",
    };
  }
  const ratio = gaScore / monotonousMax;
  return {
    ratio,
    ratioLabel: ratio.toFixed(3),
    passes: ratio > PASS_RATIO,
    diagnostic: classifyDiagnostic(ratio),
    reason: null,
  };
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    usage();
    console.error(`\n${error.message}`);
    process.exit(1);
  }

  const targetPath = path.resolve(options.target);
  const mainPath = path.basename(targetPath) === "main.js" ? targetPath : path.join(targetPath, "main.js");
  const gameDir = path.dirname(mainPath);
  const report = {
    gameDir,
    mainPath,
    passRatio: PASS_RATIO,
    status: "fail",
    checks: validateArtifacts(gameDir, mainPath),
    ga: null,
    ratio: null,
  };

  if (report.checks.some((check) => !check.ok)) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  if (options.noGa) {
    report.status = "pass";
    report.ga = { skipped: true };
    console.log(JSON.stringify(report, null, 2));
    process.exit(0);
  }

  const gaRun = runGa(mainPath, options);
  report.ga = gaRun;

  if (!gaRun.ok || (gaRun.result && gaRun.result.error)) {
    report.status = "fail";
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  const ratioInfo = computeRatio(gaRun.result);
  report.ratio = ratioInfo;

  if (ratioInfo.ratio === null && !ratioInfo.passes) {
    report.status = "fail";
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  report.status = ratioInfo.passes ? "pass" : "needs_improvement";
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.status === "pass" ? 0 : 2);
}

main();
