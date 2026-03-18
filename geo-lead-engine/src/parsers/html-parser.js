/**
 * HTML Parser — Schema.org, meta tags, headings, FAQ detectie
 */

function parseSchemaOrg(html) {
  const scripts = [];
  const regex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      scripts.push(parsed);
    } catch (e) {
      // Malformed JSON-LD, skip
    }
  }

  const knownTypes = [
    'Organization', 'LocalBusiness', 'Restaurant', 'FAQ', 'FAQPage',
    'Product', 'BreadcrumbList', 'WebSite', 'WebPage', 'Service',
    'Store', 'MedicalBusiness', 'LegalService', 'FinancialService'
  ];

  const found = new Set();

  function extractTypes(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach(extractTypes);
      return;
    }
    const type = obj['@type'];
    if (type) {
      const types = Array.isArray(type) ? type : [type];
      types.forEach(t => {
        if (knownTypes.includes(t)) found.add(t);
      });
    }
    if (obj['@graph'] && Array.isArray(obj['@graph'])) {
      obj['@graph'].forEach(extractTypes);
    }
  }

  scripts.forEach(extractTypes);

  const foundArray = Array.from(found);
  const missing = knownTypes
    .filter(t => !found.has(t))
    .filter(t => ['Organization', 'LocalBusiness', 'BreadcrumbList', 'FAQ', 'FAQPage', 'WebSite'].includes(t));

  return {
    found: foundArray,
    missing: missing,
    has_faq_schema: found.has('FAQ') || found.has('FAQPage')
  };
}

function parseMetaAndHeadings(html, branche, stad) {
  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Meta description
  const metaDescMatch = html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([\s\S]*?)["'][^>]*\/?>/i)
    || html.match(/<meta[^>]*content\s*=\s*["']([\s\S]*?)["'][^>]*name\s*=\s*["']description["'][^>]*\/?>/i);
  const meta_description = metaDescMatch ? metaDescMatch[1].trim() : '';
  const meta_length = meta_description.length;

  // Headings
  const headings = [];
  const headingRegex = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
  let hMatch;
  while ((hMatch = headingRegex.exec(html)) !== null) {
    const level = parseInt(hMatch[1][1]);
    const text = hMatch[2].replace(/<[^>]*>/g, '').trim();
    headings.push({ level, text });
  }

  const h1 = headings.find(h => h.level === 1);
  const h1Text = h1 ? h1.text : '';

  const h1Lower = h1Text.toLowerCase();
  const brancheLower = (branche || '').toLowerCase();
  const stadLower = (stad || '').toLowerCase();
  const h1_contains_location = (brancheLower && h1Lower.includes(brancheLower)) ||
    (stadLower && h1Lower.includes(stadLower));

  // Check heading hierarchy
  const levels = headings.map(h => h.level);
  const headings_hierarchy = levels.length > 0 && levels[0] === 1;

  // Canonical
  const canonicalMatch = html.match(/<link[^>]*rel\s*=\s*["']canonical["'][^>]*href\s*=\s*["']([^"']+)["'][^>]*\/?>/i)
    || html.match(/<link[^>]*href\s*=\s*["']([^"']+)["'][^>]*rel\s*=\s*["']canonical["'][^>]*\/?>/i);
  const has_canonical = !!canonicalMatch;

  // Open Graph
  const has_og_tags = /<meta[^>]*property\s*=\s*["']og:/i.test(html);

  // hreflang
  const has_hreflang = /<link[^>]*hreflang/i.test(html);

  return {
    title,
    meta_description,
    meta_length,
    h1: h1Text,
    h1_contains_location,
    headings_hierarchy,
    has_canonical,
    has_og_tags,
    has_hreflang
  };
}

function detectFaqSection(html) {
  const lower = html.toLowerCase();
  const hasFaqId = /id\s*=\s*["'][^"']*faq[^"']*["']/i.test(html);
  const hasFaqClass = /class\s*=\s*["'][^"']*faq[^"']*["']/i.test(html);
  const hasVeelgesteldeVragen = lower.includes('veelgestelde-vragen') || lower.includes('veelgestelde vragen');
  const hasFaqSchemaPage = /itemtype\s*=\s*["']https?:\/\/schema\.org\/FAQPage["']/i.test(html);

  return hasFaqId || hasFaqClass || hasVeelgesteldeVragen || hasFaqSchemaPage;
}

module.exports = { parseSchemaOrg, parseMetaAndHeadings, detectFaqSection };
