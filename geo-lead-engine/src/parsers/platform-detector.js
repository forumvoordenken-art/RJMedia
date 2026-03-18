/**
 * Platform Detector — WordPress/Shopify/Wix/Squarespace/Custom detectie
 */

const PLATFORMS = [
  {
    name: 'wordpress',
    signatures: [
      /wp-content\//i,
      /wp-includes\//i,
      /wp-json\//i,
      /<meta[^>]*name\s*=\s*["']generator["'][^>]*content\s*=\s*["']WordPress/i
    ],
    highConfidence: [/wp-content\//i, /wp-includes\//i]
  },
  {
    name: 'shopify',
    signatures: [
      /cdn\.shopify\.com/i,
      /shopify\./i,
      /Shopify\.theme/i,
      /<meta[^>]*name\s*=\s*["']shopify/i
    ],
    highConfidence: [/cdn\.shopify\.com/i, /Shopify\.theme/i]
  },
  {
    name: 'wix',
    signatures: [
      /static\.wixstatic\.com/i,
      /wix\.com/i,
      /_wix_browser_sess/i,
      /X-Wix-/i
    ],
    highConfidence: [/static\.wixstatic\.com/i, /_wix_browser_sess/i]
  },
  {
    name: 'squarespace',
    signatures: [
      /squarespace\.com/i,
      /sqsp\./i,
      /squarespace-cdn/i,
      /<meta[^>]*name\s*=\s*["']generator["'][^>]*content\s*=\s*["']Squarespace/i
    ],
    highConfidence: [/squarespace-cdn/i, /sqsp\./i]
  }
];

function detectPlatform(html) {
  if (!html || typeof html !== 'string') {
    return { platform: 'custom', confidence: 'low' };
  }

  for (const platform of PLATFORMS) {
    const matchCount = platform.signatures.filter(sig => sig.test(html)).length;
    if (matchCount === 0) continue;

    const hasHighConf = platform.highConfidence.some(sig => sig.test(html));
    const confidence = hasHighConf || matchCount >= 2 ? 'high' : 'medium';

    return { platform: platform.name, confidence };
  }

  return { platform: 'custom', confidence: 'low' };
}

module.exports = { detectPlatform, PLATFORMS };
