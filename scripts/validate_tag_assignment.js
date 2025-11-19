#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929';
const DEFAULT_OUT_DIR = 'tmp/tag_validation';
const TAG_PATTERN = /^[a-z_]+:[a-zA-Z0-9_]+$/;;

function parseArgs(argv) {
  const opts = {
    tag: null,
    game: null,
    model: DEFAULT_MODEL,
    outDir: DEFAULT_OUT_DIR,
    verbose: false,
    interactive: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--tag') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --tag');
      }
      opts.tag = argv[i + 1];
      i += 1;
    } else if (arg === '--game') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --game');
      }
      opts.game = argv[i + 1];
      i += 1;
    } else if (arg === '--model') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --model');
      }
      opts.model = argv[i + 1];
      i += 1;
    } else if (arg === '--out-dir') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --out-dir');
      }
      opts.outDir = argv[i + 1];
      i += 1;
    } else if (arg === '--verbose') {
      opts.verbose = true;
    } else if (arg === '--interactive') {
      opts.interactive = true;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }
  return opts;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((ch === ',' || ch === '\r' || ch === '\n') && !inQuotes) {
      row.push(cell);
      cell = '';
      if (ch === '\r' && text[i + 1] === '\n') {
        i += 1;
      }
      if (ch === '\r' || ch === '\n') {
        rows.push(row);
        row = [];
      }
    } else {
      cell += ch;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows.filter((r) => r.length && !(r.length === 1 && r[0] === ''));
}

function buildPrompt(tagInfo, gameCode, gameSlug) {
  return `# Tag Assignment Validation

You are validating whether a game's code correctly matches a tag definition.

## Tag Definition
**Tag**: ${tagInfo.tag}
**Typical Game**: ${tagInfo.typicalGame}
**Overview**: ${tagInfo.overview}
**Description**: ${tagInfo.description}

## Game to Validate
**Game Slug**: ${gameSlug}
**Source Code**:
\`\`\`javascript
${gameCode}
\`\`\`

## Analysis Task
**OBJECTIVE: Identify implementation variants for this tag, NOT validate tag assignment**

**ASSUMPTION: The tag assignment is correct.** Your task is to analyze HOW this game implements the tag mechanic.

**Tag Definition Interpretation Guidelines:**
- "Player character rotates" includes: visual rotation, attached components rotating, rotation-based aiming, orbital movement, any rotation affecting player control
- "Player bounces" includes: collision-triggered bounces (even if conditional), gravity-based jumps, any repeated vertical motion pattern
- Tags describe GAME DESIGN PATTERNS, not literal code implementations
- Different visual/mechanical representations of the same pattern are VARIANTS, not mismatches

**Analysis Focus:**
1. **How is this mechanic implemented?** (visual rotation vs orbital movement vs attached component)
2. **What are the unique characteristics?** (timing-based, physics-based, collision-triggered, etc.)
3. **How does it differ from other implementations of the same tag?**
4. **What dependencies or patterns make this variant distinct?**

Respond ONLY with valid JSON in the following format (no markdown, no code fences):
{
  "implementation_approach": "brief description of how this game implements the tag mechanic",
  "variant_characteristics": ["characteristic 1", "characteristic 2", ...],
  "dependencies": ["dependency 1", "dependency 2", ...],
  "gameplay_context": "how this implementation affects gameplay",
  "variant_type": "concise name for this implementation pattern (e.g. 'visual-rotation-only', 'orbital-movement', 'attached-component')",
  "similar_to_typical": true or false (is this similar to the typical game mentioned in tag definition?),
  "uniqueness_score": 0.0 to 1.0 (how unique is this implementation compared to expected patterns)
}

**Remember: You are identifying VARIANTS, not validating correctness. All assigned games are assumed to be correct implementations of the tag.**

Respond with JSON only:`;
}

async function callLLM(prompt, model) {
  // Simple implementation: write prompt to temp file and use stdin
  const { randomBytes } = require('crypto');
  const tmpPath = path.join('/tmp', `llm_prompt_${randomBytes(8).toString('hex')}.txt`);

  try {
    await fs.writeFile(tmpPath, prompt, 'utf8');

    return new Promise((resolve, reject) => {
      const proc = spawn('bash', ['-c', `cat "${tmpPath}" | claude --print --model "${model}"`], {
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', async (code) => {
        // Clean up temp file
        try {
          await fs.unlink(tmpPath);
        } catch (err) {
          // Ignore cleanup errors
        }

        if (code !== 0) {
          reject(new Error(`LLM call failed with code ${code}: ${stderr}`));
        } else {
          resolve(stdout.trim());
        }
      });

      proc.on('error', (err) => {
        reject(err);
      });
    });
  } catch (err) {
    // Clean up on error
    try {
      await fs.unlink(tmpPath);
    } catch (e) {
      // Ignore cleanup errors
    }
    throw err;
  }
}

