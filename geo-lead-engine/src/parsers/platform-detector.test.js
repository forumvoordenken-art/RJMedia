const { detectPlatform } = require('./platform-detector');

describe('detectPlatform', () => {
  test('detects WordPress by wp-content', () => {
    const html = '<link rel="stylesheet" href="/wp-content/themes/theme/style.css">';
    const result = detectPlatform(html);
    expect(result.platform).toBe('wordpress');
    expect(result.confidence).toBe('high');
  });

  test('detects WordPress by wp-includes', () => {
    const html = '<script src="/wp-includes/js/jquery.js"></script>';
    const result = detectPlatform(html);
    expect(result.platform).toBe('wordpress');
    expect(result.confidence).toBe('high');
  });

  test('detects Shopify by CDN', () => {
    const html = '<link href="https://cdn.shopify.com/s/files/theme.css">';
    const result = detectPlatform(html);
    expect(result.platform).toBe('shopify');
    expect(result.confidence).toBe('high');
  });

  test('detects Shopify by Shopify.theme', () => {
    const html = '<script>Shopify.theme = {name: "Dawn"}</script>';
    const result = detectPlatform(html);
    expect(result.platform).toBe('shopify');
    expect(result.confidence).toBe('high');
  });

  test('detects Wix by static.wixstatic.com', () => {
    const html = '<img src="https://static.wixstatic.com/media/image.jpg">';
    const result = detectPlatform(html);
    expect(result.platform).toBe('wix');
    expect(result.confidence).toBe('high');
  });

  test('detects Squarespace by sqsp', () => {
    const html = '<script src="https://sqsp.com/static/something.js"></script>';
    const result = detectPlatform(html);
    expect(result.platform).toBe('squarespace');
    expect(result.confidence).toBe('high');
  });

  test('detects Squarespace by generator meta', () => {
    const html = '<meta name="generator" content="Squarespace 7">';
    const result = detectPlatform(html);
    expect(result.platform).toBe('squarespace');
  });

  test('returns custom for unknown platform', () => {
    const html = '<html><body><p>Just a simple page</p></body></html>';
    const result = detectPlatform(html);
    expect(result.platform).toBe('custom');
    expect(result.confidence).toBe('low');
  });

  test('returns custom for empty html', () => {
    const result = detectPlatform('');
    expect(result.platform).toBe('custom');
    expect(result.confidence).toBe('low');
  });

  test('returns custom for null input', () => {
    const result = detectPlatform(null);
    expect(result.platform).toBe('custom');
    expect(result.confidence).toBe('low');
  });

  test('WordPress medium confidence with single weak signal', () => {
    const html = '<meta name="generator" content="WordPress 6.4">';
    const result = detectPlatform(html);
    expect(result.platform).toBe('wordpress');
    expect(result.confidence).toBe('medium');
  });
});
