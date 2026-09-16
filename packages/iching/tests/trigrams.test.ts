import { describe, expect, it } from 'vitest';
import {
  getTrigramByLines,
  getTrigramLines,
  TRIGRAM_LINES,
} from '../src/trigrams';

describe('共享八卦结构', () => {
  it('应包含八个互不重复的三爻结构', () => {
    const structures = Object.values(TRIGRAM_LINES).map((lines) =>
      lines.join(',')
    );

    expect(structures).toHaveLength(8);
    expect(new Set(structures).size).toBe(8);
  });

  it('正向与反向查询应对全部八卦互为逆操作', () => {
    for (const [name, lines] of Object.entries(TRIGRAM_LINES)) {
      expect(getTrigramLines(name as keyof typeof TRIGRAM_LINES)).toBe(lines);
      expect(getTrigramByLines(lines)).toBe(name);
    }
  });

  it('不存在的三爻结构应返回 undefined', () => {
    expect(getTrigramByLines(['yang', 'yin'])).toBeUndefined();
  });
});
