#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--slug') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --slug');
      }
      opts.slug = argv[i + 1];
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

  assertSlugFormat(options.slug);

  // Determine game file path: use --file if provided, otherwise default to reference/games
  let gamePath;
  if (options.file) {
    gamePath = path.isAbsolute(options.file)
      ? options.file
      : path.join(__dirname, '..', options.file);

    if (!fs.existsSync(gamePath)) {
      console.error(`Game file not found: ${options.file}`);
      process.exit(1);
    }
  } else {
    gamePath = path.join(__dirname, '..', 'reference', 'games', `${options.slug}.js`);
    if (!fs.existsSync(gamePath)) {
      console.error(`Game file not found: reference/games/${options.slug}.js`);
      process.exit(1);
    }
  }

  const content = fs.readFileSync(gamePath, 'utf8');
  const findings = [];
  // Support both "title = ..." and "var title = ..." (for transpiled TypeScript)
  if (!/^(var |let |const )?title\s*=\s*".+";/m.test(content)) {
    findings.push('Missing title assignment');
  }
  if (!/function\s+update\s*\(/.test(content)) {
    findings.push('Missing update() function');
  }
  // Support both "options = ..." and "var options = ..." (for transpiled TypeScript)
  if (!/^(var |let |const )?options\s*=\s*{[\s\S]*};/m.test(content)) {
    findings.push('Missing options object');
  }

  if (findings.length) {
    console.error('Style check failed:');
    findings.forEach((f) => console.error(`- ${f}`));
    process.exit(1);
  }

  console.log(`Style check passed for ${options.slug}`);
}

run();
