#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');

const PRIORITY_ORDER = {
  high: 3,
  medium: 2,
  low: 1,
  minimal: 0,
};

function parseArgs(argv) {
  const opts = {
    minPriority: 'low',
    output: null,
    format: 'text',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--min-priority') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --min-priority');
      }
      opts.minPriority = argv[i + 1].toLowerCase();
      i += 1;
    } else if (arg === '--output') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --output');
      }
      opts.output = argv[i + 1];
      i += 1;
    } else if (arg === '--format') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --format');
      }
      opts.format = argv[i + 1].toLowerCase();
      i += 1;
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

async function main() {
  const argv = process.argv.slice(2);
  let options;
  try {
    options = parseArgs(argv);
  } catch (err) {
    console.error(`Argument error: ${err.message}`);
    console.error('\nUsage: node list_priority_tags.js [options]');
    console.error('Options:');
    console.error('  --min-priority <level>  Minimum priority level (high|medium|low|minimal) (default: low)');
    console.error('  --output <file>         Output file path (default: stdout)');
    console.error('  --format <format>       Output format (text|json|csv) (default: text)');
    process.exit(1);
  }

  if (!PRIORITY_ORDER.hasOwnProperty(options.minPriority)) {
    console.error(`Error: Invalid priority level: ${options.minPriority}`);
    console.error('Valid levels: high, medium, low, minimal');
    process.exit(1);
  }

  const rootDir = path.resolve(__dirname, '..');
  const tagsCsvPath = path.join(rootDir, 'src', 'tags.csv');

  const tagsCsvText = await fs.readFile(tagsCsvPath, 'utf8');
  const tagsCsvRows = parseCsv(tagsCsvText);
  const header = tagsCsvRows[0];

  const tagIndex = header.indexOf('tag');
  const typicalGameIndex = header.indexOf('typical game');
  const overviewIndex = header.indexOf('overview');
  const descriptionIndex = header.indexOf('description');
  const priorityIndex = header.indexOf('priority');

  if (tagIndex === -1 || priorityIndex === -1) {
    console.error('Error: Missing required columns in tags.csv');
    process.exit(1);
  }

  const minPriorityValue = PRIORITY_ORDER[options.minPriority];
  const filteredTags = [];

  for (const row of tagsCsvRows.slice(1)) {
    const tag = row[tagIndex];
    const priority = row[priorityIndex] || 'minimal';
    const priorityValue = PRIORITY_ORDER[priority.toLowerCase()] || 0;

    if (priorityValue >= minPriorityValue) {
      filteredTags.push({
        tag,
        typicalGame: row[typicalGameIndex] || '',
        overview: row[overviewIndex] || '',
        description: row[descriptionIndex] || '',
        priority,
        priorityValue,
      });
    }
  }

  // Sort by priority (high to low) then by tag name
  filteredTags.sort((a, b) => {
    if (b.priorityValue !== a.priorityValue) {
      return b.priorityValue - a.priorityValue;
    }
    return a.tag.localeCompare(b.tag);
  });

  let output = '';

  if (options.format === 'json') {
    output = JSON.stringify(
      {
        minPriority: options.minPriority,
        count: filteredTags.length,
        tags: filteredTags,
      },
      null,
      2
    );
  } else if (options.format === 'csv') {
    output = 'tag,typical game,priority,overview,description\n';
    for (const tag of filteredTags) {
      const escapeCsv = (val) => {
        if (!val) return '';
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };
      output += `${escapeCsv(tag.tag)},${escapeCsv(tag.typicalGame)},${escapeCsv(tag.priority)},${escapeCsv(tag.overview)},${escapeCsv(tag.description)}\n`;
    }
  } else {
    // text format
    output = `Priority Tags (>= ${options.minPriority})\n`;
    output += `Total: ${filteredTags.length}\n\n`;

    let currentPriority = null;
    for (const tag of filteredTags) {
      if (tag.priority !== currentPriority) {
        currentPriority = tag.priority;
        output += `\n=== ${currentPriority.toUpperCase()} ===\n`;
      }
      output += `${tag.tag}\n`;
    }
  }

  if (options.output) {
    const outPath = path.isAbsolute(options.output)
      ? options.output
      : path.join(rootDir, options.output);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, output, 'utf8');
    console.log(`Written ${filteredTags.length} tags to ${outPath}`);
  } else {
    console.log(output);
  }
}

main().catch((err) => {
  console.error(`Unhandled error: ${err.message}`);
  process.exit(1);
});
