#!/usr/bin/env node
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');
const { calculateAllMetrics } = require('./calculate_novelty_metrics');
const { calculateQualityScores } = require('./calculate_quality_scores');

const ROOT = path.join(__dirname, '..');
const PROTOTYPE_DIR = path.join(ROOT, 'tmp', 'prototypes');
const LOG_DIR = path.join(ROOT, 'knowledge', 'logs');
const METRICS_FILE = path.join(ROOT, 'knowledge', 'metrics', 'tag_combo_history.csv');

function parseArgs(argv) {
  const opts = { mode: 'lint' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--slug') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --slug');
      }
      opts.slug = argv[i + 1];
      i += 1;
    } else if (arg === '--mode') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --mode');
      }
      opts.mode = argv[i + 1];
      i += 1;
    } else if (arg === '--seed') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --seed');
      }
      opts.seed = Number(argv[i + 1]);
      i += 1;
    } else if (arg === '--frames') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --frames');
      }
      opts.frames = Number(argv[i + 1]);
      i += 1;
    } else if (arg === '--file') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --file');
      }
      opts.file = argv[i + 1];
      i += 1;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }
  if (!opts.slug) {
    throw new Error('Expected --slug <slug>');
  }
  return opts;
}

function assertSlug(slug) {
  if (!/^[a-z0-9_]+$/.test(slug)) {
    throw new Error(`Invalid slug format: ${slug}`);
  }
}

function formatTimestamp(date) {
  const pad = (num) => num.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return {
    iso: `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`,
    date: `${yyyy}-${mm}-${dd}`,
    logDate: `${yyyy}${mm}${dd}`,
  };
}

async function ensureMetricsHeader() {
  if (fsSync.existsSync(METRICS_FILE)) {
    return;
  }
  await fs.mkdir(path.dirname(METRICS_FILE), { recursive: true });
  const header = 'date,tags,slug,outcome,notes,ga_best_score,ga_resistance,technical_score,design_score,novelty_score,overall_score\n';
  await fs.writeFile(METRICS_FILE, header, 'utf8');
}

async function appendMetricsRow(timestamp, tags, slug, outcome, notes, gaBestScore = '', gaResistance = '', technicalScore = '', designScore = '', noveltyScore = '', overallScore = '') {
  await ensureMetricsHeader();
  const row = [
    timestamp.date,
    `"${tags.join('|')}"`,
    slug,
    outcome,
    notes,
    gaBestScore,
    gaResistance,
    technicalScore,
    designScore,
    noveltyScore,
    overallScore
  ];
  await fs.appendFile(METRICS_FILE, `${row.join(',')}\n`, 'utf8');
}

async function readTagsFromContext(slug) {
  const contextPath = path.join(PROTOTYPE_DIR, slug, 'context.md');
  try {
    const content = await fs.readFile(contextPath, 'utf8');
    const match = content.match(/- Tags:\s*([^\n]+)/);
    if (!match) {
      return [];
    }
    return match[1]
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && t !== '(unspecified)');
  } catch (err) {
    return [];
  }
}

function runCommand(command, args) {
  return spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
  });
}

function buildModeList(mode) {
  if (mode === 'lint') {
    return ['lint'];
  }
  if (mode === 'sim') {
    return ['sim'];
  }
  if (mode === 'full') {
    return ['lint', 'sim'];
  }
  if (mode === 'ga') {
    return ['lint', 'sim-ga'];
  }
  if (mode === 'comprehensive') {
    return ['lint', 'sim', 'sim-ga'];
  }
  throw new Error(`Unsupported mode: ${mode}`);
}

/**
 * Transpile TypeScript file to eval-ready JavaScript
 * @param {string} tsPath Path to TypeScript file
 * @returns {Promise<string>} Path to transpiled JavaScript file
 */