function extractJSON(text) {
  // Remove markdown code fences if present
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');

  // Try to find JSON object
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('No JSON object found in response');
  }

  const parsed = JSON.parse(match[0]);

  // Normalize to new format if old format detected
  if (parsed.matches !== undefined) {
    // Old validation format - convert to variant extraction format
    return {
      implementation_approach: parsed.reasoning || 'Not analyzed',
      variant_characteristics: parsed.evidence_supporting || [],
      dependencies: [],
      gameplay_context: parsed.gameplay_context || 'Not analyzed',
      variant_type: parsed.variant_type || 'standard',
      similar_to_typical: parsed.matches || false,
      uniqueness_score: parsed.confidence ? 1 - parsed.confidence : 0.5,
    };
  }

  return parsed;
}

async function main() {
  const argv = process.argv.slice(2);
  let options;
  try {
    options = parseArgs(argv);
  } catch (err) {
    console.error(`Argument error: ${err.message}`);
    console.error('\nUsage: node validate_tag_assignment.js --tag <tag> [--game <slug>] [options]');
    console.error('Options:');
    console.error('  --tag <tag>        Tag to validate (required)');
    console.error('  --game <slug>      Specific game to validate (optional, validates all if not specified)');
    console.error('  --model <model>    LLM model to use (default: claude-sonnet-4-5-20250929)');
    console.error('  --out-dir <dir>    Output directory (default: tmp/tag_validation)');
    console.error('  --verbose          Verbose output');
    console.error('  --interactive      Pause for review after each validation');
    process.exit(1);
  }

  if (!options.tag) {
    console.error('Error: --tag is required');
    process.exit(1);
  }

  if (!TAG_PATTERN.test(options.tag)) {
    console.error(`Error: Invalid tag format: ${options.tag}`);
    process.exit(1);
  }

  const rootDir = path.resolve(__dirname, '..');
  const tagsCsvPath = path.join(rootDir, 'reference', 'tags.csv');
  const tagMapPath = path.join(rootDir, 'knowledge', 'tag_code_map.json');
  const gamesDir = path.join(rootDir, 'reference', 'games');

  // Read tags.csv to get tag definition
  const tagsCsvText = await fs.readFile(tagsCsvPath, 'utf8');
  const tagsCsvRows = parseCsv(tagsCsvText);
  const tagsHeader = tagsCsvRows[0];
  const tagIndex = tagsHeader.indexOf('tag');
  const typicalGameIndex = tagsHeader.indexOf('typical game');
  const overviewIndex = tagsHeader.indexOf('overview');
  const descriptionIndex = tagsHeader.indexOf('description');

  const tagRow = tagsCsvRows.slice(1).find((row) => row[tagIndex] === options.tag);
  if (!tagRow) {
    console.error(`Error: Tag not found in reference/tags.csv: ${options.tag}`);
    process.exit(1);
  }

  const tagInfo = {
    tag: options.tag,
    typicalGame: tagRow[typicalGameIndex] || '',
    overview: tagRow[overviewIndex] || '',
    description: tagRow[descriptionIndex] || '',
  };

  // Read tag_code_map.json to get assigned games
  const tagMapText = await fs.readFile(tagMapPath, 'utf8');
  const tagCodeMap = JSON.parse(tagMapText);
  const assignedGames = tagCodeMap[options.tag] || [];

  if (!assignedGames.length) {
    console.error(`Error: No games assigned to tag: ${options.tag}`);
    process.exit(1);
  }

  // Filter to specific game if requested
  const gamesToValidate = options.game
    ? assignedGames.filter((g) => g.slug === options.game)
    : assignedGames;

  if (!gamesToValidate.length) {
    console.error(`Error: Game not found in tag assignments: ${options.game}`);
    process.exit(1);
  }

  console.log(`Validating ${gamesToValidate.length} game(s) for tag: ${options.tag}`);
  console.log('');

  const results = [];

  for (const gameEntry of gamesToValidate) {
    const gameSlug = gameEntry.slug || gameEntry.game;
    const gameFile = gameEntry.file;

    console.log(`Validating: ${gameSlug} (${gameFile})`);

    // Read game source code
    const gameCodePath = path.join(rootDir, gameFile);
    let gameCode;
    try {
      gameCode = await fs.readFile(gameCodePath, 'utf8');
    } catch (err) {
      console.error(`  ✗ Failed to read game file: ${err.message}`);
      results.push({
        slug: gameSlug,
        file: gameFile,
        error: `Failed to read file: ${err.message}`,
      });
      continue;
    }

    // Build prompt and call LLM
    const prompt = buildPrompt(tagInfo, gameCode, gameSlug);

    if (options.verbose) {
      console.log('  Calling LLM...');
    }

    let response;
    try {
      response = await callLLM(prompt, options.model);
    } catch (err) {
      console.error(`  ✗ LLM call failed: ${err.message}`);
      results.push({
        slug: gameSlug,
        file: gameFile,
        error: `LLM call failed: ${err.message}`,
      });
      continue;
    }

    // Parse response
    let validation;
    try {
      validation = extractJSON(response);
    } catch (err) {
      console.error(`  ✗ Failed to parse LLM response: ${err.message}`);
      if (options.verbose) {
        console.log('  Raw response:', response);
      }
      results.push({
        slug: gameSlug,
        file: gameFile,
        error: `Failed to parse response: ${err.message}`,
        raw_response: response,
      });
      continue;
    }

    // Display result
    const uniqueness = (validation.uniqueness_score * 100).toFixed(0);
    const icon = validation.similar_to_typical ? '≈' : '◆';
    console.log(`  ${icon} Variant: ${validation.variant_type} (uniqueness: ${uniqueness}%)`);

    if (validation.implementation_approach) {
      console.log(`  Implementation: ${validation.implementation_approach}`);
    }

    if (validation.variant_characteristics && validation.variant_characteristics.length > 0) {
      console.log('  Characteristics:');
      validation.variant_characteristics.forEach((e) => console.log(`    • ${e}`));
    }

    if (validation.dependencies && validation.dependencies.length > 0) {
      console.log('  Dependencies:');
      validation.dependencies.forEach((e) => console.log(`    - ${e}`));
    }

    if (validation.gameplay_context) {
      console.log(`  Gameplay: ${validation.gameplay_context}`);
    }

    console.log('');

    results.push({
      slug: gameSlug,
      file: gameFile,
      validation,
    });

    if (options.interactive) {
      // Wait for user input
      process.stdout.write('Press Enter to continue...');
      await new Promise((resolve) => {
        process.stdin.once('data', resolve);
      });
    }
  }

  // Write results to output directory
  await fs.mkdir(options.outDir, { recursive: true });
  const outPath = path.join(
    options.outDir,
    `${options.tag.replace(':', '_')}_${new Date().toISOString().split('T')[0]}.json`
  );
  await fs.writeFile(outPath, JSON.stringify({ tag: options.tag, tagInfo, results }, null, 2), 'utf8');

  console.log(`Results written to: ${outPath}`);
  console.log('');

  // Summary
  const matches = results.filter((r) => r.validation && r.validation.matches);
  const nonMatches = results.filter((r) => r.validation && !r.validation.matches);
  const errors = results.filter((r) => r.error);
  const needReview = results.filter((r) => r.validation && r.validation.recommendation === 'review');

  console.log('=== Summary ===');
  console.log(`Total validated: ${results.length}`);
  console.log(`Matches: ${matches.length}`);
  console.log(`Non-matches: ${nonMatches.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Need review: ${needReview.length}`);
  console.log('');

  if (needReview.length > 0) {
    console.log('Games needing review:');
    needReview.forEach((r) => {
      const conf = r.validation.confidence ? `(${(r.validation.confidence * 100).toFixed(0)}%)` : '';
      console.log(`  - ${r.slug} ${conf}: ${r.validation.reasoning}`);
    });
    console.log('');
  }

  if (nonMatches.length > 0) {
    console.log('Non-matching games (consider removing from tag):');
    nonMatches.forEach((r) => {
      const conf = r.validation.confidence ? `(${(r.validation.confidence * 100).toFixed(0)}%)` : '';
      console.log(`  - ${r.slug} ${conf}: ${r.validation.reasoning}`);
    });
  }
}

main().catch((err) => {
  console.error(`Unhandled error: ${err.message}`);
  process.exit(1);
});
