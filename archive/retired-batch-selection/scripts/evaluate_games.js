#!/usr/bin/env node
/**
 * Stage-1 batch evaluator for the generate-many / select-few workflow.
 *
 * Runs the monotonous-input + GA testers on every game under tmp/games/,
 * computes skill-vs-monotony metrics, and writes:
 *   - tmp/eval/stage1.json  (raw facts for the LLM ranking pass)
 *   - tmp/eval/stage1.md    (human-readable summary table)
 *
 * Outputs raw facts and mechanical flags only. Fun/novelty ranking is
 * Stage 2 (LLM pairwise comparison) and final judgment is Stage 3 (human play).
 * Tester errors are flagged for manual review, never treated as rejection:
 * novel mechanics are the most likely to break the simulator.
 *
 * Usage: node archive/retired-batch-selection/scripts/evaluate_games.js
 *        [--games-dir tmp/games] [--no-ga]
 *        [--ga-timeout-ms 600000]
 */

const { spawnSync } = require("node:child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const gamesDirArg = args.indexOf("--games-dir");
const GAMES_DIR = path.resolve(
  gamesDirArg >= 0 ? args[gamesDirArg + 1] : "tmp/games"
);
const USE_GA = !args.includes("--no-ga");
const gaTimeoutArg = args.indexOf("--ga-timeout-ms");
const TESTER_TIMEOUT_MS = 10 * 60 * 1000;
const GA_TIMEOUT_MS = Number(
  gaTimeoutArg >= 0 ? args[gaTimeoutArg + 1] : TESTER_TIMEOUT_MS
);
if (!Number.isFinite(GA_TIMEOUT_MS) || GA_TIMEOUT_MS <= 0) {
  console.error("--ga-timeout-ms must be a positive number");
  process.exit(1);
}
const EVAL_DIR = path.resolve("tmp/eval");
const GA_TESTER = path.resolve(__dirname, "tester", "ga_tester.js");
const MONO_TESTER = path.resolve(
  __dirname,
  "tester",
  "one_button_game_tester.js"
);

function runTester(tester, mainJs, timeout) {
  // Use the current runtime directly and preserve child diagnostics. Some
  // managed sandboxes discard stdout from Node grandchildren; the workflow
  // routes that environment through an approved out-of-sandbox run.
  const child = spawnSync(process.execPath, [tester, mainJs], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout,
  });
  if (child.error) throw child.error;
  if (child.status !== 0) {
    throw new Error(
      `tester exited ${child.status}: ${(child.stderr || "").trim()}`
    );
  }
  const stdout = child.stdout || "";
  if (!stdout.trim()) {
    throw new Error(
      `tester produced empty stdout${
        child.stderr ? `: ${child.stderr.trim()}` : ""
      }`
    );
  }
  return JSON.parse(stdout);
}

function testGame(
  slug,
  mainJs,
  { useGa = USE_GA, gaTimeoutMs = GA_TIMEOUT_MS } = {}
) {
  try {
    return {
      slug,
      ...runTester(
        useGa ? GA_TESTER : MONO_TESTER,
        mainJs,
        useGa ? gaTimeoutMs : TESTER_TIMEOUT_MS
      ),
    };
  } catch (e) {
    if (useGa && e.code === "ETIMEDOUT") {
      process.stderr.write(
        `GA timed out for ${slug}; falling back to monotonous probes ...\n`
      );
      try {
        return {
          slug,
          ...runTester(MONO_TESTER, mainJs, TESTER_TIMEOUT_MS),
          instrument: {
            gaStatus: "timed_out",
            fallback: "monotonous",
            gaTimeoutMs,
          },
        };
      } catch (fallbackError) {
        return {
          slug,
          error: `GA timed out; monotonous fallback failed: ${fallbackError.message}`.slice(
            0,
            500
          ),
        };
      }
    }
    return { slug, error: e.message.slice(0, 500) };
  }
}

