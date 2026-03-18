/**
 * GEO Score Calculator — Gewogen scoring model
 */

const { CATEGORY_WEIGHTS, TECHNICAL_CHECKS, CONTENT_SCORING } = require('./weights');

/**
 * Bereken citations subscore (0-100)
 */
function calculateCitationsScore(citationsSummary) {
  if (!citationsSummary || citationsSummary.avg_citation_rate === undefined) return 0;

  const avgRate = citationsSummary.avg_citation_rate; // already 0-100
  const coverage = citationsSummary.platform_coverage; // already 0-100

  return Math.round(avgRate * 0.7 + coverage * 0.3);
}

/**
 * Bereken technisch subscore (0-100)
 * @param {Object} checks - Object met boolean waarden per check key
 */
function calculateTechnicalScore(checks) {
  if (!checks) return 0;

  let score = 0;
  for (const check of TECHNICAL_CHECKS) {
    if (checks[check.key]) {
      score += check.points;
    }
  }
  return Math.min(100, Math.round(score));
}

/**
 * Bereken content subscore (0-100)
 */
function calculateContentScore(content) {
  if (!content) return 0;

  let score = 0;
  for (const [key, points] of Object.entries(CONTENT_SCORING)) {
    if (content[key]) {
      score += points;
    }
  }
  return Math.min(100, score);
}

/**
 * Bereken performance subscore (0-100)
 * Gebruik direct de PageSpeed mobile score
 */
function calculatePerformanceScore(performance) {
  if (!performance || !performance.mobile) return 0;
  return Math.min(100, Math.max(0, Math.round(performance.mobile.score || 0)));
}

/**
 * Bereken de totale GEO score
 */
function calculateGeoScore({ citations, technical, content, performance }) {
  const citationsScore = calculateCitationsScore(citations);
  const technicalScore = calculateTechnicalScore(technical);
  const contentScore = calculateContentScore(content);
  const performanceScore = calculatePerformanceScore(performance);

  const total = Math.round(
    citationsScore * CATEGORY_WEIGHTS.citations +
    technicalScore * CATEGORY_WEIGHTS.technical +
    contentScore * CATEGORY_WEIGHTS.content +
    performanceScore * CATEGORY_WEIGHTS.performance
  );

  return {
    total,
    breakdown: {
      citations: citationsScore,
      technical: technicalScore,
      content: contentScore,
      performance: performanceScore
    }
  };
}

module.exports = {
  calculateCitationsScore,
  calculateTechnicalScore,
  calculateContentScore,
  calculatePerformanceScore,
  calculateGeoScore
};
