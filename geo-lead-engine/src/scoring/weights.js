/**
 * Score Gewichten Configuratie
 */

const CATEGORY_WEIGHTS = {
  citations: 0.40,
  technical: 0.30,
  content: 0.20,
  performance: 0.10
};

const TECHNICAL_CHECKS = [
  { key: 'has_schema', label: 'Schema.org aanwezig (JSON-LD)', points: 11.1 },
  { key: 'has_local_schema', label: 'LocalBusiness of Organization schema', points: 11.1 },
  { key: 'robots_ok', label: 'robots.txt aanwezig, blokkeert AI niet', points: 11.1 },
  { key: 'has_sitemap', label: 'sitemap.xml aanwezig', points: 11.1 },
  { key: 'is_https', label: 'HTTPS actief', points: 11.1 },
  { key: 'has_llms_txt', label: 'llms.txt aanwezig', points: 11.1 },
  { key: 'has_faq_schema', label: 'FAQ schema aanwezig', points: 11.1 },
  { key: 'has_heading_hierarchy', label: 'Semantic HTML (correcte H1-H6)', points: 11.1 },
  { key: 'cwv_ok', label: 'Core Web Vitals goed (mobile > 50)', points: 11.2 }
];

const CONTENT_SCORING = {
  meta_description_ok: 25,    // Aanwezig en > 120 tekens
  h1_contains_location: 25,   // H1 bevat branche of locatie
  has_faq_section: 25,        // FAQ sectie aanwezig
  has_og_tags: 15,            // Open Graph tags aanwezig
  has_canonical: 10           // Canonical URL correct
};

module.exports = { CATEGORY_WEIGHTS, TECHNICAL_CHECKS, CONTENT_SCORING };