function analyze(result) {
  if (result.error || !result.monotonous) {
    return {
      slug: result.slug,
      verdict: "needs_manual_review",
      flags: ["tester_error"],
      error: result.error || "no monotonous results",
    };
  }

  const p = result.monotonous.patterns;
  const monoBest = Math.max(
    p.NoInput?.score ?? 0,
    p.HoldOnly?.score ?? 0,
    p.SpamPress?.score ?? 0
  );
  const gaBest = result.ga ? result.ga.bestScore : null;
  // Best known play is the max over all probes; GA may fail to rediscover
  // a monotonous optimum, so never use gaBest alone.
  const explBest = Math.max(monoBest, gaBest ?? 0);
  const skillGain = explBest / Math.max(1, monoBest);

  const flags = [];
  if (result.instrument?.gaStatus === "timed_out")
    flags.push("ga_timeout_fallback");
  if ((p.NoInput?.score ?? 0) > 0) flags.push("idle_scoring");
  if ((p.HoldOnly?.score ?? 0) > 0) flags.push("hold_scoring");
  if ((p.SpamPress?.score ?? 0) > 0) flags.push("spam_scoring");
  if (p.NoInput?.error || p.HoldOnly?.error || p.SpamPress?.error)
    flags.push("pattern_error");

  let verdict;
  if (gaBest === null) {
    verdict = "monotonous_only"; // GA not run; no skill comparison available
  } else if (explBest === 0) {
    // Nothing can score: either unscorable design or simulator infidelity.
    verdict = "needs_manual_review";
    flags.push("no_scoring_path");
  } else if (gaBest <= monoBest) {
    verdict = "mono_dominant";
  } else if (skillGain >= 2) {
    verdict = "skill_rewarding";
  } else {
    verdict = "weak_skill_gain";
  }

  return {
    slug: result.slug,
    verdict,
    flags,
    monotonous: p,
    monoBestScore: monoBest,
    gaBestScore: gaBest,
    gaBestSurvivalTime: result.ga?.bestSurvivalTime ?? null,
    skillGain: Number(skillGain.toFixed(2)),
    ...(result.instrument ? { instrument: result.instrument } : {}),
  };
}

function toMarkdown(rows) {
  const lines = [
    "# Stage-1 Evaluation Summary",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Verdicts are detectors, not scores. `mono_dominant` and flags point at",
    "design-level or tuning-level problems; `needs_manual_review` means the",
    "simulator could not measure the game and a human/LLM must look at it.",
    "",
    "| game | verdict | mono best | GA best | skill gain | flags |",
    "| :-- | :-- | --: | --: | --: | :-- |",
  ];
  for (const r of rows) {
    lines.push(
      `| ${r.slug} | ${r.verdict} | ${r.monoBestScore ?? "-"} | ${
        r.gaBestScore ?? "-"
      } | ${r.skillGain ?? "-"} | ${r.flags.join(", ") || "-"} |`
    );
  }
  return lines.join("\n") + "\n";
}

function main() {
  const slugs = fs
    .readdirSync(GAMES_DIR)
    .filter((d) => fs.existsSync(path.join(GAMES_DIR, d, "main.js")));

  if (slugs.length === 0) {
    console.error(`No games with main.js found under ${GAMES_DIR}`);
    process.exit(1);
  }

  const results = [];
  for (const slug of slugs) {
    process.stderr.write(`Testing ${slug} ...\n`);
    const raw = testGame(slug, path.join(GAMES_DIR, slug, "main.js"));
    results.push(analyze(raw));
  }

  // Order: measurable games by skill gain desc, then manual-review cases last
  results.sort((a, b) => {
    const aErr = a.verdict === "needs_manual_review" ? 1 : 0;
    const bErr = b.verdict === "needs_manual_review" ? 1 : 0;
    if (aErr !== bErr) return aErr - bErr;
    return (b.skillGain ?? 0) - (a.skillGain ?? 0);
  });

  fs.mkdirSync(EVAL_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(EVAL_DIR, "stage1.json"),
    JSON.stringify(results, null, 2)
  );
  fs.writeFileSync(path.join(EVAL_DIR, "stage1.md"), toMarkdown(results));

  console.log(toMarkdown(results));
  console.log(`Wrote ${path.join(EVAL_DIR, "stage1.json")} and stage1.md`);
}

if (require.main === module) main();

module.exports = { analyze, runTester, testGame, toMarkdown };
