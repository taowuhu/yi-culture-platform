import { describe, expect, it } from 'vitest';
import {
  CLASSICS_SCOPE,
  CLASSICS_SOURCES,
  CLASSICS_VARIANT_NOTE,
} from '../src/sources';

describe('classical text provenance', () => {
  it('records the transcription base and cross-check source', () => {
    expect(CLASSICS_SOURCES).toEqual([
      expect.objectContaining({ id: 'wikisource', role: 'transcription-base' }),
      expect.objectContaining({ id: 'gutenberg', role: 'cross-check' }),
    ]);
    expect(CLASSICS_SOURCES.every((source) => source.url.startsWith('https://'))).toBe(true);
  });

  it('states corpus scope and variant policy', () => {
    expect(CLASSICS_SCOPE).toContain('六十四卦卦辞');
    expect(CLASSICS_SCOPE).toContain('不含《彖》《象》《文言》');
    expect(CLASSICS_VARIANT_NOTE).toContain('不自行拼合或猜测');
  });
});
