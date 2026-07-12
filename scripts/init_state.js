#!/usr/bin/env node
/** Initialize an independent batch lineage from tracked state templates. */

const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
const targetArg = args.indexOf("--target");
if (targetArg >= 0 && !args[targetArg + 1]) {
  console.error("--target requires a directory");
  process.exit(1);
}

const root = path.resolve(__dirname, "..");
const templateDir = path.join(root, "templates", "state");
const targetDir = path.resolve(
  root,
  targetArg >= 0 ? args[targetArg + 1] : "state"
);
const files = fs
  .readdirSync(templateDir)
  .filter((name) => fs.statSync(path.join(templateDir, name)).isFile());
const existing = fs.existsSync(targetDir) ? fs.readdirSync(targetDir) : [];

if (existing.length > 0) {
  console.error(
    `Refusing to initialize non-empty state directory ${targetDir}: ${existing.join(", ")}`
  );
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });
for (const name of files) {
  fs.copyFileSync(path.join(templateDir, name), path.join(targetDir, name));
}

console.log(`Initialized independent Batch 1 state in ${targetDir}`);
