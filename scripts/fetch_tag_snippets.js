#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');

const DEFAULT_OUT_PATH = 'tmp/agent_context/agent_context.md';
const DEFAULT_FORMAT = 'markdown';
const DEFAULT_LOG_SLUG = 'fetch-tag-snippets';
const TAG_PATTERN = /^[a-z]+:[a-z0-9_]+$/;

function parseArgs(argv) {
  const opts = {
    out: DEFAULT_OUT_PATH,
    format: DEFAULT_FORMAT,
    log: DEFAULT_LOG_SLUG,
    verbose: false,
    forcePartial: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--tags') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --tags');
      }
      opts.tagsRaw = argv[i + 1];
      i += 1;
    } else if (arg === '--out') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --out');
      }
      opts.out = argv[i + 1];
      i += 1;
    } else if (arg === '--format') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --format');
      }
      opts.format = argv[i + 1].toLowerCase();
      i += 1;
    } else if (arg === '--log') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --log');
      }
      opts.log = argv[i + 1];
      i += 1;
    } else if (arg === '--verbose') {
      opts.verbose = true;
    } else if (arg === '--force-partial') {
      opts.forcePartial = true;
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

function formatDateParts(date) {
  const pad = (v) => v.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return { yyyy, mm, dd, hh, min, ss };
}

function parseSnippetMarkdown(content) {
  const lines = content.split(/\r?\n/);
  const headerLine = lines[0] || '';
  let index = 1;
  const metadataLines = [];
  while (index < lines.length && !lines[index].startsWith('## ')) {
    metadataLines.push(lines[index]);
    index += 1;
  }
  const sections = {};
  let currentSection = null;
  let buffer = [];
  for (; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith('## ')) {
      if (currentSection !== null) {
        sections[currentSection] = buffer.join('\n').trim();
      }
      currentSection = line.slice(3).trim();
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  if (currentSection !== null) {
    sections[currentSection] = buffer.join('\n').trim();
  }
  return {
    headerLine: headerLine.trim(),
    metadata: metadataLines.join('\n').trim(),
    sections,
  };
}

function extractSnippetLineCount(sectionContent) {
  if (!sectionContent) {
    return null;
  }
  const match = sectionContent.match(/```[\s\S]*?\n([\s\S]*?)\n```/);
  if (!match) {
    return null;
  }
  const codeBody = match[1];
  return codeBody.split(/\r?\n/).filter((line) => line.trim().length > 0 || line.length > 0).length;
}

function summariseReference(entry) {
  const slug = entry.slug || entry.game || 'unknown';
  const file = entry.file || 'unknown';
  let annotation = '';
  if (Array.isArray(entry.functions) && entry.functions.length > 0) {
    const fn = entry.functions[0];
    if (fn && fn.line) {
      annotation = `${file}:${fn.line}`;
      if (fn.name) {
        annotation += ` (${fn.name})`;
      }
    }
  }
  if (!annotation) {
    annotation = file;
  }
  return `- ${slug} — ${annotation}`;
}

async function ensureDirExists(targetPath) {
  await fs.mkdir(targetPath, { recursive: true });
}

function normaliseTagList(raw) {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function removeHeading(line) {
  if (!line) {
    return '';
  }
  return line.replace(/^#\s*/, '').trim();
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
  if (!options.tagsRaw) {
    console.error('Error: --tags is required');
    process.exit(1);
  }
  if (!['markdown', 'json'].includes(options.format)) {
    console.error('Error: --format must be "markdown" or "json"');
    process.exit(1);
  }

  const rootDir = path.resolve(__dirname, '..');
  const tagsCsvPath = path.join(rootDir, 'reference', 'tags.csv');
  const tagMapPath = path.join(rootDir, 'knowledge', 'tag_code_map.json');
  const snippetsDir = path.join(rootDir, 'knowledge', 'snippets');

  const [csvText, tagMapText] = await Promise.all([
    fs.readFile(tagsCsvPath, 'utf8'),
    fs.readFile(tagMapPath, 'utf8'),
  ]);
  const csvRows = parseCsv(csvText);
  if (!csvRows.length) {
    console.error('Error: reference/tags.csv is empty');
    process.exit(1);
  }
  const header = csvRows[0];
  const tagIndex = header.indexOf('tag');
  if (tagIndex === -1) {
    console.error('Error: reference/tags.csv missing "tag" column');
    process.exit(1);
  }
  const csvTags = new Set(csvRows.slice(1).map((row) => row[tagIndex]).filter((val) => !!val));
  const tagCodeMap = JSON.parse(tagMapText);

  const requestedTags = normaliseTagList(options.tagsRaw);
  const uniqueTags = [];
  const seenTags = new Set();
  const warnings = [];
  const errors = [];
  requestedTags.forEach((tag) => {
    if (!seenTags.has(tag)) {
      seenTags.add(tag);
      uniqueTags.push(tag);
    } else {
      warnings.push(`Duplicate tag ignored: ${tag}`);
    }
  });

  const tagResults = [];
  const skippedTags = [];
  for (const tag of uniqueTags) {
    const tagWarnings = [];
    if (!TAG_PATTERN.test(tag)) {
      errors.push(`Tag does not match expected pattern: ${tag}`);
      continue;
    }
    if (!csvTags.has(tag)) {
      errors.push(`Tag not found in reference/tags.csv: ${tag}`);
      continue;
    }
    const mapping = Array.isArray(tagCodeMap[tag]) ? tagCodeMap[tag] : [];
    if (!mapping.length) {
      errors.push(`No tag_code_map entry for tag: ${tag}`);
      continue;
    }
    const basePath = path.join(snippetsDir, `${tag}.md`);
    let baseContent;
    try {
      baseContent = await fs.readFile(basePath, 'utf8');
    } catch (err) {
      warnings.push(`Snippet file not found (skipped): knowledge/snippets/${tag}.md`);
      skippedTags.push(tag);
      continue;
    }
    const parsedBase = parseSnippetMarkdown(baseContent);
    const snippetLineCount = extractSnippetLineCount(parsedBase.sections.Snippet);
    if (typeof snippetLineCount === 'number' && (snippetLineCount < 20 || snippetLineCount > 40)) {
      tagWarnings.push(`Snippet line count ${snippetLineCount} outside 20-40 range (${tag})`);
    }

    const variants = [];
    try {
      const allFiles = await fs.readdir(snippetsDir, { withFileTypes: true });
      const variantPattern = new RegExp(`^${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}_(.+)\\.md$`);
      for (const entry of allFiles) {
        if (!entry.isFile()) {
          continue;
        }
        const match = entry.name.match(variantPattern);
        if (!match) {
          continue;
        }
        const variantPath = path.join(snippetsDir, entry.name);
        const variantContent = await fs.readFile(variantPath, 'utf8');
        const parsedVariant = parseSnippetMarkdown(variantContent);
        const variantLineCount = extractSnippetLineCount(parsedVariant.sections.Snippet);
        if (typeof variantLineCount === 'number' && (variantLineCount < 20 || variantLineCount > 40)) {
          tagWarnings.push(
            `Variant snippet line count ${variantLineCount} outside 20-40 range (${entry.name})`,
          );
        }
        variants.push({
          path: path.relative(rootDir, variantPath),
          title: removeHeading(parsedVariant.headerLine),
          metadata: parsedVariant.metadata,
          sections: parsedVariant.sections,
          snippetLineCount: variantLineCount,
          variantName: match[1],
        });
      }
    } catch (err) {
      errors.push(`Failed reading variants for ${tag}: ${err.message}`);
      continue;
    }

    tagResults.push({
      tag,
      basePath: path.relative(rootDir, basePath),
      parsedBase,
      snippetLineCount,
      variants,
      references: mapping.map(summariseReference),
      warnings: tagWarnings,
    });
    warnings.push(...tagWarnings);
  }

  const now = new Date();
  const { yyyy, mm, dd, hh, min, ss } = formatDateParts(now);
  const isoTimestamp = `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;

  let output = '';
  if (options.format === 'markdown') {
    const lines = [];
    lines.push('# Tag Snippet Context');
    lines.push(`- Generated: ${isoTimestamp}`);
    lines.push(`- Tags requested: ${uniqueTags.length}`);
    lines.push(`- Tags included: ${tagResults.length}`);
    if (skippedTags.length) {
      lines.push(`- Tags skipped (no snippet): ${skippedTags.length}`);
    }
    lines.push('');
    if (skippedTags.length) {
      lines.push('## Skipped Tags (No Snippet File)');
      skippedTags.forEach((t) => lines.push(`- ${t}`));
      lines.push('');
      lines.push('_Note: Game generation can proceed without these snippets. They will be generated based on tag definitions and existing game patterns._');
      lines.push('');
    }
    if (warnings.length) {
      lines.push('## Warnings');
      warnings.forEach((w) => lines.push(`- ${w}`));
      lines.push('');
    }
    if (errors.length) {
      lines.push('## Errors');
      errors.forEach((e) => lines.push(`- ${e}`));
      lines.push('');
    }
    for (const result of tagResults) {
      lines.push(`## ${result.tag}`);
      lines.push('');
      lines.push('### Reference Games');
      result.references.forEach((ref) => lines.push(ref));
      if (!result.references.length) {
        lines.push('- (none)');
      }
      lines.push('');
      lines.push(`### Base Snippet (${result.basePath})`);
      if (result.parsedBase.metadata) {
        lines.push(result.parsedBase.metadata);
        lines.push('');
      }
      ['Snippet', 'Dependencies', 'Integration Notes', 'Validation'].forEach((sectionName) => {
        const sectionContent = result.parsedBase.sections[sectionName];
        if (sectionContent) {
          lines.push(`#### ${sectionName}`);
          lines.push(sectionContent);
          lines.push('');
        }
      });
      if (result.variants.length) {
        lines.push('### Variants');
        for (const variant of result.variants) {
          lines.push(`#### ${variant.title || variant.path}`);
          lines.push(`_Source: ${variant.path}_`);
          if (variant.metadata) {
            lines.push(variant.metadata);
            lines.push('');
          }
          ['Snippet', 'Dependencies', 'Integration Notes', 'Validation'].forEach((sectionName) => {
            const sectionContent = variant.sections[sectionName];
            if (sectionContent) {
              lines.push(`##### ${sectionName}`);
              lines.push(sectionContent);
              lines.push('');
            }
          });
        }
      }
      lines.push('');
    }
    output = lines.join('\n');
  } else {
    const jsonPayload = {
      generated: isoTimestamp,
      requestedTags: uniqueTags,
      skippedTags,
      warnings,
      errors,
      tags: tagResults.map((result) => ({
        tag: result.tag,
        basePath: result.basePath,
        metadata: result.parsedBase.metadata,
        sections: result.parsedBase.sections,
        snippetLineCount: result.snippetLineCount,
        variants: result.variants,
        references: result.references,
      })),
    };
    output = `${JSON.stringify(jsonPayload, null, 2)}\n`;
  }

  if (tagResults.length > 0 || options.forcePartial) {
    const outPath = path.isAbsolute(options.out)
      ? options.out
      : path.join(rootDir, options.out);
    await ensureDirExists(path.dirname(outPath));
    await fs.writeFile(outPath, output, 'utf8');
    if (options.verbose) {
      console.log(`Wrote ${options.format} output to ${outPath}`);
    }
  }

  const logDate = `${yyyy}${mm}${dd}`;
  const logFileName = `${logDate}-${options.log}.md`;
  const logPath = path.join(rootDir, 'knowledge', 'logs', logFileName);
  await ensureDirExists(path.dirname(logPath));
  const logLines = [];
  logLines.push(`# Fetch Tag Snippets — ${isoTimestamp}`);
  logLines.push('');
  logLines.push(`- Command: \`node scripts/fetch_tag_snippets.js ${argv.join(' ')}\``);
  logLines.push(`- Output: ${options.out}`);
  logLines.push(`- Format: ${options.format}`);
  logLines.push(`- Tags requested: ${uniqueTags.length}`);
  logLines.push(`- Tags included: ${tagResults.length}`);
  if (skippedTags.length) {
    logLines.push(`- Tags skipped (no snippet): ${skippedTags.length} (${skippedTags.join(', ')})`);
  }
  if (warnings.length) {
    logLines.push('- Warnings:');
    warnings.forEach((w) => logLines.push(`  - ${w}`));
  } else {
    logLines.push('- Warnings: none');
  }
  if (errors.length) {
    logLines.push('- Errors:');
    errors.forEach((e) => logLines.push(`  - ${e}`));
  } else {
    logLines.push('- Errors: none');
  }
  logLines.push('');
  await fs.appendFile(logPath, `${logLines.join('\n')}\n\n---\n\n`, 'utf8');

  if (errors.length && !options.forcePartial) {
    console.error('Errors encountered while processing tags:');
    errors.forEach((e) => console.error(`- ${e}`));
    process.exit(1);
  }
  if (warnings.length && options.verbose) {
    warnings.forEach((w) => console.warn(`Warning: ${w}`));
  }
}

main().catch((err) => {
  console.error(`Unhandled error: ${err.message}`);
  process.exit(1);
});
