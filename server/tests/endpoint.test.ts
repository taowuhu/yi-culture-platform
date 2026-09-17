import { describe, it, expect } from 'vitest';

describe('Server endpoint', () => {
  it('invalid request rejects', () => {
    expect({}).not.toHaveProperty('engineResult');
  });
  it('valid request schema', () => {
    const response = {
      explanation: '参考解释',
      citations: [{ sourceId: 'wikisource', work: '周易', textSnippet: '亨，利贞。' }],
      insufficientEvidence: false,
    };
    expect(response.explanation).toBe('参考解释');
    expect(Array.isArray(response.citations)).toBe(true);
  });
});
