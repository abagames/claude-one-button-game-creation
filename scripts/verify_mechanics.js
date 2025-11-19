#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/**
 * Verify that game implementation contains required mechanics for each tag
 */
function verifyMechanics(slug) {
  const gamePath = path.join(__dirname, '..', 'src', 'games', `${slug}.js`);
  if (!fs.existsSync(gamePath)) {
    console.error(`Game file not found: ${gamePath}`);
    process.exit(1);
  }

  const code = fs.readFileSync(gamePath, 'utf-8');
  const lines = code.split('\n');

  const checks = {
    'player:rotate': {
      required: ['angle', /angle\s*[+\-*\/]=/, /addWithAngle/],
      description: 'Rotating movement (angle variable and rotation updates)',
    },
    'player:multiple': {
      required: [/times\(/, /underFoot|onHead/],
      description: 'Multiple entities with stacking relationships',
    },
    'field:spike': {
      required: ['spike', /spike.*push/, /spike.*filter/],
      description: 'Spike obstacles spawning and moving',
    },
    'field:lanes': {
      required: ['lane', /laneY/],
      description: 'Lane structure with visual rendering',
    },
    'weapon:explosion': {
      required: ['explosion', 'radius', /radius\s*[+\-]/],
      description: 'Expanding explosion with radius change',
    },
    'rule:physics': {
      required: ['vel', /vel\.[xy]\s*[+\-*\/]=/, /pos\.add.*vel/],
      description: 'Physics integration (velocity and position updates)',
    },
  };

  const results = {};
  let allPassed = true;

  for (const [tag, check] of Object.entries(checks)) {
    const matches = check.required.map((pattern) => {
      if (typeof pattern === 'string') {
        return code.includes(pattern);
      } else {
        return pattern.test(code);
      }
    });

    const passed = matches.every((m) => m);
    results[tag] = {
      passed,
      description: check.description,
      details: check.required.map((p, i) => ({
        pattern: p.toString(),
        found: matches[i],
      })),
    };

    if (!passed) {
      allPassed = false;
    }
  }

  return { slug, allPassed, results };
}

function printReport(report) {
  console.log(`\n=== Mechanics Verification: ${report.slug} ===\n`);

  for (const [tag, result] of Object.entries(report.results)) {
    const status = result.passed ? '✓' : '✗';
    console.log(`${status} ${tag}`);
    console.log(`  ${result.description}`);

    if (!result.passed) {
      console.log('  Missing patterns:');
      result.details.forEach((d) => {
        if (!d.found) {
          console.log(`    - ${d.pattern}`);
        }
      });
    }
    console.log('');
  }

  console.log(`Overall: ${report.allPassed ? 'PASS' : 'FAIL'}\n`);
  return report.allPassed ? 0 : 1;
}

// CLI
if (require.main === module) {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node verify_mechanics.js <slug>');
    process.exit(1);
  }

  const report = verifyMechanics(slug);
  const exitCode = printReport(report);
  process.exit(exitCode);
}

module.exports = { verifyMechanics };
