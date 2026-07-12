#!/usr/bin/env node
/**
 * Pooled validation for the informational Stage-2 ranking.
 *
 * Primary metric: within-batch pairwise concordance. A correctly ordered
 * pair scores 1, an inversion 0, and a predicted tie 0.5. Eligible batches
 * must be post-fix and prediction-hidden. Uncertainty uses a deterministic
 * two-stage bootstrap: batches, then pair outcomes within each batch.
 *
 * Usage: node scripts/evaluate_prediction_utility.js
 *        [--input state/prediction-validation.json]
 *        [--output-dir tmp/eval]
 *        [--bootstrap 20000]
 */

const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);

function option(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
}

const INPUT = path.resolve(
  option("--input", "state/prediction-validation.json")
);
const OUTPUT_DIR = path.resolve(option("--output-dir", "tmp/eval"));
const BOOTSTRAP_SAMPLES = Number(option("--bootstrap", 20000));
if (!Number.isInteger(BOOTSTRAP_SAMPLES) || BOOTSTRAP_SAMPLES < 1) {
  console.error("--bootstrap must be a positive integer");
  process.exit(1);
}

function makeRandom(seed = 0x9e3779b9) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentile(sorted, probability) {
  const index = (sorted.length - 1) * probability;
  const lower = Math.floor(index);
  const fraction = index - lower;
  return sorted[lower] + (sorted[Math.min(lower + 1, sorted.length - 1)] - sorted[lower]) * fraction;
}

function expectedTopKOverlap(predicted, humanOrder, k) {
  const humanTopK = new Set(humanOrder.slice(0, k));
  const groups = new Map();
  for (const [slug, rank] of Object.entries(predicted)) {
    if (!groups.has(rank)) groups.set(rank, []);
    groups.get(rank).push(slug);
  }
  let slots = k;
  let expected = 0;
  for (const rank of [...groups.keys()].sort((a, b) => a - b)) {
    if (slots === 0) break;
    const group = groups.get(rank);
    const hits = group.filter((slug) => humanTopK.has(slug)).length;
    const selected = Math.min(slots, group.length);
    expected += hits * (selected / group.length);
    slots -= selected;
  }
  return expected;
}

function analyzeBatch(batch) {
  const humanRank = Object.fromEntries(
    batch.humanOrder.map((slug, index) => [slug, index + 1])
  );
  const predicted = batch.predictionRanks;
  const predictedGames = Object.keys(predicted);
  const missingPrediction = batch.humanOrder.filter(
    (slug) => predicted[slug] === undefined
  );
  const missingHuman = predictedGames.filter(
    (slug) => humanRank[slug] === undefined
  );
  if (missingPrediction.length || missingHuman.length) {
    throw new Error(
      `batch ${batch.batch} ranking mismatch; missing prediction: ${
        missingPrediction.join(", ") || "none"
      }; missing human: ${missingHuman.join(", ") || "none"}`
    );
  }

  const pairs = [];
  for (let i = 0; i < batch.humanOrder.length; i += 1) {
    for (let j = i + 1; j < batch.humanOrder.length; j += 1) {
      const a = batch.humanOrder[i];
      const b = batch.humanOrder[j];
      const predictionDelta = predicted[a] - predicted[b];
      pairs.push(predictionDelta === 0 ? 0.5 : predictionDelta < 0 ? 1 : 0);
    }
  }

  const predictedTopRank = Math.min(...predictedGames.map((slug) => predicted[slug]));
  const predictedTop1 = predictedGames.filter(
    (slug) => predicted[slug] === predictedTopRank
  );
  const humanTop3 = new Set(batch.humanOrder.slice(0, 3));
  return {
    batch: batch.batch,
    gameCount: batch.humanOrder.length,
    pairCount: pairs.length,
    concordance: mean(pairs),
    pairs,
    judgeCount: batch.judgeCount,
    predictedTop1,
    top1ExactCredit: predictedTop1.includes(batch.humanOrder[0])
      ? 1 / predictedTop1.length
      : 0,
    top1InHumanTop3Credit:
      predictedTop1.filter((slug) => humanTop3.has(slug)).length /
      predictedTop1.length,
    top3ExpectedOverlap: expectedTopKOverlap(
      predicted,
      batch.humanOrder,
      3
    ),
  };
}

function bootstrapInterval(batches, samples = BOOTSTRAP_SAMPLES) {
  const random = makeRandom();
  const estimates = [];
  for (let sample = 0; sample < samples; sample += 1) {
    const batchMeans = [];
    for (let i = 0; i < batches.length; i += 1) {
      const selected = batches[Math.floor(random() * batches.length)];
      const resampledPairs = [];
      for (let p = 0; p < selected.pairs.length; p += 1) {
        resampledPairs.push(
          selected.pairs[Math.floor(random() * selected.pairs.length)]
        );
      }
      batchMeans.push(mean(resampledPairs));
    }
    estimates.push(mean(batchMeans));
  }
  estimates.sort((a, b) => a - b);
  return [percentile(estimates, 0.025), percentile(estimates, 0.975)];
}

