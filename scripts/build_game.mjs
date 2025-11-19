#!/usr/bin/env node

/**
 * Build a specific game in docs/
 * Usage: npm run build:game -- --game <game-name>
 * Example: npm run build:game -- --game magnetic_pendulum
 */

import { build } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const gameIndex = args.indexOf('--game');
const gameName = gameIndex !== -1 ? args[gameIndex + 1] : null;

if (!gameName) {
  console.error('Error: --game argument required');
  console.error('Usage: npm run build:game -- --game <game-name>');
  process.exit(1);
}

const gameDir = resolve(__dirname, '..', 'docs', gameName);
const outDir = resolve(gameDir, 'dist');

console.log(`Building game: ${gameName}`);
console.log(`Source: ${gameDir}`);
console.log(`Output: ${outDir}`);

try {
  // Use relative base path for both local testing and GitHub Pages
  await build({
    root: gameDir,
    base: './',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(gameDir, 'index.html')
        }
      }
    }
  });

  console.log(`✓ Build complete: ${gameName}`);
  console.log(`✓ Output: ${outDir}`);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
