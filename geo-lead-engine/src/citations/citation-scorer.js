/**
 * Citation Scorer — Bereken citation rate + position per platform
 */

const { namesMatch, parseResponse, extractResponseText } = require('./response-parser');

/**
 * Score citations voor één platform over alle prompts
 * @param {string} bedrijfsnaam - De naam van het bedrijf om te zoeken
 * @param {Array} apiResponses - Array van API responses (1 per prompt)
 * @param {string} platform - Platform naam (gemini, openai, claude, perplexity)
 * @returns {Object} Citation resultaten voor dit platform
 */
function scorePlatform(bedrijfsnaam, apiResponses, platform) {
  let citationCount = 0;
  const positions = [];
  const competitorCounts = {};

  for (const apiResponse of apiResponses) {
    const responseText = extractResponseText(apiResponse, platform);
    const parsed = parseResponse(responseText);

    if (parsed.parse_error) continue;

    let foundInThisPrompt = false;
    for (const rec of parsed.recommendations) {
      if (namesMatch(rec.name, bedrijfsnaam)) {
        if (!foundInThisPrompt) {
          citationCount++;
          positions.push(rec.position);
          foundInThisPrompt = true;
        }
      } else if (rec.name) {
        competitorCounts[rec.name] = (competitorCounts[rec.name] || 0) + 1;
      }
    }
  }

  const totalPrompts = apiResponses.length;
  const avgPosition = positions.length > 0
    ? Math.round((positions.reduce((a, b) => a + b, 0) / positions.length) * 10) / 10
    : null;

  // Sort competitors by count descending
  const competitors = Object.entries(competitorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return {
    platform,
    citation_rate: citationCount,
    citation_total: totalPrompts,
    avg_position: avgPosition,
    competitors
  };
}

/**
 * Bereken de samenvatting over alle platforms
 */
function summarizeCitations(platformResults) {
  const platforms = platformResults.filter(p => p.citation_total > 0);
  if (platforms.length === 0) {
    return { avg_citation_rate: 0, platform_coverage: 0, platforms: [] };
  }

  const rates = platforms.map(p => (p.citation_rate / p.citation_total) * 100);
  const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const platformsWithCitations = platforms.filter(p => p.citation_rate > 0).length;
  const platformCoverage = (platformsWithCitations / 4) * 100; // 4 platforms totaal

  return {
    avg_citation_rate: Math.round(avgRate * 10) / 10,
    platform_coverage: Math.round(platformCoverage * 10) / 10,
    platforms
  };
}

module.exports = { scorePlatform, summarizeCitations };
