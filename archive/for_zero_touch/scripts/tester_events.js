/**
 * Event logging and analysis for game simulation
 * Captures and analyzes game events for detailed metrics reporting
 */

// ===== Event Logger =====

/**
 * Event types for game logging
 */
const EventType = {
  GAME_START: "game_start",
  GAME_OVER: "game_over",
  SCORE: "score",
  OBSTACLE_SPAWN: "obstacle_spawn",
  ENEMY_SPAWN: "enemy_spawn",
  ITEM_SPAWN: "item_spawn",
  COLLISION: "collision",
  NEAR_MISS: "near_miss",
  PLAYER_STATE: "player_state",
  INPUT: "input",
  CUSTOM: "custom",
};

/**
 * Event Logger for structured game event recording
 * Captures significant game events for LLM analysis
 */
class EventLogger {
  constructor(options = {}) {
    this.events = [];
    this.frameBuffer = []; // Circular buffer for recent frames
    this.frameBufferSize = options.frameBufferSize || 30; // Last 0.5 seconds at 60 FPS
    this.enabled = options.enabled !== false;
    this.verboseMode = options.verboseMode || false;

    // Statistics tracking
    this.stats = {
      totalScore: 0,
      scoreEvents: [],
      obstaclesSpawned: 0,
      enemiesSpawned: 0,
      collisions: 0,
      nearMisses: 0,
      inputPresses: 0,
      inputHolds: 0,
      maxHoldDuration: 0,
    };

    // Spatial tracking for pattern analysis
    this.spatialData = {
      deathPositions: [],
      scorePositions: [],
      obstacleSpawnPositions: [],
      playerTrajectory: [], // Sampled every N frames
    };

    this.trajectorySampleRate = options.trajectorySampleRate || 10; // Sample every 10 frames
  }

  /**
   * Reset the logger for a new game session
   */
  reset() {
    this.events = [];
    this.frameBuffer = [];
    this.stats = {
      totalScore: 0,
      scoreEvents: [],
      obstaclesSpawned: 0,
      enemiesSpawned: 0,
      collisions: 0,
      nearMisses: 0,
      inputPresses: 0,
      inputHolds: 0,
      maxHoldDuration: 0,
    };
    this.spatialData = {
      deathPositions: [],
      scorePositions: [],
      obstacleSpawnPositions: [],
      playerTrajectory: [],
    };
  }

  /**
   * Log a game event
   * @param {string} type Event type from EventType
   * @param {number} tick Current game tick
   * @param {Object} data Event-specific data
   */
  log(type, tick, data = {}) {
    if (!this.enabled) return;

    const event = {
      type,
      tick,
      time: (tick / 60).toFixed(2), // Convert to seconds
      ...data,
    };

    this.events.push(event);

    // Update statistics based on event type
    this._updateStats(type, data);

    if (this.verboseMode) {
      console.log(`[Event] ${type} @ tick ${tick}:`, JSON.stringify(data));
    }
  }

  /**
   * Record a frame snapshot for the circular buffer
   * @param {number} tick Current tick
   * @param {Object} frameData Frame state data
   */
  recordFrame(tick, frameData) {
    if (!this.enabled) return;

    const frame = {
      tick,
      ...frameData,
    };

    this.frameBuffer.push(frame);
    if (this.frameBuffer.length > this.frameBufferSize) {
      this.frameBuffer.shift();
    }

    // Sample trajectory
    if (tick % this.trajectorySampleRate === 0 && frameData.playerPos) {
      this.spatialData.playerTrajectory.push({
        tick,
        x: frameData.playerPos.x,
        y: frameData.playerPos.y,
      });
    }
  }

