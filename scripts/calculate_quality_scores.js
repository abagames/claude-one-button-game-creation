#!/usr/bin/env node
/**
 * Calculate Quality Scores (Technical, Design, Novelty, Overall)
 *
 * Integrates existing metrics from lint, sim, GA, and novelty evaluations
 * to produce normalized 0-100 scores for comprehensive game quality assessment.
 */

/**
 * Calculate Technical Score (0-100)
 * Based on: syntax correctness, execution stability, vulnerability resistance
 *
 * @param {Object} lintResult Result from check_game_style.js
 * @param {Object} monotonousResults Result from testMonotonousPatterns
 * @param {Object} gaResults Result from testGAOptimizedPatterns (optional)
 * @returns {number} Technical score (0-100)
 */
function calculateTechnicalScore(lintResult, monotonousResults, gaResults) {
  // Syntax correctness: 40 points
  const syntaxScore = lintResult && lintResult.status === 'pass' ? 40 : 0;

  // Execution stability: 30 points (monotonous input resistance)
  let stabilityScore = 0;
  if (monotonousResults && typeof monotonousResults.isHighlyVulnerable !== 'undefined') {
    if (!monotonousResults.isHighlyVulnerable && !monotonousResults.isModeratelyVulnerable) {
      stabilityScore = 30; // Excellent
    } else if (!monotonousResults.isHighlyVulnerable) {
      stabilityScore = 20; // Good
    } else {
      stabilityScore = 10; // Fair
      if (monotonousResults.maxSurvivalTime > 15) {
        stabilityScore = 0; // Poor
      }
    }
  }

  // Vulnerability resistance: 30 points (GA resistance)
  let securityScore = 0;
  if (gaResults && typeof gaResults.isHighlyVulnerable !== 'undefined') {
    if (!gaResults.isHighlyVulnerable && !gaResults.isModeratelyVulnerable) {
      securityScore = 30; // Excellent
    } else if (!gaResults.isHighlyVulnerable) {
      securityScore = 20; // Good
    } else {
      securityScore = 10; // Fair
      if (gaResults.bestScore > 200) {
        securityScore = 0; // Poor
      }
    }
  }

  return Math.round(syntaxScore + stabilityScore + securityScore);
}

/**
 * Calculate Design Score (0-100)
 * Based on: balance, difficulty progression, responsiveness
 *
 * @param {Object} monotonousResults Result from testMonotonousPatterns
 * @param {Object} gaResults Result from testGAOptimizedPatterns (optional)
 * @returns {number} Design score (0-100)
 */
function calculateDesignScore(monotonousResults, gaResults) {
  // Balance: 50 points (target survival time 30-60 seconds is ideal)
  const targetTime = 45; // seconds
  const actualTime = gaResults
    ? gaResults.bestSurvivalTime || 0
    : monotonousResults
    ? monotonousResults.maxSurvivalTime || 0
    : 0;

  const timeDeviation = actualTime > 0 ? Math.abs(actualTime - targetTime) / targetTime : 1.0;
  const balanceScore = Math.max(0, Math.round(50 * (1 - Math.min(timeDeviation, 1.0))));

  // Difficulty appropriateness: 30 points (provisional: full score)
  // TODO: Implement score variance analysis across multiple simulations
  const difficultyScore = 30;

  // Responsiveness: 20 points (provisional: full score)
  // TODO: Implement input response time measurement
  const responsivenessScore = 20;

  return balanceScore + difficultyScore + responsivenessScore;
}

/**
 * Calculate Novelty Score (0-100)
 * Based on: tag novelty, mechanical coherence, code originality
 *
 * @param {Object} noveltyMetrics Result from calculateAllMetrics (novelty_metrics.js)
 * @returns {number} Novelty score (0-100)
 */
function calculateNoveltyScore(noveltyMetrics) {
  if (!noveltyMetrics) return 0;

  // Normalize existing metrics to 0-100 scale
  const tagNovelty = (noveltyMetrics.tagNoveltyRatio?.value || 0) * 100;
  const coherence = (noveltyMetrics.mechanicalCoherence?.value || 0) * 100;
  const originality = (noveltyMetrics.estimatedCodeOriginality?.value || 0) * 100;

  // Weighted average (emphasize tag novelty)
  const weights = { tag: 0.4, coherence: 0.3, originality: 0.3 };
  return Math.round(
    tagNovelty * weights.tag +
    coherence * weights.coherence +
    originality * weights.originality
  );
}

/**
 * Calculate Overall Quality Score (0-100)
 * Weighted average of Technical, Design, Novelty scores
 *
 * @param {number} technical Technical score
 * @param {number} design Design score
 * @param {number} novelty Novelty score
 * @param {string} mode Evaluation mode ('ga' or other)
 * @returns {number} Overall score (0-100)
 */
function calculateOverallScore(technical, design, novelty, mode) {
  // Adjust weights based on evaluation mode
  const weights = mode === 'ga'
    ? { technical: 0.4, design: 0.35, novelty: 0.25 } // GA mode: emphasize technical
    : { technical: 0.35, design: 0.35, novelty: 0.30 }; // Normal: balanced

  return Math.round(
    technical * weights.technical +
    design * weights.design +
    novelty * weights.novelty
  );
}

/**
 * Calculate all quality scores from evaluation results
 *
 * @param {Object} params Evaluation parameters
 * @param {Object} params.lintResult Lint check result
 * @param {Object} params.simResult Simulation result (contains monotonousResults, gaResults)
 * @param {Object} params.noveltyMetrics Novelty metrics
 * @param {string} params.mode Evaluation mode
 * @returns {Object} Quality scores { technical, design, novelty, overall }
 */
function calculateQualityScores(params) {
  const { lintResult, simResult, noveltyMetrics, mode } = params;

  // Extract data from simResult (test_game_framework.js output)
  let monotonousResults = null;
  let gaResults = null;

  if (simResult && simResult.stdout) {
    try {
      // Parse JSON output from test_game_framework.js
      const jsonMatch = simResult.stdout.match(/===== JSON Output =====\n([\s\S]+)$/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[1]);
        monotonousResults = data.monotonousResults;
        gaResults = data.gaResults;
      }
    } catch (err) {
      console.warn('Warning: Could not parse simulation results for quality scoring');
    }
  }

  // Calculate individual scores
  const technical = calculateTechnicalScore(lintResult, monotonousResults, gaResults);
  const design = calculateDesignScore(monotonousResults, gaResults);
  const novelty = calculateNoveltyScore(noveltyMetrics);
  const overall = calculateOverallScore(technical, design, novelty, mode);

  return {
    technical,
    design,
    novelty,
    overall,
  };
}

module.exports = {
  calculateQualityScores,
  calculateTechnicalScore,
  calculateDesignScore,
  calculateNoveltyScore,
  calculateOverallScore,
};

// CLI interface
if (require.main === module) {
  console.error('This module is designed to be required, not executed directly.');
  console.error('Use: const { calculateQualityScores } = require("./calculate_quality_scores");');
  process.exit(1);
}
