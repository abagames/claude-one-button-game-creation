#!/usr/bin/env node
/**
 * Dynamic Game Parameter Injector (Enhanced with Fallback Strategies)
 *
 * Injects parameter values into game code by replacing numeric literals.
 * Uses multiple search strategies for robust parameter replacement.
 *
 * Strategy Priority:
 * 1. Line-based search (near specified line number)
 * 2. Global file search (fallback if line-based fails)
 * 3. Context-aware hierarchical search (for nested paths)
 *
 * Usage:
 *   const injector = require('./dynamic_game_injector.js');
 *   const modifiedCode = injector.injectParameters(gameCode, parameterValues, parameterSpec);
 */

const fs = require('fs');
const path = require('path');

/**
 * Escape special regex characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build multiple pattern variations for flexible matching
 */
function buildPatterns(key, currentValue = null) {
  const patterns = [];

  // Pattern 1: "key: value" (object property)
  patterns.push(new RegExp(`(\\b${escapeRegex(key)}\\s*:\\s*)(-?\\d+\\.?\\d*)`, 'g'));

  // Pattern 2: "key = value" (assignment)
  patterns.push(new RegExp(`(\\b${escapeRegex(key)}\\s*=\\s*)(-?\\d+\\.?\\d*)`, 'g'));

  // Pattern 3: With current value context (more precise)
  if (currentValue !== null) {
    const valueStr = currentValue.toString().replace(/\./g, '\\.');
    patterns.push(new RegExp(`(\\b${escapeRegex(key)}\\s*[=:]\\s*)(${valueStr})\\b`, 'g'));
  }

  return patterns;
}

/**
 * Apply a pattern to replace value
 */
function applyPattern(line, pattern, newValue) {
  return line.replace(pattern, `$1${newValue}`);
}

/**
 * Strategy 1: Line-based replacement (search near specified line)
 */
