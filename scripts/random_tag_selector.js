#!/usr/bin/env node
/**
 * Random Tag Selector for One-Button Game Generation
 *
 * Randomly selects tags and outputs them as "seeds" for game design.
 * Tags function as inspiration starting points, not design specifications.
 *
 * Usage:
 *   node scripts/random_tag_selector.js [options]
 *
 * Options:
 *   -n, --count <number>   Number of tags to select (default: 3)
 *   -s, --seed <number>    Random seed (uses current time if omitted)
 *   -f, --format <type>    Output format: text, json, markdown (default: markdown)
 *   -h, --help             Show help
 */

const fs = require("fs");
const path = require("path");

// Xorshift128 PRNG (for reproducibility)
class Xorshift128 {
  constructor(seed = Date.now()) {
    this.x = seed >>> 0;
    this.y = 362436069;
    this.z = 521288629;
    this.w = 88675123;
    for (let i = 0; i < 10; i++) this.next();
  }

  next() {
    const t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = (this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;
    return this.w / 0x100000000;
  }

  nextInt(min, max) {
    return Math.floor(min + this.next() * (max - min + 1));
  }

  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// CSV parse (fixed 4 columns: name, overview, description, keywords)
function parseCSV(content) {
  const lines = content.trim().split("\n");
  return lines.slice(1).map((line) => {
    const parts = line.split(",");
    return {
      name: parts[0].trim(),
      overview: parts[1].trim(),
      description: parts[2].trim(),
      keywords: parts.slice(3).join(",").trim(),
    };
  });
}

// Load tags
function loadTags() {
  const csvPath = path.join(__dirname, "..", "tags.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  return parseCSV(content);
}

// Select tags
function selectTags(tags, count, rng) {
  const shuffled = rng.shuffle(tags);
  return shuffled.slice(0, count);
}

// Extract category
function getCategory(name) {
  const parts = name.split("-");
  if (parts[0] === "on") {
    return parts.slice(0, 2).join("_");
  }
  return parts[0];
}

// Output formatting
function formatOutput(selectedTags, seed, format) {
  switch (format) {
    case "json":
      return JSON.stringify(
        {
          seed,
          tags: selectedTags.map((t) => ({
            name: t.name,
            category: getCategory(t.name),
            overview: t.overview,
            description: t.description,
            keywords: t.keywords,
          })),
        },
        null,
        2
      );

    case "text":
      return selectedTags
        .map((t) => `${t.name}: ${t.overview} - ${t.description}`)
        .join("\n");

    case "markdown":
    default:
      const lines = [
        "## Selected Tags",
        "",
        `**Seed**: ${seed}`,
        "",
        "| Tag | Category | Overview | Description |",
        "|:---|:---|:---|:---|",
      ];

      selectedTags.forEach((t) => {
        lines.push(
          `| \`${t.name}\` | ${getCategory(t.name)} | ${t.overview} | ${t.description} |`
        );
      });

      lines.push("");
      lines.push("### Keywords");
      lines.push("");
      selectedTags.forEach((t) => {
        lines.push(`- **${t.name}**: ${t.keywords}`);
      });

      lines.push("");
      lines.push("## Usage");
      lines.push("");
      lines.push("```");
      lines.push(
        "Use the above tags as inspiration starting points for game design,"
      );
      lines.push("following the procedures in one-button-game-design-guide.md §7.");
      lines.push("Tags are stimuli, not constraints. Don't be afraid to deviate.");
      lines.push("```");

      return lines.join("\n");
  }
}

// Show help
function showHelp() {
  console.log(`
Random Tag Selector - Tag selection tool for one-button game generation

Usage:
  node scripts/random_tag_selector.js [options]

Options:
  -n, --count <number>   Number of tags to select (default: 3)
  -s, --seed <number>    Random seed (uses current time if omitted)
  -f, --format <type>    Output format: text, json, markdown (default: markdown)
  -h, --help             Show this help

Examples:
  node scripts/random_tag_selector.js
  node scripts/random_tag_selector.js -n 5
  node scripts/random_tag_selector.js -s 12345 -f json
  node scripts/random_tag_selector.js --count 4 --seed 42
`);
}

// Parse arguments
function parseArgs(args) {
  const options = {
    count: 3,
    seed: Date.now(),
    format: "markdown",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "-n":
      case "--count":
        options.count = parseInt(args[++i], 10);
        break;
      case "-s":
      case "--seed":
        options.seed = parseInt(args[++i], 10);
        break;
      case "-f":
      case "--format":
        options.format = args[++i];
        break;
      case "-h":
      case "--help":
        showHelp();
        process.exit(0);
    }
  }

  return options;
}

// Main
function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.count < 1 || options.count > 10) {
    console.error("Error: count must be between 1 and 10");
    process.exit(1);
  }

  if (!["text", "json", "markdown"].includes(options.format)) {
    console.error("Error: format must be text, json, or markdown");
    process.exit(1);
  }

  const tags = loadTags();
  const rng = new Xorshift128(options.seed);
  const selected = selectTags(tags, options.count, rng);

  console.log(formatOutput(selected, options.seed, options.format));
}

main();
