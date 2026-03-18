const { routeLead } = require('./lead-router');

describe('routeLead', () => {
  const rapportData = { platform: 'wordpress', branche: 'horeca' };

  test('beheertype=bureau → Route B', () => {
    const intake = { beheertype: 'bureau', toestemming: 'ja' };
    const result = routeLead(intake, rapportData);
    expect(result.route).toBe('B');
    expect(result.doorverkoopbaar).toBe(false);
    expect(result.action).toBe('send_report_email');
    expect(result.crm_tags).toContain('route-b');
    expect(result.crm_tags).toContain('heeft-bureau');
  });

  test('beheertype=zelf, toestemming=ja → Route A', () => {
    const intake = { beheertype: 'zelf', toestemming: 'ja' };
    const result = routeLead(intake, rapportData);
    expect(result.route).toBe('A');
    expect(result.doorverkoopbaar).toBe(true);
    expect(result.action).toBe('match_partner_bureau');
    expect(result.bureau_match).toBeDefined();
    expect(result.bureau_match.bureau_types).toContain('wp-bureau');
  });

  test('beheertype=zelf, toestemming=nee → Route A-passief', () => {
    const intake = { beheertype: 'zelf', toestemming: 'nee' };
    const result = routeLead(intake, rapportData);
    expect(result.route).toBe('A-passief');
    expect(result.doorverkoopbaar).toBe(false);
    expect(result.action).toBe('nurturing');
    expect(result.crm_tags).toContain('geen-toestemming');
  });

  test('beheertype=niemand, toestemming=ja → Route A', () => {
    const intake = { beheertype: 'niemand', toestemming: 'ja' };
    const result = routeLead(intake, rapportData);
    expect(result.route).toBe('A');
    expect(result.doorverkoopbaar).toBe(true);
    expect(result.crm_tags).toContain('niemand');
  });

  test('beheertype=niemand, toestemming=nee → Route A-passief', () => {
    const intake = { beheertype: 'niemand', toestemming: 'nee' };
    const result = routeLead(intake, rapportData);
    expect(result.route).toBe('A-passief');
    expect(result.doorverkoopbaar).toBe(false);
  });

  test('shopify platform gets shopify-partner bureaus', () => {
    const intake = { beheertype: 'zelf', toestemming: 'ja' };
    const result = routeLead(intake, { platform: 'shopify', branche: 'retail' });
    expect(result.bureau_match.bureau_types).toContain('shopify-partner');
    expect(result.bureau_match.lead_value).toBe('hoog');
  });

  test('wix platform gets platform-expert bureaus', () => {
    const intake = { beheertype: 'niemand', toestemming: 'ja' };
    const result = routeLead(intake, { platform: 'wix', branche: 'coaching' });
    expect(result.bureau_match.bureau_types).toContain('platform-expert');
    expect(result.bureau_match.lead_value).toBe('medium');
  });

  test('custom platform gets webdev-bureau', () => {
    const intake = { beheertype: 'zelf', toestemming: 'ja' };
    const result = routeLead(intake, { platform: 'custom', branche: 'ict' });
    expect(result.bureau_match.bureau_types).toContain('webdev-bureau');
    expect(result.bureau_match.lead_value).toBe('hoog');
  });

  test('handles missing rapportData gracefully', () => {
    const intake = { beheertype: 'zelf', toestemming: 'ja' };
    const result = routeLead(intake, null);
    expect(result.route).toBe('A');
    expect(result.bureau_match.bureau_types).toContain('webdev-bureau');
  });
});
