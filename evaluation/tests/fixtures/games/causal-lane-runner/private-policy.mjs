// Private closed-loop policy for the positive-control fixture game.
// It reads only the versioned allowlist observation built by toObservation(); it never touches game source
// objects, the runtime RNG, or future state.

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
  const settings = {
    velocity_lookahead: 6,
    fallback_period_ticks: 9,
    fallback_pressed_ticks: 4,
    neutral_target_y: 50,
    ...parameters,
  };
  let observed = false;
  let playerY = settings.neutral_target_y;
  let previousPlayerY = settings.neutral_target_y;
  let targetY = settings.neutral_target_y;

  return {
    nextPressed({ logical_tick }) {
      if (!observed) {
        return logical_tick % settings.fallback_period_ticks < settings.fallback_pressed_ticks;
      }
      const velocity = playerY - previousPlayerY;
      return playerY + velocity * settings.velocity_lookahead > targetY;
    },
    observe(observation) {
      const records = observation.records ?? [];
      const player = center(records.find((record) => record.type === "player"));
      if (player == null) return;
      previousPlayerY = observed ? playerY : player.y;
      playerY = player.y;
      observed = true;
      const nextCoin = records
        .filter((record) => record.type === "coin")
        .map(center)
        .filter((coin) => coin.x >= player.x - 1)
        .sort((left, right) => left.x - right.x)[0];
      targetY = nextCoin == null ? settings.neutral_target_y : nextCoin.y;
    },
  };
}

function center(record) {
  return record == null
    ? null
    : { x: record.pos.x + record.size.x / 2, y: record.pos.y + record.size.y / 2 };
}
