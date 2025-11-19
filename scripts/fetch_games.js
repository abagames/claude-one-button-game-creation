#!/usr/bin/env node
const fs = require("fs/promises");
const path = require("path");

const GAMES_CSV = path.join(__dirname, "../reference/games.csv");
const GAME_URLS_CSV = path.join(__dirname, "../reference/game_urls.csv");
const OUTPUT_DIR = path.join(__dirname, "../reference/games");

async function main() {
  const [games, gameUrlMap] = await Promise.all([
    loadGameNames(),
    loadGameUrlMap(),
  ]);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const failures = [];
  let successCount = 0;

  for (const gameName of games) {
    const urlInfo = gameUrlMap.get(gameName);
    if (!urlInfo) {
      failures.push({ game: gameName, reason: "game_urls.csv にエントリがありません" });
      continue;
    }

    const fetchTargets = buildFetchTargets(gameName, urlInfo);
    const { ok, code, error } = await fetchFirstSuccessful(fetchTargets);

    if (!ok) {
      failures.push({ game: gameName, reason: error ?? "適切な main.js が見つかりません" });
      continue;
    }

    const fileName = `${sanitizeSlug(gameName)}.js`;
    const destPath = path.join(OUTPUT_DIR, fileName);
    await fs.writeFile(destPath, code, "utf8");
    successCount += 1;
    console.log(`Saved ${destPath}`);
  }

  console.log("\n=== Summary ===");
  console.log(`成功: ${successCount}`);
  console.log(`失敗: ${failures.length}`);
  if (failures.length > 0) {
    failures.forEach((f) => console.warn(`${f.game}: ${f.reason}`));
  }
}

async function loadGameNames() {
  const raw = await fs.readFile(GAMES_CSV, "utf8");
  return raw
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.split(",")[0]);
}

async function loadGameUrlMap() {
  const raw = await fs.readFile(GAME_URLS_CSV, "utf8");
  const rows = raw
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map(parseCsvLine);

  return new Map(rows.map((row) => [row.title, row]));
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
  const [title, imageUrl, linkUrl, linkType, platformName] = result;
  return { title, imageUrl, linkUrl, linkType, platformName };
}

function buildFetchTargets(gameName, urlInfo) {
  const { owner, repo, branchCandidates, slugCandidates } = deriveRepoInfo(
    gameName,
    urlInfo
  );

  const folders = ["docs", "src", ""];
  const targets = [];

  branchCandidates.forEach((branch) => {
    slugCandidates.forEach((slug) => {
      folders.forEach((folder) => {
        const folderPath = folder ? `${folder}/${slug}` : slug;
        if (!folderPath) return;
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${folderPath}/main.js`;
        targets.push({ url, owner, repo, branch, slug });
      });
    });
  });

  return dedupeTargets(targets);
}

function deriveRepoInfo(gameName, urlInfo) {
  const imageInfo = extractFromImageUrl(urlInfo.imageUrl);
  const linkInfo = extractFromLinkUrl(urlInfo.linkUrl);

  const owner = imageInfo.owner || linkInfo.owner || "abagames";
  const repo = imageInfo.repo || linkInfo.repo || sanitizeSlug(gameName);

  const branchCandidates = dedupe([
    imageInfo.branch,
    linkInfo.branch,
    "main",
    "master",
  ]);

  const slugCandidates = dedupe([
    imageInfo.slug,
    linkInfo.slug,
    sanitizeSlug(gameName),
  ]);

  return { owner, repo, branchCandidates, slugCandidates };
}

function extractFromImageUrl(url) {
  if (!url) return {};
  try {
    const u = new URL(url);
    const segments = u.pathname.split("/").filter(Boolean);
    if (u.hostname === "github.com") {
      // e.g. /owner/repo/raw/main/docs/slug/screenshot.gif
      if (segments.length >= 5) {
        const owner = segments[0];
        const repo = segments[1];
        const branch = segments[3];
        const docsIndex = segments.indexOf("docs");
        const slug = docsIndex >= 0 ? segments[docsIndex + 1] : undefined;
        return { owner, repo, branch, slug };
      }
    }
    if (u.hostname === "raw.githubusercontent.com") {
      // e.g. /owner/repo/refs/heads/main/docs/slug/main.js
      if (segments.length >= 5) {
        const owner = segments[0];
        const repo = segments[1];
        const docsIndex = segments.indexOf("docs");
        const branch = docsIndex > 2 ? segments.slice(2, docsIndex).join("/") : undefined;
        const slug = docsIndex >= 0 ? segments[docsIndex + 1] : undefined;
        return { owner, repo, branch, slug };
      }
    }
  } catch (error) {
    // ignore
  }
  return {};
}

function extractFromLinkUrl(url) {
  if (!url) return {};
  try {
    const u = new URL(url);
    const hostParts = u.hostname.split(".");
    if (u.hostname.endsWith("github.io")) {
      const owner = hostParts[0];
      const pathSegments = u.pathname.split("/").filter(Boolean);
      const repo = pathSegments[0];
      const slugFromPath = pathSegments[1];
      let slug;
      if (u.search && u.search.length > 1) {
        const search = u.search.substring(1);
        slug = search.includes("=") ? u.searchParams.keys().next().value : search;
        if (u.search.includes("=")) {
          // if it's key=value, prefer value
          const firstEntry = Array.from(u.searchParams.values())[0];
          if (firstEntry) slug = firstEntry;
        }
      }
      return {
        owner,
        repo,
        slug: slug || slugFromPath,
      };
    }
  } catch (error) {
    // ignore
  }
  return {};
}

async function fetchFirstSuccessful(targets) {
  for (const target of targets) {
    try {
      const res = await fetchWithTimeout(target.url, 15000);
      if (res.ok) {
        const code = await res.text();
        return { ok: true, code };
      }
    } catch (error) {
      // try next candidate
    }
  }
  return { ok: false, error: targets.length ? `${targets[0].repo} の候補 URL 取得に失敗` : "候補 URL が生成できません" };
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function sanitizeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function dedupe(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function dedupeTargets(targets) {
  const seen = new Set();
  return targets.filter((t) => {
    if (!t.url) return false;
    if (seen.has(t.url)) return false;
    seen.add(t.url);
    return true;
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
