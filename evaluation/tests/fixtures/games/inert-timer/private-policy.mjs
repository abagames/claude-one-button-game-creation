// Private closed-loop policy for the negative-control fixture game.
// The game ignores input entirely, so the policy only has to produce a well-formed, replayable input
// sequence with press runs and release windows for counterfactual editing.

export function toObservation(step, input) {
  return {
    logical_tick: step.logicalTick,
    score: step.score,
    phase: step.phase,
    input: {
      pressed: input.pressed,
      just_pressed: input.just_pressed,
      just_released: input.just_released,
    },
    records: (step.privateDrawing?.records ?? []).map((record) => ({
      type: record.subject?.type ?? null,
      pos: { x: record.pos.x, y: record.pos.y },
      size: { x: record.size.x, y: record.size.y },
    })),
  };
}

export function createController(parameters = {}) {
  const settings = { period_ticks: 11, pressed_ticks: 3, ...parameters };
  let lastObservedTick = null;

  return {
    nextPressed({ logical_tick }) {
      return logical_tick % settings.period_ticks < settings.pressed_ticks;
    },
    observe(observation) {
      lastObservedTick = observation.logical_tick;
    },
    get observedTick() {
      return lastObservedTick;
    },
  };
}
