#!/usr/bin/env node
/**
 * Coevolutionary Game Balance Adjustment
 *
 * Alternates between Player GA (optimizing input patterns) and Balance GA
 * (adjusting game parameters) to achieve target gameplay metrics.
 *
 * Usage: node scripts/coevolve_balance.js --slug <slug> [options]
 */

const fs = require('fs');
const path = require('path');
const { injectParameters } = require('./dynamic_game_injector.js');
const { createCrispGameAdapter } = require('./crisp_game_adapter.js');

function parseArgs(argv) {
  const opts = {
    targetScore: 100,
    targetTime: 60,
    maxIterations: 5,
    playerGenerations: 30,
    balanceGenerations: 20,
    convergenceThreshold: 5.0,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--slug') {
      opts.slug = argv[i + 1];
      i += 1;
    } else if (arg === '--target-score') {
      opts.targetScore = parseFloat(argv[i + 1]);
      i += 1;
    } else if (arg === '--target-time') {
      opts.targetTime = parseFloat(argv[i + 1]);
      i += 1;
    } else if (arg === '--max-iterations') {
      opts.maxIterations = parseInt(argv[i + 1], 10);
      i += 1;
    } else if (arg === '--player-gens') {
      opts.playerGenerations = parseInt(argv[i + 1], 10);
      i += 1;
    } else if (arg === '--balance-gens') {
      opts.balanceGenerations = parseInt(argv[i + 1], 10);
      i += 1;
    } else if (arg === '--convergence') {
      opts.convergenceThreshold = parseFloat(argv[i + 1]);
      i += 1;
    } else if (arg.startsWith('--')) {
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
    }
  }

  if (!opts.slug) {
    console.error('Missing required argument: --slug');
    console.error('Usage: node scripts/coevolve_balance.js --slug <slug> [options]');
    console.error('Options:');
    console.error('  --target-score <num>     Target score (default: 100)');
    console.error('  --target-time <num>      Target survival time in seconds (default: 60)');
    console.error('  --max-iterations <num>   Max coevolution iterations (default: 5)');
    console.error('  --player-gens <num>      Player GA generations (default: 30)');
    console.error('  --balance-gens <num>     Balance GA generations (default: 20)');
    console.error('  --convergence <num>      Convergence threshold (default: 5.0)');
    process.exit(1);
  }

  return opts;
}

