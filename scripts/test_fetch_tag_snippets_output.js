#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function runCli(params) {
  execFileSync('node', [path.join(__dirname, 'fetch_tag_snippets.js'), ...params], {
    stdio: 'inherit',
    cwd: repoRoot,
  });
}

function validateJson(filePath, expectedTags) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const payload = JSON.parse(raw);
  if (!payload.generated) {
    throw new Error('generated timestamp missing');
  }
  if (!Array.isArray(payload.tags) || payload.tags.length !== expectedTags.length) {
    throw new Error(`tags array length mismatch (expected ${expectedTags.length})`);
  }
  expectedTags.forEach((tag, index) => {
    const entry = payload.tags[index];
    if (entry.tag !== tag) {
      throw new Error(`tag mismatch at index ${index}: expected ${tag}, got ${entry.tag}`);
    }
    if (!entry.sections || typeof entry.sections.Snippet !== 'string') {
      throw new Error(`Snippet section missing for ${tag}`);
    }
  });
}

function validateMarkdown(filePath, expectedTags) {
  const raw = fs.readFileSync(filePath, 'utf8');
  expectedTags.forEach((tag) => {
    if (!raw.includes(`## ${tag}`)) {
      throw new Error(`Missing section for ${tag} in markdown output`);
    }
  });
  if (!raw.includes('Tag Snippet Context')) {
    throw new Error('Markdown header missing');
  }
}

try {
  const jsonOut = path.join(repoRoot, 'tmp', 'test_agent_context.json');
  runCli(['--tags', 'player:rotate', '--format', 'json', '--out', jsonOut, '--force-partial']);
  validateJson(jsonOut, ['player:rotate']);

  const mdOut = path.join(repoRoot, 'tmp', 'test_agent_context.md');
  runCli(['--tags', 'player:rotate,player:reflect', '--format', 'markdown', '--out', mdOut, '--force-partial']);
  validateMarkdown(mdOut, ['player:rotate', 'player:reflect']);

  console.log('fetch_tag_snippets JSON and Markdown structure OK');
} catch (err) {
  console.error('Validation failed:', err.message);
  process.exit(1);
}