function tryLineBasedReplacement(lines, param, newValue) {
  const lineMatch = param.location.match(/line\s+(\d+)/i);
  if (!lineMatch) return false;

  const targetLine = parseInt(lineMatch[1], 10);
  const searchStart = Math.max(0, targetLine - 6);
  const searchEnd = Math.min(lines.length, targetLine + 5);

  // For nested paths like "buggy.hop.x"
  if (param.path.includes('.')) {
    const parts = param.path.split('.');
    const lastKey = parts[parts.length - 1];
    const patterns = buildPatterns(lastKey, param.currentValue);

    for (let i = searchStart; i < searchEnd; i++) {
      const line = lines[i];

      for (const pattern of patterns) {
        if (pattern.test(line)) {
          lines[i] = applyPattern(line, pattern, newValue);
          return true;
        }
      }
    }
  } else {
    // Simple paths
    for (let i = searchStart; i < searchEnd; i++) {
      const line = lines[i];

      // Special case: scrollSpeedCoeff
      if (param.path === 'scrollSpeedCoeff') {
        const pattern = /(\s*=\s*)(\d+\.?\d*)(\s*\*\s*difficulty)/;
        if (pattern.test(line)) {
          lines[i] = line.replace(pattern, `$1${newValue}$3`);
          return true;
        }
      }

      // Special case: nextObstacleTicks.initial / nextEnemyTicks.initial (simple assignment)
      if (param.path === 'nextObstacleTicks.initial' || param.path === 'nextEnemyTicks.initial') {
        const varName = param.path.split('.')[0]; // nextObstacleTicks or nextEnemyTicks
        const pattern = new RegExp(`(${varName}\\s*=\\s*)(\\d+\\.?\\d*)`, '');
        if (pattern.test(line)) {
          lines[i] = line.replace(pattern, `$1${newValue}`);
          return true;
        }
      }

      // Special case: penaltyRatio (rnd() < value)
      if (param.path === 'penaltyRatio') {
        const pattern = /(rnd\(\)\s*<\s*)(\d+\.?\d*)/;
        if (pattern.test(line)) {
          lines[i] = line.replace(pattern, `$1${newValue}`);
          return true;
        }
      }

      // Special case: penaltyScore (addScore(value,))
      if (param.path === 'penaltyScore') {
        const pattern = /(addScore\s*\(\s*)(-?\d+\.?\d*)/;
        if (pattern.test(line)) {
          lines[i] = line.replace(pattern, `$1${newValue}`);
          return true;
        }
      }

      // Special case: bombFallSpeed (o.y += value * difficulty)
      if (param.path === 'bombFallSpeed') {
        const pattern = /(o\.y\s*\+=\s*)(\d+\.?\d*)(\s*\*\s*difficulty)/;
        if (pattern.test(line)) {
          lines[i] = line.replace(pattern, `$1${newValue}$3`);
          return true;
        }
      }

      // Special case: slopeInfluence (sin(...) * value)
      if (param.path === 'slopeInfluence') {
        const pattern = /(sin\([^)]+\)\s*\*\s*)(\d+\.?\d*)/;
        if (pattern.test(line)) {
          lines[i] = line.replace(pattern, `$1${newValue}`);
          return true;
        }
      }

      // Special case: enemyKillScore (addScore(value, pos))
      if (param.path === 'enemyKillScore') {
        const pattern = /(addScore\s*\(\s*)(\d+\.?\d*)(\s*,\s*e\.pos)/;
        if (pattern.test(line)) {
          lines[i] = line.replace(pattern, `$1${newValue}$3`);
          return true;
        }
      }

      // Special case: timeScoreCoeff (difficulty * value in addScore)
      if (param.path === 'timeScoreCoeff') {
        const pattern = /(difficulty\s*\*\s*)(\d+\.?\d*)/;
        if (pattern.test(line) && line.includes('addScore')) {
          lines[i] = line.replace(pattern, `$1${newValue}`);
          return true;
        }
      }

      // Special case: rnd() min/max
      if (param.path.endsWith('.min') || param.path.endsWith('.max')) {
        const rndPattern = /rnd\((\d+\.?\d*),\s*(\d+\.?\d*)\)/;
        if (rndPattern.test(line)) {
          const isMin = param.path.endsWith('.min');
          lines[i] = line.replace(rndPattern, (match, min, max) => {
            const newMin = isMin ? newValue : min;
            const newMax = isMin ? max : newValue;
            return `rnd(${newMin}, ${newMax})`;
          });
          return true;
        }
      }

      // General assignment
      const patterns = buildPatterns(param.path, param.currentValue);
      for (const pattern of patterns) {
        if (pattern.test(line)) {
          lines[i] = applyPattern(line, pattern, newValue);
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Strategy 2: Global file search (fallback)
 */
function tryGlobalReplacement(lines, param, newValue) {
  const parts = param.path.split('.');
  const lastKey = parts[parts.length - 1];
  const patterns = buildPatterns(lastKey, param.currentValue);

  // Search entire file
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // For nested paths, try to verify context
    if (parts.length > 1) {
      // Look for parent object context in previous lines
      const contextWindow = Math.max(0, i - 10);
      let hasContext = false;

      for (let j = contextWindow; j < i; j++) {
        // Check if parent object is mentioned
        for (let k = 0; k < parts.length - 1; k++) {
          if (lines[j].includes(parts[k])) {
            hasContext = true;
            break;
          }
        }
      }

      // Skip if no context found (avoid false positives)
      if (!hasContext && parts.length > 2) {
        continue;
      }
    }

    // Try all patterns
    for (const pattern of patterns) {
      if (pattern.test(line)) {
        lines[i] = applyPattern(line, pattern, newValue);
        return true;
      }
    }

    // Special case: rnd() for min/max
    if (param.path.endsWith('.min') || param.path.endsWith('.max')) {
      const rndPattern = /rnd\((\d+\.?\d*),\s*(\d+\.?\d*)\)/;
      if (rndPattern.test(line)) {
        const isMin = param.path.endsWith('.min');
        lines[i] = line.replace(rndPattern, (match, min, max) => {
          const newMin = isMin ? newValue : min;
          const newMax = isMin ? max : newValue;
          return `rnd(${newMin}, ${newMax})`;
        });
        return true;
      }
    }

    // Special case: scrollSpeedCoeff
    if (param.path === 'scrollSpeedCoeff') {
      const pattern = /(\s*=\s*)(\d+\.?\d*)(\s*\*\s*difficulty)/;
      if (pattern.test(line)) {
        lines[i] = line.replace(pattern, `$1${newValue}$3`);
        return true;
      }
    }

    // Special case: nextObstacleTicks.initial / nextEnemyTicks.initial
    if (param.path === 'nextObstacleTicks.initial' || param.path === 'nextEnemyTicks.initial') {
      const varName = param.path.split('.')[0]; // nextObstacleTicks or nextEnemyTicks
      const pattern = new RegExp(`(${varName}\\s*=\\s*)(\\d+\\.?\\d*)`, '');
      if (pattern.test(line)) {
        lines[i] = line.replace(pattern, `$1${newValue}`);
        return true;
      }
    }

    // Special case: penaltyRatio
    if (param.path === 'penaltyRatio') {
      const pattern = /(rnd\(\)\s*<\s*)(\d+\.?\d*)/;
      if (pattern.test(line)) {
        lines[i] = line.replace(pattern, `$1${newValue}`);
        return true;
      }
    }

    // Special case: penaltyScore
    if (param.path === 'penaltyScore') {
      const pattern = /(addScore\s*\(\s*)(-?\d+\.?\d*)/;
      if (pattern.test(line)) {
        lines[i] = line.replace(pattern, `$1${newValue}`);
        return true;
      }
    }

    // Special case: bombFallSpeed
    if (param.path === 'bombFallSpeed') {
      const pattern = /(o\.y\s*\+=\s*)(\d+\.?\d*)(\s*\*\s*difficulty)/;
      if (pattern.test(line)) {
        lines[i] = line.replace(pattern, `$1${newValue}$3`);
        return true;
      }
    }

    // Special case: slopeInfluence
    if (param.path === 'slopeInfluence') {
      const pattern = /(sin\([^)]+\)\s*\*\s*)(\d+\.?\d*)/;
      if (pattern.test(line)) {
        lines[i] = line.replace(pattern, `$1${newValue}`);
        return true;
      }
    }

    // Special case: enemyKillScore (addScore(value, pos))
    if (param.path === 'enemyKillScore') {
      const pattern = /(addScore\s*\(\s*)(\d+\.?\d*)(\s*,\s*e\.pos)/;
      if (pattern.test(line)) {
        lines[i] = line.replace(pattern, `$1${newValue}$3`);
        return true;
      }
    }

    // Special case: timeScoreCoeff (difficulty * value in addScore)
    if (param.path === 'timeScoreCoeff') {
      const pattern = /(difficulty\s*\*\s*)(\d+\.?\d*)/;
      if (pattern.test(line) && line.includes('addScore')) {
        lines[i] = line.replace(pattern, `$1${newValue}`);
        return true;
      }
    }
  }

  return false;
}

/**
 * Strategy 3: Hierarchical context search (for deeply nested paths)
 */
function tryHierarchicalReplacement(lines, param, newValue) {
  const parts = param.path.split('.');
  if (parts.length < 2) return false;

  // Find the parent object definition
  const parentKey = parts[0];
  let parentLineStart = -1;

  for (let i = 0; i < lines.length; i++) {
    // Look for "parentKey = {" or "parentKey: {"
    if (lines[i].match(new RegExp(`\\b${escapeRegex(parentKey)}\\s*[=:]\\s*\\{`))) {
      parentLineStart = i;
      break;
    }
  }

  if (parentLineStart === -1) return false;

  // Search within the parent object scope (up to 50 lines)
  const scopeEnd = Math.min(lines.length, parentLineStart + 50);
  const lastKey = parts[parts.length - 1];
  const patterns = buildPatterns(lastKey, param.currentValue);

  for (let i = parentLineStart; i < scopeEnd; i++) {
    const line = lines[i];

    for (const pattern of patterns) {
      if (pattern.test(line)) {
        lines[i] = applyPattern(line, pattern, newValue);
        return true;
      }
    }
  }

  return false;
}

/**
 * Inject parameter values into game code using multiple strategies
 *
 * @param {string} gameCode - Original game code
 * @param {Object} parameterValues - Map of parameter paths to new values { "buggy.hop.y": -4.5, ... }
 * @param {Array} parameterSpec - Parameter specifications from balance_params.json
 * @param {Object} options - Options { verbose: boolean, verifyChanges: boolean }
 * @returns {string|Object} Modified game code, or { code, changes } if verifyChanges is true
 */
function injectParameters(gameCode, parameterValues, parameterSpec, options = {}) {
  const { verbose = false, verifyChanges = false } = options;
  const lines = gameCode.split('\n');
  const changes = [];

  for (const param of parameterSpec) {
    const newValue = parameterValues[param.path];
    if (newValue === undefined) {
      continue;
    }

    let replaced = false;
    let strategy = '';

    // Strategy 1: Line-based search
    replaced = tryLineBasedReplacement(lines, param, newValue);
    if (replaced) {
      strategy = 'line-based';
    }

    // Strategy 2: Global search (fallback)
    if (!replaced) {
      replaced = tryGlobalReplacement(lines, param, newValue);
      if (replaced) {
        strategy = 'global-search';
      }
    }

    // Strategy 3: Hierarchical search (nested paths only)
    if (!replaced && param.path.includes('.')) {
      replaced = tryHierarchicalReplacement(lines, param, newValue);
      if (replaced) {
        strategy = 'hierarchical';
      }
    }

    // Record result
    if (replaced) {
      changes.push({
        path: param.path,
        oldValue: param.currentValue,
        newValue: newValue,
        strategy: strategy,
        success: true,
      });

      if (verbose) {
        console.log(`✓ Replaced ${param.path}: ${param.currentValue} → ${newValue} (${strategy})`);
      }
    } else {
      changes.push({
        path: param.path,
        oldValue: param.currentValue,
        newValue: newValue,
        strategy: null,
        success: false,
      });

      if (verbose) {
        console.warn(`✗ Could not replace ${param.path}`);
      }
    }
  }

  const modifiedCode = lines.join('\n');

  if (verifyChanges) {
    return {
      code: modifiedCode,
      changes: changes,
      successCount: changes.filter(c => c.success).length,
      totalCount: changes.length,
    };
  }

  return modifiedCode;
}

/**
 * CLI usage: Inject parameters and save to output file
 *
 * Usage: node scripts/dynamic_game_injector.js --game <path> --params <path> --values <json> [--out <path>] [--verbose]
 */
function main() {
  const args = process.argv.slice(2);
  const opts = { verbose: false };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--game') {
      opts.gamePath = args[i + 1];
      i += 1;
    } else if (arg === '--params') {
      opts.paramsPath = args[i + 1];
      i += 1;
    } else if (arg === '--values') {
      opts.valuesJson = args[i + 1];
      i += 1;
    } else if (arg === '--out') {
      opts.outPath = args[i + 1];
      i += 1;
    } else if (arg === '--verbose') {
      opts.verbose = true;
    }
  }

  if (!opts.gamePath || !opts.paramsPath || !opts.valuesJson) {
    console.error('Usage: node scripts/dynamic_game_injector.js --game <path> --params <path> --values <json> [--out <path>] [--verbose]');
    process.exit(1);
  }

  // Read game code
  const gameCode = fs.readFileSync(opts.gamePath, 'utf8');

  // Read parameter spec
  const paramsData = JSON.parse(fs.readFileSync(opts.paramsPath, 'utf8'));
  const parameterSpec = paramsData.parameters;

  // Parse values JSON
  const parameterValues = JSON.parse(opts.valuesJson);

  // Inject parameters with verification
  const result = injectParameters(gameCode, parameterValues, parameterSpec, {
    verbose: opts.verbose,
    verifyChanges: true,
  });

  console.log(`\nInjection Summary: ${result.successCount}/${result.totalCount} parameters replaced`);

  // Show strategy breakdown
  const strategies = {};
  result.changes.filter(c => c.success).forEach(c => {
    strategies[c.strategy] = (strategies[c.strategy] || 0) + 1;
  });
  console.log('Strategy usage:', strategies);

  // Output
  if (opts.outPath) {
    fs.writeFileSync(opts.outPath, result.code, 'utf8');
    console.log(`\nModified game code written to: ${opts.outPath}`);
  } else {
    console.log('\n' + result.code);
  }
}

// Export for use as module
module.exports = {
  injectParameters,
};

// Run CLI if invoked directly
if (require.main === module) {
  main();
}