  /**
   * Update statistics based on event
   */
  _updateStats(type, data) {
    switch (type) {
      case EventType.SCORE:
        this.stats.totalScore += data.value || 0;
        this.stats.scoreEvents.push({
          value: data.value,
          trigger: data.trigger,
          tick: data.tick,
        });
        if (data.pos) {
          this.spatialData.scorePositions.push(data.pos);
        }
        break;
      case EventType.OBSTACLE_SPAWN:
        this.stats.obstaclesSpawned++;
        if (data.pos) {
          this.spatialData.obstacleSpawnPositions.push(data.pos);
        }
        break;
      case EventType.ENEMY_SPAWN:
        this.stats.enemiesSpawned++;
        break;
      case EventType.COLLISION:
        this.stats.collisions++;
        break;
      case EventType.NEAR_MISS:
        this.stats.nearMisses++;
        break;
      case EventType.INPUT:
        if (data.action === "press") {
          this.stats.inputPresses++;
        }
        if (data.holdDuration) {
          this.stats.inputHolds++;
          this.stats.maxHoldDuration = Math.max(
            this.stats.maxHoldDuration,
            data.holdDuration
          );
        }
        break;
      case EventType.GAME_OVER:
        if (data.playerPos) {
          this.spatialData.deathPositions.push(data.playerPos);
        }
        break;
    }
  }

  /**
   * Get the recent frames leading up to game over
   * @param {number} count Number of frames to retrieve
   * @returns {Array} Recent frame snapshots
   */
  getRecentFrames(count = 10) {
    return this.frameBuffer.slice(-count);
  }

  /**
   * Generate a structured analysis report
   * @param {Object} options Report options
   * @returns {Object} Analysis report
   */
  generateReport(options = {}) {
    const { includeAllEvents = false, maxEvents = 100 } = options;

    // Filter significant events for the report
    const significantEvents = includeAllEvents
      ? this.events.slice(-maxEvents)
      : this.events.filter(
          (e) =>
            e.type === EventType.GAME_OVER ||
            e.type === EventType.SCORE ||
            e.type === EventType.COLLISION ||
            e.type === EventType.NEAR_MISS
        );

    // Analyze death patterns
    const deathAnalysis = this._analyzeDeaths();

    // Analyze scoring patterns
    const scoringAnalysis = this._analyzeScoring();

    // Analyze spawn patterns
    const spawnAnalysis = this._analyzeSpawns();

    // Analyze input patterns
    const inputAnalysis = this._analyzeInput();

    return {
      summary: {
        totalTicks: this.events.find((e) => e.type === EventType.GAME_OVER)
          ?.tick || 0,
        totalScore: this.stats.totalScore,
        survivalTime:
          (
            (this.events.find((e) => e.type === EventType.GAME_OVER)?.tick ||
              0) / 60
          ).toFixed(2) + "s",
        obstaclesSpawned: this.stats.obstaclesSpawned,
        enemiesSpawned: this.stats.enemiesSpawned,
        nearMisses: this.stats.nearMisses,
        inputPresses: this.stats.inputPresses,
      },
      deathAnalysis,
      scoringAnalysis,
      spawnAnalysis,
      inputAnalysis,
      recentFrames: this.getRecentFrames(15),
      significantEvents: significantEvents.slice(-50),
      spatialData: this.spatialData,
    };
  }

  /**
   * Analyze death patterns
   */
  _analyzeDeaths() {
    const gameOverEvent = this.events.find(
      (e) => e.type === EventType.GAME_OVER
    );
    if (!gameOverEvent) return null;

    const recentFrames = this.getRecentFrames(10);
    const collisionEvents = this.events.filter(
      (e) => e.type === EventType.COLLISION
    );

    // Calculate approach velocity if we have position data
    let approachAnalysis = null;
    if (recentFrames.length >= 2) {
      const lastFrames = recentFrames.slice(-5);
      if (lastFrames[0]?.playerPos && lastFrames[lastFrames.length - 1]?.playerPos) {
        const startPos = lastFrames[0].playerPos;
        const endPos = lastFrames[lastFrames.length - 1].playerPos;
        const tickDiff = lastFrames[lastFrames.length - 1].tick - lastFrames[0].tick;

        approachAnalysis = {
          playerVelocity: {
            x: ((endPos.x - startPos.x) / tickDiff).toFixed(2),
            y: ((endPos.y - startPos.y) / tickDiff).toFixed(2),
          },
          framesBeforeDeath: lastFrames.length,
        };
      }
    }

    return {
      cause: gameOverEvent.cause || "unknown",
      tick: gameOverEvent.tick,
      time: gameOverEvent.time,
      position: gameOverEvent.playerPos,
      collidedWith: gameOverEvent.obstacle || gameOverEvent.enemy,
      totalCollisions: collisionEvents.length,
      approachAnalysis,
      recentFrames: recentFrames.map((f) => ({
        tick: f.tick,
        playerPos: f.playerPos,
        nearestObstacle: f.nearestObstacle,
        input: f.input,
      })),
    };
  }