function rounded(value) {
  return Number(value.toFixed(3));
}

function evaluate(data) {
  const eligible = data.batches.filter(
    (batch) => batch.postFix === true && batch.predictionHidden === true
  );
  if (eligible.length === 0) {
    throw new Error("no clean post-fix, prediction-hidden batches");
  }
  const batches = eligible.map(analyzeBatch);
  const pooledConcordance = mean(batches.map((batch) => batch.concordance));
  const interval = bootstrapInterval(batches);
  const minimumCleanBatches = data.checkpoint.minimumCleanBatches;
  return {
    metric: {
      name: "macro mean within-batch pairwise concordance",
      tieCredit: 0.5,
      pooledConcordance: rounded(pooledConcordance),
      bootstrap95: interval.map(rounded),
      bootstrapSamples: BOOTSTRAP_SAMPLES,
      uncertainty: "two-stage batch then within-batch pair bootstrap",
    },
    checkpoint: {
      minimumCleanBatches,
      cleanBatchCount: batches.length,
      ready: batches.length >= minimumCleanBatches,
      remaining: Math.max(0, minimumCleanBatches - batches.length),
    },
    judgeCost: {
      judgeAssignments: batches.reduce(
        (sum, batch) => sum + (batch.judgeCount || 0),
        0
      ),
      note: "Compare utility with elapsed judge time at the checkpoint when available.",
    },
    supplementary: {
      top1ExactCredit: rounded(batches.reduce(
        (sum, batch) => sum + batch.top1ExactCredit,
        0
      )),
      top1InHumanTop3Credit: rounded(batches.reduce(
        (sum, batch) => sum + batch.top1InHumanTop3Credit,
        0
      )),
      top3ExpectedOverlapTotal: rounded(batches.reduce(
        (sum, batch) => sum + batch.top3ExpectedOverlap,
        0
      )),
    },
    batches: batches.map(({ pairs, ...batch }) => ({
      ...batch,
      concordance: rounded(batch.concordance),
    })),
  };
}

function toMarkdown(result) {
  const [low, high] = result.metric.bootstrap95;
  const lines = [
    "# Prediction utility checkpoint",
    "",
    `Clean batches: ${result.checkpoint.cleanBatchCount}/${result.checkpoint.minimumCleanBatches} (${result.checkpoint.ready ? "READY" : "NOT READY"})`,
    "",
    `Primary pooled concordance: **${result.metric.pooledConcordance}** (two-stage bootstrap 95% interval ${low}–${high}).`,
    "Predicted ties receive 0.5 credit. Batches have equal weight.",
    "",
    "Boundary ties in supplementary top-k metrics use expected credit under random tie-breaking.",
    "",
    "| batch | games | pairs | concordance | judges | top-1 exact credit | top-1 in human top-3 credit | expected top-3 overlap |",
    "| --: | --: | --: | --: | --: | :-- | :-- | --: |",
  ];
  for (const batch of result.batches) {
    lines.push(
      `| ${batch.batch} | ${batch.gameCount} | ${batch.pairCount} | ${batch.concordance} | ${batch.judgeCount ?? "-"} | ${rounded(batch.top1ExactCredit)} | ${rounded(batch.top1InHumanTop3Credit)} | ${rounded(batch.top3ExpectedOverlap)} |`
    );
  }
  lines.push(
    "",
    `Supplementary expected-credit totals: top-1 exact ${result.supplementary.top1ExactCredit}/${result.checkpoint.cleanBatchCount}; top-1 in human top-3 ${result.supplementary.top1InHumanTop3Credit}/${result.checkpoint.cleanBatchCount}; top-3 overlap ${result.supplementary.top3ExpectedOverlapTotal}/${result.checkpoint.cleanBatchCount * 3}.`,
    `Judge assignments so far: ${result.judgeCost.judgeAssignments}.`,
    "",
    result.checkpoint.ready
      ? "Checkpoint is ready: compare this evidence and actual judge time; do not decide from a fixed concordance or single-batch threshold."
      : `Checkpoint is not ready; ${result.checkpoint.remaining} more clean batch(es) are required. The interval is provisional and must not trigger a retain/drop decision.`,
    ""
  );
  return lines.join("\n");
}

function main() {
  const data = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  const result = evaluate(data);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outputBase = path.join(OUTPUT_DIR, "prediction-utility");
  fs.writeFileSync(`${outputBase}.json`, `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(`${outputBase}.md`, toMarkdown(result));
  console.log(toMarkdown(result));
  console.log(`Wrote ${outputBase}.{json,md}`);
}

if (require.main === module) main();

module.exports = { analyzeBatch, evaluate, expectedTopKOverlap, toMarkdown };
