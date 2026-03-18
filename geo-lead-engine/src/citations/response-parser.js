/**
 * Response Parser — Parse JSON responses van AI platforms
 */

/**
 * Normaliseer bedrijfsnaam voor fuzzy matching
 * Verwijder: "de", "het", "bv", "b.v.", lowercase, trim whitespace
 */
function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .replace(/\b(de|het|een|bv|b\.v\.|b\.v)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check of twee bedrijfsnamen matchen (fuzzy)
 */
function namesMatch(name1, name2) {
  const n1 = normalizeName(name1);
  const n2 = normalizeName(name2);
  if (!n1 || !n2) return false;
  return n1 === n2 || n1.includes(n2) || n2.includes(n1);
}

/**
 * Parse een AI platform response (verwacht JSON met recommendations array)
 */
function parseResponse(responseText) {
  if (!responseText || typeof responseText !== 'string') {
    return { recommendations: [], total_results: 0, parse_error: true };
  }

  // Try to extract JSON from the response (AI models sometimes wrap in markdown)
  let jsonStr = responseText.trim();

  // Remove markdown code blocks
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  // Try to find JSON object
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonStr);
    const recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    return {
      recommendations: recommendations.map((r, i) => ({
        name: r.name || '',
        reason: r.reason || '',
        position: r.position || i + 1
      })),
      total_results: parsed.total_results || recommendations.length,
      parse_error: false
    };
  } catch (e) {
    return { recommendations: [], total_results: 0, parse_error: true };
  }
}

/**
 * Extraheer platform-specifieke response text
 */
function extractResponseText(apiResponse, platform) {
  try {
    switch (platform) {
      case 'gemini':
        return apiResponse.candidates[0].content.parts[0].text;
      case 'openai':
      case 'perplexity':
        return apiResponse.choices[0].message.content;
      case 'claude':
        return apiResponse.content[0].text;
      default:
        return typeof apiResponse === 'string' ? apiResponse : JSON.stringify(apiResponse);
    }
  } catch (e) {
    return '';
  }
}

module.exports = { normalizeName, namesMatch, parseResponse, extractResponseText };
