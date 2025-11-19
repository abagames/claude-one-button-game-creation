#!/usr/bin/env node
const fs = require("fs/promises");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const GAMES_DIR = path.join(SRC_DIR, "games");
const KNOWLEDGE_DIR = path.join(ROOT, "knowledge");
const KNOWLEDGE_GAMES_DIR = path.join(KNOWLEDGE_DIR, "games");
const TAG_CODE_MAP_PATH = path.join(KNOWLEDGE_DIR, "tag_code_map.json");

const TAGS_CSV_PATH = path.join(SRC_DIR, "tags.csv");
const GAMES_CSV_PATH = path.join(SRC_DIR, "games.csv");

async function main() {
  const [tagsInfoPayload, gameTags] = await Promise.all([
    loadTagsInfo(),
    loadGameTags(),
  ]);

  const tagsInfoHeader = tagsInfoPayload.header;
  const tagsInfo = tagsInfoPayload.rows;

  await fs.mkdir(KNOWLEDGE_GAMES_DIR, { recursive: true });

  const tagMap = new Map();
  const gameMetadataMap = new Map();

  for (const [gameName, tags] of gameTags.entries()) {
    const slug = sanitizeSlug(gameName);
    const filePath = path.join(GAMES_DIR, `${slug}.js`);
    const analysis = await analyzeGameFile(filePath);
    const metadata = {
      game: gameName,
      slug,
      file: normalizePath(path.relative(ROOT, filePath)),
      exists: analysis.exists,
      functions: analysis.functions,
      commentSnippets: analysis.commentSnippets,
      inputUsages: analysis.inputUsages,
    };
    gameMetadataMap.set(gameName, metadata);

    tags.forEach((tag) => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      const tagDetails = tagsInfo.get(tag) || {};
      tagMap.get(tag).push({
        ...metadata,
        typicalGame: tagDetails.typicalGame || null,
        overview: tagDetails.overview || null,
        description: tagDetails.description || null,
      });
    });
  }

  tagsInfo.forEach((_, tag) => {
    if (!tagMap.has(tag)) {
      tagMap.set(tag, []);
    }
  });

  const tagCodeMap = buildTagCodeMap(tagMap);
  await fs.writeFile(
    TAG_CODE_MAP_PATH,
    JSON.stringify(tagCodeMap, null, 2),
    "utf8"
  );

  await writeTagsCsv({ tagsInfo, tagMap, header: tagsInfoHeader });

  for (const [gameName, metadata] of gameMetadataMap.entries()) {
    const tags = gameTags.get(gameName) || [];
    const markdown = buildGameMarkdown({
      game: gameName,
      metadata,
      tags,
      tagsInfo,
    });
    const mdPath = path.join(KNOWLEDGE_GAMES_DIR, `${metadata.slug}.md`);
    await fs.writeFile(mdPath, markdown, "utf8");
  }

  console.log(
    `Generated ${tagCodeMapKeys(tagCodeMap).length} tag entries and ${gameMetadataMap.size} game briefs.`
  );
}

async function loadTagsInfo() {
  const raw = await fs.readFile(TAGS_CSV_PATH, "utf8");
  const lines = raw
    .replace(/\r/g, "")
    .split("\n")
    .filter(Boolean);
  const headerLine = lines.shift();
  if (!headerLine) {
    return { header: [], rows: new Map() };
  }

  const header = parseCsvLine(headerLine).map((value) => value.trim());
  const indices = {
    tag: header.indexOf("tag"),
    typicalGame: header.indexOf("typical game"),
    overview: header.indexOf("overview"),
    description: header.indexOf("description"),
    priority: header.indexOf("priority"),
  };

  const rows = new Map();
  lines.forEach((line) => {
    const cells = parseCsvLine(line);
    const tag = indices.tag >= 0 ? (cells[indices.tag] || "").trim() : "";
    if (!tag) {
      return;
    }
    rows.set(tag, {
      typicalGame:
        indices.typicalGame >= 0 ? cells[indices.typicalGame] || null : null,
      overview: indices.overview >= 0 ? cells[indices.overview] || null : null,
      description:
        indices.description >= 0 ? cells[indices.description] || null : null,
      priority: indices.priority >= 0 ? cells[indices.priority] || null : null,
    });
  });
  return { header, rows };
}