async function transpileTypeScriptToTemp(tsPath) {
  const tmpDir = path.join(ROOT, 'tmp', 'transpiled');
  await fs.mkdir(tmpDir, { recursive: true });

  const basename = path.basename(tsPath, '.ts');
  const outfile = path.join(tmpDir, `${basename}.js`);

  console.log(`[Transpile] ${path.relative(ROOT, tsPath)} → ${path.relative(ROOT, outfile)}`);

  try {
    // Step 1: esbuild transpilation (type removal only)
    execSync(
      `npx esbuild "${tsPath}" --outfile="${outfile}" --format=esm --target=es2020`,
      { cwd: ROOT, stdio: 'pipe' }
    );

    // Step 2: Read transpiled code
    let jsCode = await fs.readFile(outfile, 'utf8');

    // Step 3: Apply preprocessing (same as crisp_game_adapter.js)
    // (a) Remove ESM import statements (eval doesn't support module syntax)
    jsCode = jsCode.replace(/^[ \t]*import[^;]+;?\s*$/gm, '');

    // (b) Convert top-level const/let → var (for global scope binding)
    jsCode = jsCode.replace(/^(let|const)\s+/gm, 'var ');

    // (c) Remove init() call (crisp_game_adapter handles initialization)
    jsCode = jsCode.replace(/^[ \t]*init\s*\([^)]*\)\s*;?\s*$/gm, '');

    // Step 4: Write preprocessed code back
    await fs.writeFile(outfile, jsCode, 'utf8');

    console.log('[Transpile] ✓ Success (TypeScript → eval-ready JavaScript)');
    return outfile;
  } catch (err) {
    const errorMsg = err.stderr ? err.stderr.toString() : err.message;
    throw new Error(`TypeScript transpilation failed:\n${errorMsg}`);
  }
}

async function writeReport(slug, timestamp, mode, seed, frames, steps, overall, noveltyMetrics, qualityScores) {
  const dir = path.join(PROTOTYPE_DIR, slug);
  await fs.mkdir(dir, { recursive: true });
  const reportPath = path.join(dir, 'verify_report.md');
  const lines = [];
  lines.push(`# Verify Report — ${slug}`);
  lines.push('');
  lines.push(`- Timestamp: ${timestamp.iso}`);
  lines.push(`- Mode Requested: ${mode}`);
  lines.push(`- Seed: ${seed !== undefined ? seed : '(default)'}`);
  lines.push(`- Frames: ${frames !== undefined ? frames : '(default)'}`);
  lines.push(`- Result: ${overall}`);
  lines.push(`- Command: node scripts/verify_prototype.js --slug ${slug}${mode ? ` --mode ${mode}` : ''}${seed !== undefined ? ` --seed ${seed}` : ''}${frames !== undefined ? ` --frames ${frames}` : ''}`);
  lines.push('');

  if (qualityScores) {
    lines.push('## Quality Scores');
    lines.push('');
    lines.push(`- Technical: ${qualityScores.technical}/100`);
    lines.push(`- Design: ${qualityScores.design}/100`);
    lines.push(`- Novelty: ${qualityScores.novelty}/100`);
    lines.push(`- **Overall: ${qualityScores.overall}/100**`);
    lines.push('');
  }

  if (noveltyMetrics) {
    lines.push('## Novelty Metrics');
    lines.push('');
    Object.keys(noveltyMetrics).forEach(key => {
      const metric = noveltyMetrics[key];
      lines.push(`### ${key}`);
      lines.push(`- Value: ${metric.value.toFixed(3)}`);
      lines.push(`- Threshold: ${metric.threshold}`);
      lines.push(`- Status: ${metric.passed ? '✓ PASS' : '✗ FAIL'}`);
      lines.push(`- Description: ${metric.description}`);
      if (metric.details) {
        lines.push(`- Details: ${JSON.stringify(metric.details, null, 2)}`);
      }
      lines.push('');
    });
  }

  steps.forEach((step) => {
    lines.push(`## Step: ${step.name}`);
    lines.push(`- Status: ${step.status}`);
    if (step.summary) {
      lines.push(`- Summary: ${step.summary}`);
    }
    if (step.stdout) {
      lines.push('### Stdout');
      lines.push('```');
      lines.push(step.stdout.trim());
      lines.push('```');
    }
    if (step.stderr) {
      lines.push('### Stderr');
      lines.push('```');
      lines.push(step.stderr.trim());
      lines.push('```');
    }
    lines.push('');
  });
  await fs.writeFile(reportPath, `${lines.join('\n')}\n`, 'utf8');
}

