/**
 * Tech Checker — SSL, sitemap, robots.txt, llms.txt checks
 * Parses pre-fetched responses (used inside n8n Code nodes)
 */

function checkSitemap(responseBody, statusCode) {
  if (!responseBody || statusCode >= 400) return { has_sitemap: false };
  const isXml = responseBody.includes('<?xml') || responseBody.includes('<urlset') || responseBody.includes('<sitemapindex');
  return { has_sitemap: isXml };
}

function checkRobots(responseBody, statusCode) {
  if (!responseBody || statusCode >= 400) {
    return { has_robots: false, robots_blocks_ai: false };
  }
  const lower = responseBody.toLowerCase();
  const hasRobots = lower.includes('user-agent');

  // Check if AI crawlers are blocked
  const lines = responseBody.split('\n');
  let currentUserAgent = '';
  let blocksAi = false;

  const aiCrawlers = ['gptbot', 'claudebot', 'claude-web', 'chatgpt-user', 'ccbot', 'anthropic-ai'];

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    if (trimmed.startsWith('user-agent:')) {
      currentUserAgent = trimmed.replace('user-agent:', '').trim();
    } else if (trimmed.startsWith('disallow:') && trimmed.includes('/')) {
      if (aiCrawlers.includes(currentUserAgent) || currentUserAgent === '*') {
        // Only count wildcard blocks if they disallow root
        if (currentUserAgent === '*' && trimmed === 'disallow: /') {
          blocksAi = true;
        } else if (currentUserAgent !== '*') {
          blocksAi = true;
        }
      }
    }
  }

  return { has_robots: hasRobots, robots_blocks_ai: blocksAi };
}

function checkLlmsTxt(responseBody, statusCode) {
  return { has_llms_txt: !!responseBody && statusCode < 400 && responseBody.trim().length > 0 };
}

function checkHttps(url) {
  return { is_https: typeof url === 'string' && url.startsWith('https://') };
}

module.exports = { checkSitemap, checkRobots, checkLlmsTxt, checkHttps };