async function loadGameTags() {
  const raw = await fs.readFile(GAMES_CSV_PATH, "utf8");
  const lines = raw
    .replace(/\r/g, "")
    .split("\n")
    .filter(Boolean);
  lines.shift();
  const map = new Map();
  lines.forEach((line) => {
    const entries = parseCsvLine(line).map((v) => v.trim()).filter(Boolean);
    if (entries.length === 0) return;
    const [gameName, ...tags] = entries;
    if (!gameName) return;
    map.set(gameName, tags.map((t) => t.trim()).filter(Boolean));
  });
  return map;
}

async function analyzeGameFile(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.replace(/\r/g, "").split("\n");
    const functions = extractFunctions(lines);
    const commentSnippets = extractCommentSnippets(lines);
    const inputUsages = extractInputUsages(lines);

    return {
      exists: true,
      functions,
      commentSnippets,
      inputUsages,
    };
  } catch (error) {
    return {
      exists: false,
      functions: [],
      commentSnippets: [],
      inputUsages: [],
    };
  }
}

function extractFunctions(lines) {
  const results = [];
  const seen = new Set();
  lines.forEach((line, idx) => {
    const functionMatch = line.match(/^\s*function\s+([a-zA-Z0-9_]+)/);
    if (functionMatch) {
      const name = functionMatch[1];
      if (!seen.has(name)) {
        results.push({ name, line: idx + 1 });
        seen.add(name);
      }
      return;
    }
    const namedFunctionMatch = line.match(
      /^\s*(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?function\b/
    );
    if (namedFunctionMatch) {
      const name = namedFunctionMatch[1];
      if (!seen.has(name)) {
        results.push({ name, line: idx + 1 });
        seen.add(name);
      }
      return;
    }
    const arrowMatch = line.match(
      /^\s*(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/
    );
    if (arrowMatch) {
      const name = arrowMatch[1];
      if (!seen.has(name)) {
        results.push({ name, line: idx + 1 });
        seen.add(name);
      }
    }
  });
  return results;
}

function extractCommentSnippets(lines) {
  const comments = [];
  let inBlock = false;
  let blockStart = 0;
  let blockChunks = [];

  const pushBlock = () => {
    if (!blockChunks.length) return;
    comments.push({ line: blockStart, text: blockChunks.join(" ") });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!inBlock && trimmed.startsWith("/*")) {
      inBlock = true;
      blockStart = idx + 1;
      blockChunks = [];
      const cleanedStart = trimmed
        .replace(/^\/\*+/, "")
        .split("*/")[0]
        .replace(/^\*/, "")
        .trim();
      if (cleanedStart) {
        blockChunks.push(cleanedStart);
      }
      if (trimmed.includes("*/")) {
        inBlock = false;
        pushBlock();
        blockChunks = [];
      }
      return;
    }

    if (inBlock) {
      const endOfBlock = trimmed.includes("*/");
      const cleaned = trimmed
        .split("*/")[0]
        .replace(/^\*+/, "")
        .trim();
      if (cleaned) {
        blockChunks.push(cleaned);
      }
      if (endOfBlock) {
        inBlock = false;
        pushBlock();
        blockChunks = [];
      }
      return;
    }

    if (trimmed.startsWith("//")) {
      const text = trimmed.slice(2).trim();
      if (text) {
        comments.push({ line: idx + 1, text });
      }
    }
  });

  if (inBlock) {
    pushBlock();
  }

  return comments.slice(0, 10);
}

function extractInputUsages(lines) {
  const usages = [];
  lines.forEach((line, idx) => {
    if (line.includes("input.")) {
      usages.push({ line: idx + 1, code: line.trim() });
    }
  });
  return usages;
}

function buildTagCodeMap(tagMap) {
  const sortedTags = Array.from(tagMap.keys()).sort();
  const result = {};
  sortedTags.forEach((tag) => {
    result[tag] = tagMap.get(tag).map((entry) => ({
      game: entry.game,
      slug: entry.slug,
      file: entry.file,
      functions: entry.functions,
      commentSnippets: entry.commentSnippets,
      inputUsages: entry.inputUsages,
      typicalGame: entry.typicalGame,
      overview: entry.overview,
      description: entry.description,
    }));
  });
  return result;
}

