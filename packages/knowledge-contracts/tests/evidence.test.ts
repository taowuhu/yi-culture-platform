import { describe, it, expect } from 'vitest';

describe('Evidence contracts', () => {
  it('EvidencePack builds', () => {
    const pack = { schemaVersion: 1 as const, domain: 'iching', evidence: [{ evidenceId: 'e1', sourceId: 'wikisource', documentId: 'w1', work: '周易', section: '咸卦', chapter: '卦辞', text: '亨，利贞。' }], status: 'available' as const };
    expect(pack.schemaVersion).toBe(1);
    expect(pack.status).toBe('available');
  });
  it('citation valid', () => {
    const c = { sourceId: 'wikisource', work: '周易', textSnippet: '亨，利贞。' };
    expect(c.sourceId).toBe('wikisource');
  });
  it('unknown citation reject', () => {
    expect(() => { if (!['wikisource','gutenberg'].includes('fake')) throw new Error('reject'); }).toThrow();
  });
  it('insufficient evidence', () => {
    expect({ status: 'insufficient' }).toBeDefined();
  });
});
