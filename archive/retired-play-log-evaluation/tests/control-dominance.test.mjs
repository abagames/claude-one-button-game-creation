import assert from "node:assert/strict";
import test from "node:test";
import {
  computeControlDominance,
  episodeRate,
} from "../scripts/measure-control-dominance.mjs";

function result(gameplay_seed, final_score, executed_ticks, kind = "game_over") {
  return { gameplay_seed, final_score, executed_ticks, termination: { kind } };
}

function control(condition_id, policy_role, gameplay_seed, final_score, executed_ticks, kind = "game_over") {
  return {
    condition_id,
    policy_role,
    request: { gameplay_seed },
    result: result(gameplay_seed, final_score, executed_ticks, kind),
  };
}

test("the ratio is per-tick, so it does not move when both sides survive proportionally longer", () => {
  // The same game, twice, with the only difference that everything survives twice as long and scores twice as
  // much. A per-episode ratio would be identical here too, but a per-episode ratio also moves when only the
  // control's survival changes; the second assertion is the one that distinguishes them.
  const short = computeControlDominance({
    seeds: [1],
    policyResults: [result(1, 100, 400)],
    controlsBySet: { monotonic: [control("hold-v1", "hold", 1, 50, 400)] },
  });
  const long = computeControlDominance({
    seeds: [1],
    policyResults: [result(1, 200, 800)],
    controlsBySet: { monotonic: [control("hold-v1", "hold", 1, 100, 800)] },
  });
  assert.equal(short.perSeed[0].sets.monotonic.ratio, 0.5);
  assert.equal(long.perSeed[0].sets.monotonic.ratio, 0.5);

  // Passive play punished twice as fast: the control scores the same per tick but dies sooner. Per-tick, the
  // ratio is unchanged — which is the property that makes the signal structural rather than a tuning artifact.
  const punished = computeControlDominance({
    seeds: [1],
    policyResults: [result(1, 100, 400)],
    controlsBySet: { monotonic: [control("hold-v1", "hold", 1, 25, 200)] },
  });
  assert.equal(punished.perSeed[0].sets.monotonic.ratio, 0.5);
});

test("best control is selected by final score, matching the shared executor, not by rate", () => {
  // `hold` scores more in total; `idle` scores more per tick. The evaluator's `best-control-same-seed` rule is
  // highest final score, so the ratio must follow `hold` — and the rate-selected alternative is reported
  // beside it rather than silently substituted, because the two answer different questions.
  const measured = computeControlDominance({
    seeds: [7],
    policyResults: [result(7, 100, 100)],
    controlsBySet: {
      evaluator: [
        control("idle-v1", "idle", 7, 60, 30),
        control("hold-v1", "hold", 7, 90, 300),
      ],
    },
  });
  const set = measured.perSeed[0].sets.evaluator;
  assert.equal(set.best_control_condition_id, "hold-v1");
  assert.equal(set.ratio, 0.3);
  assert.equal(set.best_by_rate.condition_id, "idle-v1");
  assert.equal(set.best_by_rate.ratio, 2);
});

test("a tie on final score is broken by longer survival, as the shared executor breaks it", () => {
  const measured = computeControlDominance({
    seeds: [3],
    policyResults: [result(3, 10, 100)],
    controlsBySet: {
      evaluator: [
        control("idle-v1", "idle", 3, 0, 200),
        control("hold-v1", "hold", 3, 0, 500),
      ],
    },
  });
  assert.equal(measured.perSeed[0].sets.evaluator.best_control_condition_id, "hold-v1");
  assert.equal(measured.perSeed[0].sets.evaluator.ratio, 0);
});

test("a scoreless policy episode yields no ratio rather than a zero or an infinity", () => {
  // A policy that scores nothing has no scoring rate to be dominated, so the seed contributes no ratio. Coercing
  // it to 0 would read as "the control is irrelevant here", which is the opposite of what the episode shows.
  const measured = computeControlDominance({
    seeds: [5],
    policyResults: [result(5, 0, 120)],
    controlsBySet: { monotonic: [control("hold-v1", "hold", 5, 0, 400)] },
  });
  assert.equal(measured.perSeed[0].sets.monotonic.ratio, null);
  assert.equal(measured.summary.monotonic.seeds_with_ratio, 0);
  assert.equal(measured.summary.monotonic.ratio_median, null);
  assert.equal(episodeRate(result(5, 7, 0)), 0);
});

test("the two aggregates are reported separately because one long seed can carry the pooled ratio", () => {
  // Seed 1 is short and the control is helpless; seed 2 is long and the control dominates. The median says the
  // typical episode is not dominated; the pooled ratio says the matrix as a whole is. Reporting only one of the
  // two would hide the disagreement, which on real games is exactly where the verdict lives.
  const measured = computeControlDominance({
    seeds: [1, 2],
    policyResults: [result(1, 100, 100), result(2, 100, 1000)],
    controlsBySet: {
      monotonic: [
        control("hold-v1", "hold", 1, 0, 100),
        control("hold-v1", "hold", 2, 2000, 1000),
      ],
    },
  });
  const summary = measured.summary.monotonic;
  assert.equal(summary.ratio_min, 0);
  assert.equal(summary.ratio_max, 20);
  assert.equal(summary.ratio_median, 10);
  // Pooled: controls 2000/1100 against the policy's 200/1100 — the long seed carries it entirely.
  assert.equal(summary.ratio_pooled, 10);
});

test("control sets are summarised independently, so a verdict that depends on the set is visible", () => {
  // The case Gate S actually met: monotonic controls score nothing while a scripted periodic control out-rates
  // the private policy. Any signal that does not say which set it means has two different verdicts here.
  const measured = computeControlDominance({
    seeds: [1],
    policyResults: [result(1, 40, 1200)],
    controlsBySet: {
      monotonic: [
        control("idle-v1", "idle", 1, 0, 900),
        control("hold-v1", "hold", 1, 0, 900),
      ],
      evaluator: [
        control("idle-v1", "idle", 1, 0, 900),
        control("hold-v1", "hold", 1, 0, 900),
        control("periodic-30-10", "periodic", 1, 100, 1200),
      ],
    },
  });
  assert.equal(measured.perSeed[0].sets.monotonic.ratio, 0);
  assert.equal(measured.perSeed[0].sets.evaluator.ratio, 2.5);
  assert.equal(measured.summary.monotonic.ratio_median, 0);
  assert.equal(measured.summary.evaluator.ratio_median, 2.5);
});