function main() {
  const argv = process.argv.slice(2);
  const options = parseArgs(argv);

  console.log(`
====================================
Coevolutionary Balance Adjustment
====================================

Game: ${options.slug}
Target Score: ${options.targetScore}
Target Time: ${options.targetTime}s
Max Iterations: ${options.maxIterations}
Player GA Generations: ${options.playerGenerations}
Balance GA Generations: ${options.balanceGenerations}
Convergence Threshold: ${options.convergenceThreshold}
`);

  const ROOT = path.join(__dirname, '..');
  const prototypeDir = path.join(ROOT, 'tmp', 'prototypes', options.slug);
  const gamePath = path.join(prototypeDir, 'game.js');
  const paramsPath = path.join(prototypeDir, 'balance_params.json');
  const outputPath = path.join(prototypeDir, 'adjusted_game.js');

  // Validate files exist
  if (!fs.existsSync(gamePath)) {
    console.error(`Error: Game file not found: ${gamePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(paramsPath)) {
    console.error(`Error: Parameters file not found: ${paramsPath}`);
    console.error('Run: npm run extract-balance-params -- --slug ' + options.slug);
    process.exit(1);
  }

  // Load game and parameters
  const gameCode = fs.readFileSync(gamePath, 'utf8');
  const paramsData = JSON.parse(fs.readFileSync(paramsPath, 'utf8'));
  const parameterSpec = paramsData.parameters;

  // Load framework
  const frameworkPath = path.join(__dirname, 'game-testing-framework.js');
  const {
    GameSimulator,
    GAInputGenerator,
    GameBalanceGA,
  } = require(frameworkPath);

  const simulator = new GameSimulator();

  // Coevolution loop
  let currentGameCode = gameCode;
  let currentParams = {};
  for (const param of parameterSpec) {
    currentParams[param.path] = param.currentValue;
  }

  let bestPlayerPattern = null;
  let iteration = 0;
  let converged = false;

  console.log('\n--- Starting Coevolution Loop ---\n');

  while (iteration < options.maxIterations && !converged) {
    iteration++;

    console.log(`\n=== Iteration ${iteration} ===\n`);

    // Step 1: Run Player GA with current game parameters
    console.log('[1/3] Running Player GA to find optimal input pattern...');

    // Create temp game file with current parameters
    const tmpGamePath = path.join(prototypeDir, `_coevolve_temp_${iteration}.js`);
    fs.writeFileSync(tmpGamePath, currentGameCode, 'utf8');

    try {
      // Use Crisp game adapter to load the game
      const gameConcept = createCrispGameAdapter(tmpGamePath);

      const playerGAConfig = {
        generations: options.playerGenerations,
        populationSize: 50,
        mutationRate: 0.3,
      };

      const playerResult = GAInputGenerator.evolve(
        simulator,
        gameConcept,
        {},
        playerGAConfig
      );

      bestPlayerPattern = playerResult.bestIndividual.toInputPattern();
      const playerScore = playerResult.bestFitness;

      console.log(`   Player GA completed: ${playerResult.generationsRun} generations`);
      console.log(`   Best fitness (penalized score): ${playerScore.toFixed(2)}`);
      console.log(`   Genome length: ${playerResult.bestIndividual.genome.length}`);

      // Log input pattern details
      const genome = playerResult.bestIndividual.genome;
      console.log(`   Genome: [${genome.map(g => `{start:${g.start}, dur:${g.duration}}`).join(', ')}]`);
      console.log(`   Pattern length: ${bestPlayerPattern.length} ticks`);

      // Simulate to get actual metrics
      const testResult = simulator.simulateGame(
        gameConcept.init,
        gameConcept.update,
        gameConcept.isGameOver,
        gameConcept.getScore,
        {},
        bestPlayerPattern.length,
        bestPlayerPattern
      );

      const actualScore = testResult.score;
      const actualTime = testResult.duration / 60.0;

      console.log(`   Actual score: ${actualScore.toFixed(2)}`);
      console.log(`   Actual time: ${actualTime.toFixed(2)}s`);

      // Step 2: Check if metrics are close to target
      const scoreDiff = Math.abs(options.targetScore - actualScore);
      const timeDiff = Math.abs(options.targetTime - actualTime);
      const totalDiff = scoreDiff + timeDiff;

      console.log(`\n[2/3] Evaluating metrics vs target...`);
      console.log(`   Score difference: ${scoreDiff.toFixed(2)} (target: ${options.targetScore})`);
      console.log(`   Time difference: ${timeDiff.toFixed(2)}s (target: ${options.targetTime}s)`);
      console.log(`   Total difference: ${totalDiff.toFixed(2)}`);

      if (totalDiff < options.convergenceThreshold) {
        console.log(`\n   ✓ Converged! Metrics within threshold.`);
        converged = true;
        break;
      }

      // Step 3: Run Balance GA to adjust parameters
      console.log(`\n[3/3] Running Balance GA to adjust game parameters...`);

      const balanceGAConfig = {
        generations: options.balanceGenerations,
        populationSize: 30,
        mutationRate: 0.3,
        gapWeight: 2.0,      // Score gap optimization (priority)
        scoreWeight: 1.0,    // Target score proximity
        timeWeight: 0.5,     // Target time proximity
        minScoreGap: 20,     // Minimum required score gap
      };

      const targetMetrics = {
        score: options.targetScore,
        survivalTime: options.targetTime,
      };

      const balanceResult = GameBalanceGA.evolve(
        simulator,
        currentGameCode,
        bestPlayerPattern,
        parameterSpec,
        targetMetrics,
        {},
        balanceGAConfig
      );

      console.log(`   Balance GA completed: ${balanceResult.generationsRun} generations`);
      console.log(`   Best fitness (distance from target): ${balanceResult.bestFitness.toFixed(2)}`);

      // Check if Balance GA found any valid solution
      if (!balanceResult.bestParameters) {
        console.log(`   ⚠ Balance GA failed to find valid parameters (all injections failed)`);
        console.log(`   Keeping current parameters for next iteration`);
        continue; // Skip parameter update, keep current parameters
      }

      // Update current parameters
      currentParams = balanceResult.bestParameters;

      // Inject with verbose output
      const injectionResult = injectParameters(gameCode, currentParams, parameterSpec, {
        verbose: false,
        verifyChanges: true,
      });

      currentGameCode = injectionResult.code;

      console.log(`   Parameters adjusted (${injectionResult.successCount}/${injectionResult.totalCount} injected):`);
      for (const param of parameterSpec) {
        const oldVal = param.currentValue;
        const newVal = currentParams[param.path];
        if (Math.abs(oldVal - newVal) > 0.001) {
          console.log(`     ${param.path}: ${oldVal.toFixed(3)} -> ${newVal.toFixed(3)}`);
        }
      }

    } finally {
      // Clean up temp file
      if (fs.existsSync(tmpGamePath)) {
        fs.unlinkSync(tmpGamePath);
      }
    }
  }

  // Final results
  console.log(`\n
====================================
Coevolution Complete
====================================

Iterations: ${iteration}
Converged: ${converged ? 'Yes' : 'No (max iterations reached)'}
`);

  // Save adjusted parameters
  const adjustedParamsData = {
    ...paramsData,
    adjustedAt: new Date().toISOString(),
    coevolutionIterations: iteration,
    targetMetrics: {
      score: options.targetScore,
      survivalTime: options.targetTime,
    },
    bestPlayerPattern: bestPlayerPattern ? {
      genome: bestPlayerPattern.genome || [],
      length: bestPlayerPattern.length,
      pattern: bestPlayerPattern,
    } : null,
    parameters: parameterSpec.map(param => ({
      ...param,
      adjustedValue: currentParams[param.path],
    })),
  };

  const adjustedParamsPath = path.join(prototypeDir, 'adjusted_params.json');
  fs.writeFileSync(adjustedParamsPath, JSON.stringify(adjustedParamsData, null, 2), 'utf8');
  console.log(`Adjusted parameters saved to: ${adjustedParamsPath}`);

  // Save adjusted game code
  fs.writeFileSync(outputPath, currentGameCode, 'utf8');
  console.log(`Adjusted game code saved to: ${outputPath}`);

  console.log(`\nNext steps:`);
  console.log(`1. Review adjusted parameters in ${adjustedParamsPath}`);
  console.log(`2. Test adjusted game: node scripts/test_game_framework.js --slug ${options.slug} --file ${outputPath} --use-ga`);
  console.log(`3. If satisfied, manually copy adjusted values back to game.js`);
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs };
