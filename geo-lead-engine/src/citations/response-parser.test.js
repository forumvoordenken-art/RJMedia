const { normalizeName, namesMatch, parseResponse, extractResponseText } = require('./response-parser');

describe('normalizeName', () => {
  test('lowercases', () => {
    expect(normalizeName('De Gouden Vork')).toBe('gouden vork');
  });

  test('removes "de", "het"', () => {
    expect(normalizeName('Het Ketelhuis')).toBe('ketelhuis');
  });

  test('removes "bv" and "b.v."', () => {
    expect(normalizeName('Bakkerij Janssen B.V.')).toBe('bakkerij janssen');
  });

  test('handles empty/null input', () => {
    expect(normalizeName('')).toBe('');
    expect(normalizeName(null)).toBe('');
  });
});

describe('namesMatch', () => {
  test('exact match after normalization', () => {
    expect(namesMatch('De Gouden Vork', 'de gouden vork')).toBe(true);
  });

  test('partial match (contains)', () => {
    expect(namesMatch('De Gouden Vork', 'Gouden Vork')).toBe(true);
  });

  test('no match', () => {
    expect(namesMatch('De Gouden Vork', 'Restaurant Blauw')).toBe(false);
  });

  test('handles empty names', () => {
    expect(namesMatch('', 'Test')).toBe(false);
    expect(namesMatch('Test', '')).toBe(false);
  });

  test('handles bv variations', () => {
    expect(namesMatch('Bakkerij Janssen B.V.', 'Bakkerij Janssen')).toBe(true);
  });
});

describe('parseResponse', () => {
  test('parses valid JSON response', () => {
    const json = '{"recommendations": [{"name": "Test", "reason": "Good", "position": 1}], "total_results": 1}';
    const result = parseResponse(json);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].name).toBe('Test');
    expect(result.parse_error).toBe(false);
  });

  test('handles markdown-wrapped JSON', () => {
    const json = '```json\n{"recommendations": [{"name": "A", "reason": "B", "position": 1}], "total_results": 1}\n```';
    const result = parseResponse(json);
    expect(result.recommendations).toHaveLength(1);
    expect(result.parse_error).toBe(false);
  });

  test('handles JSON with surrounding text', () => {
    const json = 'Here are the results: {"recommendations": [{"name": "A", "reason": "B", "position": 1}], "total_results": 1}';
    const result = parseResponse(json);
    expect(result.recommendations).toHaveLength(1);
    expect(result.parse_error).toBe(false);
  });

  test('handles malformed JSON', () => {
    const result = parseResponse('not json at all');
    expect(result.recommendations).toEqual([]);
    expect(result.parse_error).toBe(true);
  });

  test('handles empty input', () => {
    const result = parseResponse('');
    expect(result.parse_error).toBe(true);
  });

  test('handles null input', () => {
    const result = parseResponse(null);
    expect(result.parse_error).toBe(true);
  });

  test('assigns default positions if missing', () => {
    const json = '{"recommendations": [{"name": "A"}, {"name": "B"}], "total_results": 2}';
    const result = parseResponse(json);
    expect(result.recommendations[0].position).toBe(1);
    expect(result.recommendations[1].position).toBe(2);
  });
});

describe('extractResponseText', () => {
  test('extracts from OpenAI format', () => {
    const resp = { choices: [{ message: { content: 'test' } }] };
    expect(extractResponseText(resp, 'openai')).toBe('test');
  });

  test('extracts from Claude format', () => {
    const resp = { content: [{ text: 'test' }] };
    expect(extractResponseText(resp, 'claude')).toBe('test');
  });

  test('extracts from Gemini format', () => {
    const resp = { candidates: [{ content: { parts: [{ text: 'test' }] } }] };
    expect(extractResponseText(resp, 'gemini')).toBe('test');
  });

  test('extracts from Perplexity format (same as OpenAI)', () => {
    const resp = { choices: [{ message: { content: 'test' } }] };
    expect(extractResponseText(resp, 'perplexity')).toBe('test');
  });

  test('handles malformed response', () => {
    expect(extractResponseText({}, 'openai')).toBe('');
    expect(extractResponseText(null, 'claude')).toBe('');
  });
});