function buildGameMarkdown({ game, metadata, tags, tagsInfo }) {
  const lines = [];
  const sourceLine = metadata.exists
    ? `- Source: \`${metadata.file}\``
    : `- Source: \`${metadata.file}\` *(missing)*`;
  lines.push(`# ${game} (${metadata.slug})`);
  lines.push("");
  lines.push(sourceLine);
  lines.push(`- Tags: ${tags.length ? tags.join(", ") : "(none)"}`);
  lines.push("");
  lines.push("## Tag Summaries");
  if (tags.length) {
    tags.forEach((tag) => {
      const info = tagsInfo.get(tag);
      const overview = info?.overview ? ` ${info.overview}` : "";
      const description = info?.description ? ` ${info.description}` : "";
      lines.push(`- **${tag}**:${overview}${description}`.trim());
    });
  } else {
    lines.push("_No tags registered._");
  }
  lines.push("");
  lines.push("## Key Functions");
  if (metadata.functions.length) {
    metadata.functions.forEach((fn) => {
      lines.push(`- \`${fn.name}\` (line ${fn.line})`);
    });
  } else {
    lines.push("- (none detected)");
  }
  lines.push("");
  lines.push("## Input Handling");
  if (metadata.inputUsages.length) {
    metadata.inputUsages.forEach((input) => {
      lines.push(`- L${input.line}: \`${input.code}\``);
    });
  } else {
    lines.push("- No direct \`input\` usage detected.");
  }
  lines.push("");
  lines.push("## Comment Notes");
  if (metadata.commentSnippets.length) {
    metadata.commentSnippets.forEach((comment) => {
      lines.push(`- L${comment.line}: ${comment.text}`);
    });
  } else {
    lines.push("- (no comments captured)");
  }
  lines.push("");
  return lines.join("\n");
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function derivePriority(count) {
  if (count >= 12) {
    return "high";
  }
  if (count >= 6) {
    return "medium";
  }
  if (count >= 2) {
    return "low";
  }
  return "minimal";
}

function toCsvValue(value) {
  if (value == null) {
    return "";
  }
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function writeTagsCsv({ header, tagsInfo, tagMap }) {
  const baseHeader = header && header.length ? header.slice() : [];
  if (!baseHeader.length) {
    baseHeader.push("tag", "typical game", "overview", "description");
  }
  if (!baseHeader.includes("priority")) {
    baseHeader.push("priority");
  }

  const lines = [];
  lines.push(baseHeader.map(toCsvValue).join(","));

  const seen = new Set();
  tagsInfo.forEach((info, tag) => {
    const entries = tagMap.get(tag) || [];
    const row = baseHeader.map((column) => {
      if (column === "tag") {
        return toCsvValue(tag);
      }
      if (column === "typical game") {
        return toCsvValue(info.typicalGame || "");
      }
      if (column === "overview") {
        return toCsvValue(info.overview || "");
      }
      if (column === "description") {
        return toCsvValue(info.description || "");
      }
      if (column === "priority") {
        return toCsvValue(derivePriority(entries.length));
      }
      return toCsvValue("");
    });
    lines.push(row.join(","));
    seen.add(tag);
  });

  tagMap.forEach((entries, tag) => {
    if (seen.has(tag)) {
      return;
    }
    const info = tagsInfo.get(tag) || {};
    const row = baseHeader.map((column) => {
      if (column === "tag") {
        return toCsvValue(tag);
      }
      if (column === "typical game") {
        return toCsvValue(info.typicalGame || "");
      }
      if (column === "overview") {
        return toCsvValue(info.overview || entries[0]?.overview || "");
      }
      if (column === "description") {
        return toCsvValue(info.description || entries[0]?.description || "");
      }
      if (column === "priority") {
        return toCsvValue(derivePriority(entries.length));
      }
      return toCsvValue("");
    });
    lines.push(row.join(","));
  });

  await fs.writeFile(TAGS_CSV_PATH, `${lines.join("\n")}\n`, "utf8");
}

function sanitizeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizePath(p) {
  return p.replace(/\\/g, "/");
}

function tagCodeMapKeys(map) {
  return Object.keys(map);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
