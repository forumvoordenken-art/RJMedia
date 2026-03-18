const { parseSchemaOrg, parseMetaAndHeadings, detectFaqSection } = require('./html-parser');

describe('parseSchemaOrg', () => {
  test('detects JSON-LD schema types', () => {
    const html = `
      <html><head>
      <script type="application/ld+json">
      {"@type": "LocalBusiness", "name": "Test"}
      </script>
      </head><body></body></html>
    `;
    const result = parseSchemaOrg(html);
    expect(result.found).toContain('LocalBusiness');
    expect(result.has_faq_schema).toBe(false);
  });

  test('detects FAQ schema', () => {
    const html = `
      <script type="application/ld+json">
      {"@type": "FAQPage", "mainEntity": []}
      </script>
    `;
    const result = parseSchemaOrg(html);
    expect(result.found).toContain('FAQPage');
    expect(result.has_faq_schema).toBe(true);
  });

  test('handles @graph structure', () => {
    const html = `
      <script type="application/ld+json">
      {"@graph": [{"@type": "Organization"}, {"@type": "WebSite"}]}
      </script>
    `;
    const result = parseSchemaOrg(html);
    expect(result.found).toContain('Organization');
    expect(result.found).toContain('WebSite');
  });

  test('handles multiple schema blocks', () => {
    const html = `
      <script type="application/ld+json">{"@type": "Organization"}</script>
      <script type="application/ld+json">{"@type": "BreadcrumbList"}</script>
    `;
    const result = parseSchemaOrg(html);
    expect(result.found).toContain('Organization');
    expect(result.found).toContain('BreadcrumbList');
  });

  test('handles malformed JSON-LD gracefully', () => {
    const html = `<script type="application/ld+json">not valid json</script>`;
    const result = parseSchemaOrg(html);
    expect(result.found).toEqual([]);
  });

  test('returns missing important types', () => {
    const html = `<html><body></body></html>`;
    const result = parseSchemaOrg(html);
    expect(result.missing).toContain('Organization');
    expect(result.missing).toContain('LocalBusiness');
  });

  test('handles array @type', () => {
    const html = `
      <script type="application/ld+json">
      {"@type": ["LocalBusiness", "Restaurant"]}
      </script>
    `;
    const result = parseSchemaOrg(html);
    expect(result.found).toContain('LocalBusiness');
    expect(result.found).toContain('Restaurant');
  });
});

describe('parseMetaAndHeadings', () => {
  test('extracts title and meta description', () => {
    const html = `
      <html><head>
        <title>Test Page</title>
        <meta name="description" content="This is a test description that is long enough to pass the check because it has more than one hundred and twenty characters in total">
      </head><body><h1>Main Heading</h1></body></html>
    `;
    const result = parseMetaAndHeadings(html, 'restaurant', 'Utrecht');
    expect(result.title).toBe('Test Page');
    expect(result.meta_description).toContain('test description');
    expect(result.meta_length).toBeGreaterThan(120);
    expect(result.h1).toBe('Main Heading');
  });

  test('detects h1 containing branche', () => {
    const html = `<h1>Beste restaurant in Utrecht</h1>`;
    const result = parseMetaAndHeadings(html, 'restaurant', 'Utrecht');
    expect(result.h1_contains_location).toBe(true);
  });

  test('detects h1 containing stad', () => {
    const html = `<h1>Welkom in Utrecht</h1>`;
    const result = parseMetaAndHeadings(html, 'bakker', 'Utrecht');
    expect(result.h1_contains_location).toBe(true);
  });

  test('h1 without location returns false', () => {
    const html = `<h1>Welkom op onze website</h1>`;
    const result = parseMetaAndHeadings(html, 'restaurant', 'Utrecht');
    expect(result.h1_contains_location).toBe(false);
  });

  test('detects canonical URL', () => {
    const html = `<link rel="canonical" href="https://example.nl/">`;
    const result = parseMetaAndHeadings(html, '', '');
    expect(result.has_canonical).toBe(true);
  });

  test('detects Open Graph tags', () => {
    const html = `<meta property="og:title" content="Test">`;
    const result = parseMetaAndHeadings(html, '', '');
    expect(result.has_og_tags).toBe(true);
  });

  test('handles missing meta description', () => {
    const html = `<html><head><title>Test</title></head><body></body></html>`;
    const result = parseMetaAndHeadings(html, '', '');
    expect(result.meta_description).toBe('');
    expect(result.meta_length).toBe(0);
  });

  test('checks heading hierarchy starts with h1', () => {
    const html = `<h1>Title</h1><h2>Sub</h2>`;
    const result = parseMetaAndHeadings(html, '', '');
    expect(result.headings_hierarchy).toBe(true);
  });

  test('detects bad heading hierarchy', () => {
    const html = `<h2>Sub only</h2><h3>Sub sub</h3>`;
    const result = parseMetaAndHeadings(html, '', '');
    expect(result.headings_hierarchy).toBe(false);
  });
});

describe('detectFaqSection', () => {
  test('detects FAQ by id', () => {
    expect(detectFaqSection('<div id="faq-section">FAQ</div>')).toBe(true);
  });

  test('detects FAQ by class', () => {
    expect(detectFaqSection('<div class="faq-wrapper">FAQ</div>')).toBe(true);
  });

  test('detects veelgestelde-vragen', () => {
    expect(detectFaqSection('<section>veelgestelde-vragen</section>')).toBe(true);
  });

  test('detects FAQPage itemtype', () => {
    expect(detectFaqSection('<div itemtype="https://schema.org/FAQPage"></div>')).toBe(true);
  });

  test('returns false when no FAQ', () => {
    expect(detectFaqSection('<div>Just a regular page</div>')).toBe(false);
  });
});
