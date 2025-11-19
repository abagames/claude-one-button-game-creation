#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const opts = { frames: 600, seed: 0 };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--slug') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --slug');
      }
      opts.slug = argv[i + 1];
      i += 1;
    } else if (arg === '--frames') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --frames');
      }
      opts.frames = Number(argv[i + 1]);
      i += 1;
    } else if (arg === '--seed') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --seed');
      }
      opts.seed = Number(argv[i + 1]);
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

function assertSlugFormat(slug) {
  if (!/^[a-z0-9_]+$/.test(slug)) {
    throw new Error(`Invalid slug format: ${slug}`);
  }
}

function run() {
  const argv = process.argv.slice(2);
  let options;
  try {
    options = parseArgs(argv);
  } catch (err) {
    console.error(`Argument error: ${err.message}`);
    process.exit(1);
  }
  try {
    assertSlugFormat(options.slug);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const gamePath = path.join(__dirname, '..', 'reference', 'games', `${options.slug}.js`);
  if (!fs.existsSync(gamePath)) {
    console.error(`Game file not found: reference/games/${options.slug}.js`);
    process.exit(1);
  }

  const report = {
    slug: options.slug,
    framesSimulated: options.frames,
    seed: options.seed,
    avgScore: null,
    fallEvents: 0,
    warnings: ['Simulator stub: implement gameplay checks'],
    timestamp: new Date().toISOString(),
  };

  console.log(JSON.stringify(report, null, 2));
}

run();
