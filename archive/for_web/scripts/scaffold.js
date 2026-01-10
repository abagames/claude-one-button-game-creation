#!/usr/bin/env node
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { checkProposedGame } = require('./similarity_checker');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT, 'knowledge', 'templates', 'game_base.js');
const GAME_DIR = path.join(ROOT, 'tmp', 'games');
const PROTOTYPE_DIR = path.join(ROOT, 'tmp', 'prototypes');
const TRIAL_DIR = path.join(ROOT, 'tmp', 'trials');
const LOG_DIR = path.join(ROOT, 'knowledge', 'logs');
const METRICS_FILE = path.join(ROOT, 'knowledge', 'metrics', 'tag_combo_history.csv');

function parseArgs(argv) {
  const opts = { force: false, noveltyCheck: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--slug') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --slug');
      }
      opts.slug = argv[i + 1];
      i += 1;
    } else if (arg === '--tags') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --tags');
      }
      opts.tagsRaw = argv[i + 1];
      i += 1;
    } else if (arg === '--force') {
      opts.force = true;
    } else if (arg === '--novelty-check') {
      opts.noveltyCheck = true;
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

function normaliseTags(raw) {
  if (!raw) {
    return [];
  }
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

async function readTemplate() {
  try {
    return await fs.readFile(TEMPLATE_PATH, 'utf8');
  } catch (err) {
    throw new Error(`Template not found at knowledge/templates/game_base.js (${err.message})`);
  }
}

async function ensureMetricsHeader() {
  if (fsSync.existsSync(METRICS_FILE)) {
    return;
  }
  await fs.mkdir(path.dirname(METRICS_FILE), { recursive: true });
  const header = 'date,tags,slug,outcome,notes\n';
  await fs.writeFile(METRICS_FILE, header, 'utf8');
}

async function appendMetricsRow(date, tags, slug) {
  await ensureMetricsHeader();
  const row = [date, `"${tags.join('|')}"`, slug, 'scaffolded', 'initial scaffold stub'];
  await fs.appendFile(METRICS_FILE, `${row.join(',')}\n`, 'utf8');
}

async function findLatestTrial(slug) {
  try {
    const entries = await fs.readdir(TRIAL_DIR);
    const matches = entries
      .filter((name) => name.endsWith(`-${slug}.md`))
      .map((name) => ({ name, path: path.join(TRIAL_DIR, name) }));
    if (!matches.length) {
      return null;
    }
    matches.sort((a, b) => b.name.localeCompare(a.name));
    return matches[0];
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

function extractTagsFromTrial(content) {
  const match = content.match(/Primary Tags:\s*([^\n]+)/);
  if (!match) {
    return [];
  }
  return match[1]
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
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

function applyTemplate(template, slug) {
  const titleValue = slug.replace(/_/g, ' ').toUpperCase();
  return template.replace('"TEMPLATE"', `"${titleValue}"`);
}

async function writeContextFiles(slug, tags, sourcePrompt, timestamp, argv) {
  const dir = path.join(PROTOTYPE_DIR, slug);
  await fs.mkdir(dir, { recursive: true });

  const contextLines = [
    `# Prototype Context — ${slug}`,
    '',
    `- Created: ${timestamp.iso}`,
    `- Tags: ${tags.join(', ') || '(unspecified)'}`,
    `- Source Prompt: ${sourcePrompt || '(manual)'}`,
    `- Scaffold Command: node scripts/scaffold.js ${argv.join(' ')}`,
    '',
  ];
  await fs.writeFile(path.join(dir, 'context.md'), `${contextLines.join('\n')}\n`, 'utf8');

  const runLogLines = [
    `# Scaffold Run — ${timestamp.iso}`,
    `Slug: ${slug}`,
    `Tags: ${tags.join(', ') || '(unspecified)'}`,
    `Source Prompt: ${sourcePrompt || '(manual)'}`,
    'Created Files:',
    `- tmp/prototypes/${slug}/game.js`,
    `- tmp/prototypes/${slug}/context.md`,
    '',
  ];
  await fs.appendFile(path.join(dir, 'scaffold.log'), `${runLogLines.join('\n')}\n---\n`, 'utf8');
}

async function appendGlobalLog(timestamp, slug, tags, argv, noveltyReport) {
  await fs.mkdir(LOG_DIR, { recursive: true });
  const logFile = path.join(LOG_DIR, `${timestamp.logDate}-scaffold.md`);
  const payload = [
    `# Scaffold Entry — ${timestamp.iso}`,
    `- Slug: ${slug}`,
    `- Tags: ${tags.join(', ') || '(unspecified)'}`,
    `- Command: node scripts/scaffold.js ${argv.join(' ')}`,
    '',
  ];

  if (noveltyReport) {
    payload.push('## Novelty Check Results');
    payload.push(`- Verdict: ${noveltyReport.overallVerdict}`);
    payload.push(`- Max Similarity: ${(noveltyReport.maxSimilarity * 100).toFixed(1)}%`);
    payload.push(`- Recommendations: ${noveltyReport.recommendations.join('; ')}`);
    payload.push('');
  }

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

  const template = await readTemplate();

  const gamePath = path.join(PROTOTYPE_DIR, options.slug, 'game.js');
  if (!options.force && fsSync.existsSync(gamePath)) {
    console.error(`Game file already exists. Use --force to overwrite: tmp/prototypes/${options.slug}/game.js`);
    process.exit(1);
  }

  let tags = normaliseTags(options.tagsRaw);
  let sourcePrompt = null;
  if (!tags.length) {
    const trial = await findLatestTrial(options.slug);
    if (!trial) {
      console.error('No tags provided and no prompt trial file found. Supply --tags.');
      process.exit(1);
    }
    const content = await fs.readFile(trial.path, 'utf8');
    tags = extractTagsFromTrial(content);
    sourcePrompt = path.relative(ROOT, trial.path);
    if (!tags.length) {
      console.error(`Could not extract Primary Tags from ${trial.name}. Supply --tags manually.`);
      process.exit(1);
    }
  }

  const timestamp = formatTimestamp(new Date());

  let noveltyReport = null;
  if (options.noveltyCheck) {
    console.log('Running novelty check...');
    const proposedGame = {
      title: options.slug.replace(/_/g, ' '),
      tags: tags,
      mechanics: [],
      victoryCondition: '',
      playerControl: ''
    };

    noveltyReport = checkProposedGame(proposedGame);
    console.log(`Novelty Check: ${noveltyReport.overallVerdict}`);
    console.log(`Max Similarity: ${(noveltyReport.maxSimilarity * 100).toFixed(1)}%`);
    console.log(`Recommendations: ${noveltyReport.recommendations.join(', ')}`);

    if (noveltyReport.overallVerdict === 'REJECTED' && !options.force) {
      console.error('\nNovelty check FAILED. Game is too similar to existing games.');
      console.error('Use --force to proceed anyway.');
      process.exit(1);
    }
  }

  const gameContent = applyTemplate(template, options.slug);
  await fs.mkdir(path.dirname(gamePath), { recursive: true });
  await fs.writeFile(gamePath, gameContent, 'utf8');

  await writeContextFiles(options.slug, tags, sourcePrompt, timestamp, argv);
  await appendGlobalLog(timestamp, options.slug, tags, argv, noveltyReport);
  await appendMetricsRow(timestamp.date, tags, options.slug);

  console.log(`Scaffolded prototype for ${options.slug}`);
}

main().catch((err) => {
  console.error(`Unhandled error: ${err.message}`);
  process.exit(1);
});