async function appendGlobalLog(timestamp, slug, mode, outcome) {
  await fs.mkdir(LOG_DIR, { recursive: true });
  const logFile = path.join(LOG_DIR, `${timestamp.logDate}-verify-prototype.md`);
  const payload = [
    `# Verify Entry — ${timestamp.iso}`,
    `- Slug: ${slug}`,
    `- Mode: ${mode}`,
    `- Outcome: ${outcome}`,
    '',
  ];
  await fs.appendFile(logFile, `${payload.join('\n')}\n---\n\n`, 'utf8');
}

async function main() {
  const argv = process.argv.slice(2);
  let options;
  try {
    options = parseArgs(argv);
  } catch (err) {
    console.error(`Argument error: ${err.message}`);
    process.exit(1);
  }

  try {
    assertSlug(options.slug);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const protoDir = path.join(PROTOTYPE_DIR, options.slug);
  if (!fsSync.existsSync(protoDir)) {
    console.error(`Prototype directory missing: tmp/prototypes/${options.slug}`);
    process.exit(1);
  }

  // Determine game file path: use --file if provided, otherwise default to game.js
  let gamePath;
  if (options.file) {
    // If --file is relative, resolve it from project root
    gamePath = path.isAbsolute(options.file)
      ? options.file
      : path.join(ROOT, options.file);

    if (!fsSync.existsSync(gamePath)) {
      console.error(`Game file not found: ${options.file}`);
      process.exit(1);
    }

    // Auto-transpile TypeScript files
    if (gamePath.endsWith('.ts')) {
      try {
        gamePath = await transpileTypeScriptToTemp(gamePath);
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    }
  } else {
    gamePath = path.join(protoDir, 'game.js');
    if (!fsSync.existsSync(gamePath)) {
      console.error(`Game file not found: tmp/prototypes/${options.slug}/game.js`);
      process.exit(1);
    }
  }

  let modeList;
  try {
    modeList = buildModeList(options.mode);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const timestamp = formatTimestamp(new Date());
  const steps = [];
  let hasFailure = false;
  let noveltyMetrics = null;

  // Calculate novelty metrics for full and comprehensive modes
  if (options.mode === 'full' || options.mode === 'comprehensive') {
    try {
      const tags = await readTagsFromContext(options.slug);
      const gameCode = fsSync.readFileSync(gamePath, 'utf8');
      const gameData = {
        slug: options.slug,
        tags: tags,
        code: gameCode
      };
      noveltyMetrics = calculateAllMetrics(gameData);
      console.log('Novelty metrics calculated');
    } catch (err) {
      console.warn(`Warning: Could not calculate novelty metrics: ${err.message}`);
    }
  }

  modeList.forEach((modeName) => {
    if (modeName === 'lint') {
      const args = [path.join(__dirname, 'check_game_style.js'), '--slug', options.slug, '--file', gamePath];
      const result = runCommand(process.execPath, args);
      const status = result.status === 0 ? 'pass' : 'fail';
      if (status === 'fail') {
        hasFailure = true;
      }
      steps.push({
        name: 'lint',
        status,
        stdout: result.stdout || '',
        stderr: result.stderr || '',
      });
    } else if (modeName === 'sim' || modeName === 'sim-ga') {
      // Use game-testing-framework for comprehensive input testing
      const useGA = modeName === 'sim-ga';
      const args = [path.join(__dirname, 'test_game_framework.js')];
      if (options.file) {
        args.push('--game-path', gamePath);
      } else {
        args.push('--slug', options.slug);
      }
      if (useGA) {
        args.push('--use-ga');
      }
      const result = runCommand(process.execPath, args);
      let summary = '';
      let stepFailed = result.status !== 0;

      if (result.stdout) {
        try {
          // Extract JSON from output (framework prints both console log and JSON)
          const jsonMatch = result.stdout.match(/===== JSON Output =====\n([\s\S]+)$/);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[1]);
            const rating = data.evaluation.rating;
            const maxScore = data.evaluation.maxScore;
            const vulnerability = data.monotonousResults.isHighlyVulnerable ? 'High' :
                                 data.monotonousResults.isModeratelyVulnerable ? 'Moderate' : 'Low';
            if (useGA && data.gaResults) {
              const gaVulnerability = data.gaResults.isHighlyVulnerable ? 'High' :
                                      data.gaResults.isModeratelyVulnerable ? 'Moderate' : 'Low';
              summary = `rating=${rating}, mono_vuln=${vulnerability}, ga_vuln=${gaVulnerability}, score=${data.evaluation.totalScore}/${maxScore}`;
            } else {
              summary = `rating=${rating}, vulnerability=${vulnerability}, score=${data.evaluation.totalScore}/${maxScore}`;
            }
          } else {
            summary = 'Framework output format unexpected';
            stepFailed = true;
          }
        } catch (err) {
          summary = 'Framework output not JSON parseable';
          stepFailed = true;
        }
      } else {
        summary = 'No framework output produced';
        stepFailed = true;
      }

      const status = stepFailed ? 'fail' : 'pass';
      if (status === 'fail') {
        hasFailure = true;
      }
      steps.push({
        name: useGA ? 'sim-ga' : 'sim',
        status,
        summary,
        stdout: result.stdout || '',
        stderr: result.stderr || '',
      });
    }
  });

  const overall = hasFailure ? 'fail' : 'pass';

  // Calculate quality scores for full, ga, and comprehensive modes
  let qualityScores = null;
  if (options.mode === 'full' || options.mode === 'ga' || options.mode === 'comprehensive') {
    const lintStep = steps.find(s => s.name === 'lint');
    // For comprehensive mode, prioritize sim-ga over sim
    const simStep = options.mode === 'comprehensive'
      ? steps.find(s => s.name === 'sim-ga') || steps.find(s => s.name === 'sim')
      : steps.find(s => s.name === 'sim' || s.name === 'sim-ga');

    qualityScores = calculateQualityScores({
      lintResult: lintStep,
      simResult: simStep,
      noveltyMetrics: noveltyMetrics,
      mode: options.mode
    });
  }

  await writeReport(options.slug, timestamp, options.mode, options.seed, options.frames, steps, overall, noveltyMetrics, qualityScores);
  const tags = await readTagsFromContext(options.slug);

  // Extract GA metrics if available
  let gaBestScore = '';
  let gaResistance = '';
  const gaStep = steps.find(s => s.name === 'sim-ga');
  if (gaStep && gaStep.stdout) {
    try {
      const jsonMatch = gaStep.stdout.match(/===== JSON Output =====\n([\s\S]+)$/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[1]);
        if (data.gaResults) {
          gaBestScore = data.gaResults.bestScore;
          gaResistance = data.gaResults.isHighlyVulnerable ? 'High' :
                         data.gaResults.isModeratelyVulnerable ? 'Moderate' : 'Low';
        }
      }
    } catch (err) {
      // Ignore parse errors for metrics
    }
  }

  await appendMetricsRow(
    timestamp, tags, options.slug, overall, `mode=${options.mode}`,
    gaBestScore, gaResistance,
    qualityScores ? qualityScores.technical : '',
    qualityScores ? qualityScores.design : '',
    qualityScores ? qualityScores.novelty : '',
    qualityScores ? qualityScores.overall : ''
  );
  await appendGlobalLog(timestamp, options.slug, options.mode, overall);

  steps.forEach((step) => {
    console.log(`${step.name}: ${step.status}`);
    if (step.summary) {
      console.log(`  ${step.summary}`);
    }
  });

  if (qualityScores) {
    console.log('\nQuality Scores:');
    console.log(`  Technical: ${qualityScores.technical}/100`);
    console.log(`  Design: ${qualityScores.design}/100`);
    console.log(`  Novelty: ${qualityScores.novelty}/100`);
    console.log(`  Overall: ${qualityScores.overall}/100`);
  }

  if (noveltyMetrics) {
    console.log('\nNovelty Metrics:');
    Object.keys(noveltyMetrics).forEach(key => {
      const metric = noveltyMetrics[key];
      const status = metric.passed ? '✓' : '✗';
      console.log(`  ${key}: ${metric.value.toFixed(3)} ${status} (threshold: ${metric.threshold})`);
    });
  }

  console.log(`\nOverall: ${overall}`);

  if (hasFailure) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`Unhandled error: ${err.message}`);
  process.exit(1);
});