  /**
   * Analyze scoring patterns
   */
  _analyzeScoring() {
    const scoreEvents = this.stats.scoreEvents;
    if (scoreEvents.length === 0) return { pattern: "no_scores" };

    // Calculate scoring rate over time
    const scoringByTime = {};
    scoreEvents.forEach((e) => {
      const timeBlock = Math.floor(e.tick / 300); // 5-second blocks
      scoringByTime[timeBlock] = (scoringByTime[timeBlock] || 0) + e.value;
    });

    // Identify scoring triggers
    const triggerCounts = {};
    scoreEvents.forEach((e) => {
      const trigger = e.trigger || "unknown";
      triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
    });

    return {
      totalEvents: scoreEvents.length,
      averageScore:
        scoreEvents.length > 0
          ? (
              scoreEvents.reduce((sum, e) => sum + e.value, 0) /
              scoreEvents.length
            ).toFixed(1)
          : 0,
      scoringRate: scoringByTime,
      triggers: triggerCounts,
      peakScoring: Math.max(...Object.values(scoringByTime), 0),
    };
  }

  /**
   * Analyze spawn patterns
   */
  _analyzeSpawns() {
    const spawnEvents = this.events.filter(
      (e) =>
        e.type === EventType.OBSTACLE_SPAWN || e.type === EventType.ENEMY_SPAWN
    );

    if (spawnEvents.length === 0) return { pattern: "no_spawns" };

    // Calculate spawn intervals
    const intervals = [];
    for (let i = 1; i < spawnEvents.length; i++) {
      intervals.push(spawnEvents[i].tick - spawnEvents[i - 1].tick);
    }

    // Analyze spawn positions
    const positions = this.spatialData.obstacleSpawnPositions;
    const xPositions = positions.map((p) => p.x);
    const yPositions = positions.map((p) => p.y);

    return {
      totalSpawns: spawnEvents.length,
      averageInterval:
        intervals.length > 0
          ? (intervals.reduce((a, b) => a + b, 0) / intervals.length).toFixed(1)
          : "N/A",
      minInterval: intervals.length > 0 ? Math.min(...intervals) : "N/A",
      maxInterval: intervals.length > 0 ? Math.max(...intervals) : "N/A",
      spatialDistribution: {
        xRange:
          xPositions.length > 0
            ? [Math.min(...xPositions), Math.max(...xPositions)]
            : null,
        yRange:
          yPositions.length > 0
            ? [Math.min(...yPositions), Math.max(...yPositions)]
            : null,
      },
      spawnTypes: spawnEvents.reduce((acc, e) => {
        const kind = e.kind || "unknown";
        acc[kind] = (acc[kind] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  /**
   * Analyze input patterns
   */
  _analyzeInput() {
    const inputEvents = this.events.filter((e) => e.type === EventType.INPUT);

    if (inputEvents.length === 0) return { pattern: "no_input" };

    // Calculate press intervals
    const pressEvents = inputEvents.filter((e) => e.action === "press");
    const intervals = [];
    for (let i = 1; i < pressEvents.length; i++) {
      intervals.push(pressEvents[i].tick - pressEvents[i - 1].tick);
    }

    // Detect input patterns
    let pattern = "varied";
    if (intervals.length > 5) {
      const avgInterval =
        intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance =
        intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) /
        intervals.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev < avgInterval * 0.2) {
        pattern = "rhythmic"; // Very consistent timing
      } else if (avgInterval < 10) {
        pattern = "spam"; // Very fast pressing
      } else if (this.stats.maxHoldDuration > 60) {
        pattern = "hold_heavy"; // Lots of holding
      }
    }

    return {
      totalPresses: this.stats.inputPresses,
      totalHolds: this.stats.inputHolds,
      maxHoldDuration: this.stats.maxHoldDuration,
      averageInterval:
        intervals.length > 0
          ? (intervals.reduce((a, b) => a + b, 0) / intervals.length).toFixed(1)
          : "N/A",
      pattern,
      pressTimeline: pressEvents.slice(-20).map((e) => e.tick),
    };
  }

  /**
   * Export report as formatted string for LLM consumption
   * @returns {string} Formatted report
   */
  toMarkdown() {
    const report = this.generateReport();

    let md = `# Game Simulation Report\n\n`;

    md += `## Summary\n`;
    md += `- **Survival Time:** ${report.summary.survivalTime}\n`;
    md += `- **Total Score:** ${report.summary.totalScore}\n`;
    md += `- **Obstacles Spawned:** ${report.summary.obstaclesSpawned}\n`;
    md += `- **Near Misses:** ${report.summary.nearMisses}\n`;
    md += `- **Input Presses:** ${report.summary.inputPresses}\n\n`;

    if (report.deathAnalysis) {
      md += `## Death Analysis\n`;
      md += `- **Cause:** ${report.deathAnalysis.cause}\n`;
      md += `- **Time:** ${report.deathAnalysis.time}\n`;
      md += `- **Position:** ${JSON.stringify(report.deathAnalysis.position)}\n`;
      md += `- **Collided With:** ${report.deathAnalysis.collidedWith || "N/A"}\n\n`;

      if (report.deathAnalysis.approachAnalysis) {
        md += `### Approach Analysis\n`;
        md += `- **Player Velocity:** ${JSON.stringify(report.deathAnalysis.approachAnalysis.playerVelocity)}\n\n`;
      }

      md += `### Frames Before Death\n`;
      md += `\`\`\`\n`;
      report.deathAnalysis.recentFrames.forEach((f) => {
        md += `tick ${f.tick}: player=${JSON.stringify(f.playerPos)}, obstacle=${JSON.stringify(f.nearestObstacle)}, input=${JSON.stringify(f.input)}\n`;
      });
      md += `\`\`\`\n\n`;
    }

    md += `## Scoring Analysis\n`;
    md += `- **Total Events:** ${report.scoringAnalysis.totalEvents}\n`;
    md += `- **Average Score:** ${report.scoringAnalysis.averageScore}\n`;
    md += `- **Triggers:** ${JSON.stringify(report.scoringAnalysis.triggers)}\n\n`;

    md += `## Spawn Analysis\n`;
    md += `- **Total Spawns:** ${report.spawnAnalysis.totalSpawns}\n`;
    md += `- **Average Interval:** ${report.spawnAnalysis.averageInterval} ticks\n`;
    md += `- **Min/Max Interval:** ${report.spawnAnalysis.minInterval}/${report.spawnAnalysis.maxInterval} ticks\n`;
    md += `- **Spawn Types:** ${JSON.stringify(report.spawnAnalysis.spawnTypes)}\n\n`;

    md += `## Input Analysis\n`;
    md += `- **Pattern:** ${report.inputAnalysis.pattern}\n`;
    md += `- **Total Presses:** ${report.inputAnalysis.totalPresses}\n`;
    md += `- **Max Hold Duration:** ${report.inputAnalysis.maxHoldDuration} ticks\n`;

    return md;
  }

  /**
   * Export as JSON for programmatic analysis
   * @returns {string} JSON string
   */
  toJSON() {
    return JSON.stringify(this.generateReport(), null, 2);
  }
}

module.exports = {
  EventType,
  EventLogger,
};
