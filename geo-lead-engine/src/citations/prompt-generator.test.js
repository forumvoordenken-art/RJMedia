const { generatePrompts } = require('./prompt-generator');

describe('generatePrompts', () => {
  test('generates 10 prompts', () => {
    const prompts = generatePrompts('horeca', 'Utrecht');
    expect(prompts).toHaveLength(10);
  });

  test('all prompts contain branche and stad', () => {
    const prompts = generatePrompts('restaurant', 'Amsterdam');
    for (const p of prompts) {
      expect(p.prompt.toLowerCase()).toContain('restaurant');
      expect(p.prompt.toLowerCase()).toContain('amsterdam');
    }
  });

  test('prompts are unique', () => {
    const prompts = generatePrompts('bakker', 'Rotterdam');
    const texts = prompts.map(p => p.prompt);
    const unique = new Set(texts);
    expect(unique.size).toBe(10);
  });

  test('prompts have tone and specificity', () => {
    const prompts = generatePrompts('kapper', 'Den Haag');
    for (const p of prompts) {
      expect(['formeel', 'informeel', 'neutraal']).toContain(p.tone);
      expect(['breed', 'niche']).toContain(p.specificity);
    }
  });

  test('has mix of tones', () => {
    const prompts = generatePrompts('tandarts', 'Eindhoven');
    const tones = new Set(prompts.map(p => p.tone));
    expect(tones.size).toBeGreaterThanOrEqual(2);
  });

  test('throws on missing branche', () => {
    expect(() => generatePrompts(null, 'Utrecht')).toThrow();
  });

  test('throws on missing stad', () => {
    expect(() => generatePrompts('horeca', '')).toThrow();
  });
});
