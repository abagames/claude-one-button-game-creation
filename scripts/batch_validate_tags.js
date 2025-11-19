#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

function parseArgs(argv) {
  const opts = {
    tagsFile: null,
    tags: null,
    outputDir: 'tmp/variant_candidates',
    model: 'claude-sonnet-4-5-20250929',
    parallel: 1,
    verbose: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--tags-file') {
      if (i + 1 >= argv.length) throw new Error('Missing value for --tags-file');
      opts.tagsFile = argv[i + 1];
      i += 1;
    } else if (arg === '--tags') {
      if (i + 1 >= argv.length) throw new Error('Missing value for --tags');
      opts.tags = argv[i + 1];
      i += 1;
    } else if (arg === '--output-dir') {
      if (i + 1 >= argv.length) throw new Error('Missing value for --output-dir');
      opts.outputDir = argv[i + 1];
      i += 1;
    } else if (arg === '--model') {
      if (i + 1 >= argv.length) throw new Error('Missing value for --model');
      opts.model = argv[i + 1];
      i += 1;
    } else if (arg === '--parallel') {
      if (i + 1 >= argv.length) throw new Error('Missing value for --parallel');
      opts.parallel = parseInt(argv[i + 1], 10);
      i += 1;
    } else if (arg === '--verbose') {
      opts.verbose = true;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return opts;
}

function runValidation(tag, model, rootDir) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(rootDir, 'scripts', 'validate_tag_assignment.js');
    const proc = spawn('node', [scriptPath, '--tag', tag, '--model', model, '--out-dir', path.join(rootDir, 'tmp', 'tag_validation')], {
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

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Validation failed for ${tag}: ${stderr}`));
      } else {
        resolve({ tag, stdout, stderr });
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function processInBatches(tags, batchSize, processor) {
  const results = [];
  for (let i = 0; i < tags.length; i += batchSize) {
    const batch = tags.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  return results;
}

async function main() {
  const argv = process.argv.slice(2);
  let options;
  try {
    options = parseArgs(argv);
  } catch (err) {
    console.error(`Argument error: ${err.message}`);
    console.error('\nUsage: node batch_validate_tags.js [options]');
    console.error('Options:');
    console.error('  --tags-file <file>    File containing tags (one per line)');
    console.error('  --tags <tag,tag,...>  Comma-separated list of tags');
    console.error('  --output-dir <dir>    Output directory (default: tmp/variant_candidates)');
    console.error('  --model <model>       LLM model (default: claude-sonnet-4-5-20250929)');
    console.error('  --parallel <n>        Number of parallel validations (default: 1)');
    console.error('  --verbose             Verbose output');
    process.exit(1);
  }

  if (!options.tagsFile && !options.tags) {
    console.error('Error: Either --tags-file or --tags is required');
    process.exit(1);
  }

  const rootDir = path.resolve(__dirname, '..');
  let tags = [];

  if (options.tagsFile) {
    const filePath = path.isAbsolute(options.tagsFile)
      ? options.tagsFile
      : path.join(rootDir, options.tagsFile);
    const content = await fs.readFile(filePath, 'utf8');
    tags = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && !line.startsWith('='));
  } else {
    tags = options.tags.split(',').map((t) => t.trim());
  }

  if (!tags.length) {
    console.error('Error: No tags to validate');
    process.exit(1);
  }

  console.log(`Batch validating ${tags.length} tags with parallelism=${options.parallel}`);
  console.log('');

  const startTime = Date.now();
  const allResults = [];
  const errors = [];

  const processor = async (tag) => {
    if (options.verbose) {
      console.log(`Starting validation: ${tag}`);
    }
    try {
      const result = await runValidation(tag, options.model, rootDir);
      if (options.verbose) {
        console.log(`Completed validation: ${tag}`);
      }
      return { success: true, tag, result };
    } catch (err) {
      console.error(`✗ Failed: ${tag} - ${err.message}`);
      errors.push({ tag, error: err.message });
      return { success: false, tag, error: err.message };
    }
  };

  const results = await processInBatches(tags, options.parallel, processor);

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log('');
  console.log('=== Batch Validation Summary ===');
  console.log(`Total tags: ${tags.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Duration: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
  console.log('');

  // Aggregate variant candidates
  const variantCandidates = [];
  const tagSummary = [];

  for (const result of successful) {
    const { tag } = result;
    // Read the validation result JSON
    const jsonPath = path.join(
      rootDir,
      'tmp',
      'tag_validation',
      `${tag.replace(':', '_')}_${new Date().toISOString().split('T')[0]}.json`
    );

    try {
      const jsonContent = await fs.readFile(jsonPath, 'utf8');
      const validation = JSON.parse(jsonContent);

      const matches = validation.results.filter((r) => r.validation && r.validation.matches);
      const variants = validation.results
        .filter((r) => r.validation && r.validation.variant_type)
        .map((r) => ({
          tag,
          game: r.slug,
          variantType: r.validation.variant_type,
          confidence: r.validation.confidence,
          gameplayContext: r.validation.gameplay_context,
        }));

      tagSummary.push({
        tag,
        totalGames: validation.results.length,
        matches: matches.length,
        nonMatches: validation.results.length - matches.length,
        variants: variants.length,
      });

      variantCandidates.push(...variants);
    } catch (err) {
      console.error(`Warning: Could not read validation result for ${tag}: ${err.message}`);
    }
  }

  // Write summary report
  const outputDir = path.isAbsolute(options.outputDir)
    ? options.outputDir
    : path.join(rootDir, options.outputDir);
  await fs.mkdir(outputDir, { recursive: true });

  const summaryPath = path.join(outputDir, `summary_${new Date().toISOString().split('T')[0]}.md`);
  const summaryLines = [];

  summaryLines.push('# Batch Tag Validation Summary');
  summaryLines.push('');
  summaryLines.push(`- Date: ${new Date().toISOString()}`);
  summaryLines.push(`- Tags validated: ${tags.length}`);
  summaryLines.push(`- Successful: ${successful.length}`);
  summaryLines.push(`- Failed: ${failed.length}`);
  summaryLines.push(`- Total variant candidates identified: ${variantCandidates.length}`);
  summaryLines.push('');

  summaryLines.push('## Tag Summary');
  summaryLines.push('');
  summaryLines.push('| Tag | Total Games | Matches | Non-Matches | Variants |');
  summaryLines.push('|-----|-------------|---------|-------------|----------|');
  for (const summary of tagSummary) {
    summaryLines.push(
      `| ${summary.tag} | ${summary.totalGames} | ${summary.matches} | ${summary.nonMatches} | ${summary.variants} |`
    );
  }
  summaryLines.push('');

  summaryLines.push('## Variant Candidates');
  summaryLines.push('');
  for (const variant of variantCandidates) {
    summaryLines.push(`### ${variant.tag} - ${variant.game}`);
    summaryLines.push(`- **Variant Type**: ${variant.variantType}`);
    summaryLines.push(`- **Confidence**: ${(variant.confidence * 100).toFixed(0)}%`);
    summaryLines.push(`- **Gameplay Context**: ${variant.gameplayContext || 'N/A'}`);
    summaryLines.push('');
  }

  if (failed.length > 0) {
    summaryLines.push('## Failed Validations');
    summaryLines.push('');
    for (const fail of failed) {
      summaryLines.push(`- **${fail.tag}**: ${fail.error}`);
    }
    summaryLines.push('');
  }

  await fs.writeFile(summaryPath, summaryLines.join('\n'), 'utf8');
  console.log(`Summary report written to: ${summaryPath}`);

  // Write variant candidates JSON
  const candidatesPath = path.join(outputDir, `variant_candidates_${new Date().toISOString().split('T')[0]}.json`);
  await fs.writeFile(candidatesPath, JSON.stringify({ tags: tagSummary, variants: variantCandidates }, null, 2), 'utf8');
  console.log(`Variant candidates JSON written to: ${candidatesPath}`);
}

main().catch((err) => {
  console.error(`Unhandled error: ${err.message}`);
  process.exit(1);
});
