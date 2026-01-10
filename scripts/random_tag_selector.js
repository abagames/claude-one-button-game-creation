#!/usr/bin/env node
/**
 * Random Tag Selector for One-Button Game Generation
 *
 * 完全ランダムでタグを選択し、ゲーム設計の「シード」として出力する。
 * タグは設計仕様ではなく発想の起点として機能する。
 *
 * Usage:
 *   node scripts/random_tag_selector.js [options]
 *
 * Options:
 *   -n, --count <number>   選択するタグ数 (default: 3)
 *   -s, --seed <number>    乱数シード (省略時は現在時刻)
 *   -f, --format <type>    出力形式: text, json, markdown (default: markdown)
 *   -h, --help             ヘルプを表示
 */

const fs = require("fs");
const path = require("path");

// Xorshift128 PRNG (再現性のため)
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

// CSVパース (4カラム固定: name, overview, description, keywords)
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

// タグ読み込み
function loadTags() {
  const csvPath = path.join(__dirname, "..", "tags.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  return parseCSV(content);
}

// タグ選択
function selectTags(tags, count, rng) {
  const shuffled = rng.shuffle(tags);
  return shuffled.slice(0, count);
}

// カテゴリ抽出
function getCategory(name) {
  const parts = name.split("-");
  if (parts[0] === "on") {
    return parts.slice(0, 2).join("_");
  }
  return parts[0];
}

// 出力フォーマット
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
        "## 選択タグ",
        "",
        `**シード**: ${seed}`,
        "",
        "| タグ | カテゴリ | 概要 | 説明 |",
        "|:---|:---|:---|:---|",
      ];

      selectedTags.forEach((t) => {
        lines.push(
          `| \`${t.name}\` | ${getCategory(t.name)} | ${t.overview} | ${t.description} |`
        );
      });

      lines.push("");
      lines.push("### キーワード");
      lines.push("");
      selectedTags.forEach((t) => {
        lines.push(`- **${t.name}**: ${t.keywords}`);
      });

      lines.push("");
      lines.push("## 使用方法");
      lines.push("");
      lines.push("```");
      lines.push(
        "上記タグを one-button-game-design-guide.md §7 の手順に従い、"
      );
      lines.push("ゲーム設計の発想起点として使用してください。");
      lines.push("タグは制約ではなく刺激です。逸脱を恐れないでください。");
      lines.push("```");

      return lines.join("\n");
  }
}

// ヘルプ表示
function showHelp() {
  console.log(`
Random Tag Selector - ワンボタンゲーム生成用タグ選択ツール

Usage:
  node scripts/random_tag_selector.js [options]

Options:
  -n, --count <number>   選択するタグ数 (default: 3)
  -s, --seed <number>    乱数シード (省略時は現在時刻ベース)
  -f, --format <type>    出力形式: text, json, markdown (default: markdown)
  -h, --help             このヘルプを表示

Examples:
  node scripts/random_tag_selector.js
  node scripts/random_tag_selector.js -n 5
  node scripts/random_tag_selector.js -s 12345 -f json
  node scripts/random_tag_selector.js --count 4 --seed 42
`);
}

// 引数パース
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

// メイン
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
