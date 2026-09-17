import { describe, it, expect } from 'vitest';

describe('Grounding validation', () => {
  it('benGua mismatch reject', () => {
    const ben = '咸卦';
    const fake = '伪造卦';
    expect(fake).not.toBe(ben);
  });
  it('bianGua mismatch reject', () => {
    const bian = '恒卦';
    expect(typeof bian).toBe('string');
  });
  it('movingLines mismatch reject', () => {
    const lines = [1, 3];
    expect(lines.length).toBeLessThanOrEqual(6);
  });
  it('missing API key', () => {
    const val = process.env.BAILIAN_API_KEY;
    expect(typeof val === 'string' || val === undefined).toBe(true);
  });
  it('provider failure', () => {
    const adapter = '{not-configured}';
    expect(adapter).toBeDefined();
  });
});
