const {
  calculateCitationsScore,
  calculateTechnicalScore,
  calculateContentScore,
  calculatePerformanceScore,
  calculateGeoScore
} = require('./calculator');

describe('calculateCitationsScore', () => {
  test('returns 0 for null input', () => {
    expect(calculateCitationsScore(null)).toBe(0);
  });

  test('calculates weighted score correctly', () => {
    // avg_citation_rate=50, platform_coverage=75
    // 50*0.7 + 75*0.3 = 35 + 22.5 = 57.5 → 58
    const result = calculateCitationsScore({ avg_citation_rate: 50, platform_coverage: 75 });
    expect(result).toBe(58);
  });

  test('returns 0 for zero citations', () => {
    const result = calculateCitationsScore({ avg_citation_rate: 0, platform_coverage: 0 });
    expect(result).toBe(0);
  });

  test('returns 100 for perfect citations', () => {
    const result = calculateCitationsScore({ avg_citation_rate: 100, platform_coverage: 100 });
    expect(result).toBe(100);
  });
});

describe('calculateTechnicalScore', () => {
  test('returns 0 for null input', () => {
    expect(calculateTechnicalScore(null)).toBe(0);
  });

  test('returns 0 when all checks fail', () => {
    const checks = {
      has_schema: false, has_local_schema: false, robots_ok: false,
      has_sitemap: false, is_https: false, has_llms_txt: false,
      has_faq_schema: false, has_heading_hierarchy: false, cwv_ok: false
    };
    expect(calculateTechnicalScore(checks)).toBe(0);
  });

  test('returns 100 when all checks pass', () => {
    const checks = {
      has_schema: true, has_local_schema: true, robots_ok: true,
      has_sitemap: true, is_https: true, has_llms_txt: true,
      has_faq_schema: true, has_heading_hierarchy: true, cwv_ok: true
    };
    expect(calculateTechnicalScore(checks)).toBe(100);
  });

  test('returns partial score', () => {
    const checks = {
      has_schema: true, has_local_schema: false, robots_ok: true,
      has_sitemap: true, is_https: true, has_llms_txt: false,
      has_faq_schema: false, has_heading_hierarchy: true, cwv_ok: false
    };
    // 5 * 11.1 = 55.5 → 56
    const score = calculateTechnicalScore(checks);
    expect(score).toBe(56);
  });
});

describe('calculateContentScore', () => {
  test('returns 0 for null input', () => {
    expect(calculateContentScore(null)).toBe(0);
  });

  test('returns 100 for all content checks passing', () => {
    const content = {
      meta_description_ok: true,
      h1_contains_location: true,
      has_faq_section: true,
      has_og_tags: true,
      has_canonical: true
    };
    expect(calculateContentScore(content)).toBe(100);
  });

  test('returns correct partial score', () => {
    // meta_description_ok=25 + has_canonical=10 = 35
    const content = {
      meta_description_ok: true,
      h1_contains_location: false,
      has_faq_section: false,
      has_og_tags: false,
      has_canonical: true
    };
    expect(calculateContentScore(content)).toBe(35);
  });
});

describe('calculatePerformanceScore', () => {
  test('returns 0 for null input', () => {
    expect(calculatePerformanceScore(null)).toBe(0);
  });

  test('returns mobile score directly', () => {
    expect(calculatePerformanceScore({ mobile: { score: 75 } })).toBe(75);
  });

  test('clamps to 0-100 range', () => {
    expect(calculatePerformanceScore({ mobile: { score: 150 } })).toBe(100);
    expect(calculatePerformanceScore({ mobile: { score: -10 } })).toBe(0);
  });
});

describe('calculateGeoScore', () => {
  test('calculates correct total with all components', () => {
    const result = calculateGeoScore({
      citations: { avg_citation_rate: 50, platform_coverage: 50 },
      technical: {
        has_schema: true, has_local_schema: true, robots_ok: true,
        has_sitemap: true, is_https: true, has_llms_txt: true,
        has_faq_schema: true, has_heading_hierarchy: true, cwv_ok: true
      },
      content: {
        meta_description_ok: true, h1_contains_location: true,
        has_faq_section: true, has_og_tags: true, has_canonical: true
      },
      performance: { mobile: { score: 80 } }
    });

    // citations: 50*0.7 + 50*0.3 = 50 → 50*0.4 = 20
    // technical: 100 → 100*0.3 = 30
    // content: 100 → 100*0.2 = 20
    // performance: 80 → 80*0.1 = 8
    // total = 78
    expect(result.total).toBe(78);
    expect(result.breakdown.citations).toBe(50);
    expect(result.breakdown.technical).toBe(100);
    expect(result.breakdown.content).toBe(100);
    expect(result.breakdown.performance).toBe(80);
  });

  test('handles all zeros', () => {
    const result = calculateGeoScore({
      citations: null,
      technical: null,
      content: null,
      performance: null
    });
    expect(result.total).toBe(0);
  });

  test('is deterministic', () => {
    const input = {
      citations: { avg_citation_rate: 30, platform_coverage: 50 },
      technical: { has_schema: true, has_local_schema: false, robots_ok: true,
        has_sitemap: true, is_https: true, has_llms_txt: false,
        has_faq_schema: false, has_heading_hierarchy: true, cwv_ok: false },
      content: { meta_description_ok: true, h1_contains_location: false,
        has_faq_section: true, has_og_tags: false, has_canonical: true },
      performance: { mobile: { score: 65 } }
    };
    const r1 = calculateGeoScore(input);
    const r2 = calculateGeoScore(input);
    expect(r1).toEqual(r2);
  });
});
