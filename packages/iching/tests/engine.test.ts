import { describe, expect, it } from 'vitest';
import { HEXAGRAMS } from '../src/hexagrams';
import {
  calculateHexagram,
  identifyHexagram,
  identifyHexagramTrigrams,
  identifyTrigram,
} from '../src/engine';
import type { LineValue } from '../src/types';

describe('calculateHexagram', () => {
  it('输入全部为 7，应得到全 yang 的本卦，无动爻，无变卦', () => {
    const result = calculateHexagram([7, 7, 7, 7, 7, 7]);

    expect(result.benGua.lines).toEqual([
      'yang', 'yang', 'yang', 'yang', 'yang', 'yang',
    ]);
    expect(result.movingLines).toEqual([]);
    expect(result.bianGua).toBeUndefined();
  });

  it('输入全部为 8，应得到全 yin 的本卦，无动爻，无变卦', () => {
    const result = calculateHexagram([8, 8, 8, 8, 8, 8]);

    expect(result.benGua.lines).toEqual([
      'yin', 'yin', 'yin', 'yin', 'yin', 'yin',
    ]);
    expect(result.movingLines).toEqual([]);
    expect(result.bianGua).toBeUndefined();
  });

  it('应正确计算混合卦的本卦、变卦和动爻', () => {
    const result = calculateHexagram([7, 8, 6, 9, 7, 8]);

    expect(result.benGua.lines).toEqual([
      'yang', 'yin', 'yin', 'yang', 'yang', 'yin',
    ]);
    expect(result.movingLines).toEqual([3, 4]);
    expect(result.bianGua?.lines).toEqual([
      'yang', 'yin', 'yang', 'yin', 'yang', 'yin',
    ]);
  });

  it('输入长度不是 6 时，必须抛出错误', () => {
    expect(() => calculateHexagram([6, 7, 8])).toThrow(
      '输入必须恰好包含6个爻'
    );
  });

  it('同一输入连续调用两次，结果完全一致', () => {
    const input: LineValue[] = [6, 7, 9, 8, 6, 7];
    const first = calculateHexagram(input);
    const second = calculateHexagram(input);

    expect(second).toEqual(first);
  });
});

describe('identifyTrigram', () => {
  it('应识别全部八卦', () => {
    expect(identifyTrigram(['yang', 'yang', 'yang'])).toBe('乾');
    expect(identifyTrigram(['yang', 'yang', 'yin'])).toBe('兑');
    expect(identifyTrigram(['yang', 'yin', 'yang'])).toBe('离');
    expect(identifyTrigram(['yang', 'yin', 'yin'])).toBe('震');
    expect(identifyTrigram(['yin', 'yang', 'yang'])).toBe('巽');
    expect(identifyTrigram(['yin', 'yang', 'yin'])).toBe('坎');
    expect(identifyTrigram(['yin', 'yin', 'yang'])).toBe('艮');
    expect(identifyTrigram(['yin', 'yin', 'yin'])).toBe('坤');
  });

  it('输入长度不是 3 时，必须抛出错误', () => {
    expect(() => identifyTrigram(['yang', 'yang'])).toThrow(
      '输入必须恰好包含3个爻'
    );
    expect(() => identifyTrigram(['yang', 'yang', 'yang', 'yang'])).toThrow(
      '输入必须恰好包含3个爻'
    );
  });
});

describe('identifyHexagramTrigrams', () => {
  it('应识别下乾上坤', () => {
    expect(
      identifyHexagramTrigrams([
        'yang', 'yang', 'yang', 'yin', 'yin', 'yin',
      ])
    ).toEqual({ lower: '乾', upper: '坤' });
  });

  it('应识别下坎上离', () => {
    expect(
      identifyHexagramTrigrams([
        'yin', 'yang', 'yin', 'yang', 'yin', 'yang',
      ])
    ).toEqual({ lower: '坎', upper: '离' });
  });

  it('应识别下震上巽', () => {
    expect(
      identifyHexagramTrigrams([
        'yang', 'yin', 'yin', 'yin', 'yang', 'yang',
      ])
    ).toEqual({ lower: '震', upper: '巽' });
  });

  it('输入长度不是 6 时，必须抛出错误', () => {
    expect(() => identifyHexagramTrigrams(['yang', 'yang', 'yang'])).toThrow(
      '输入必须恰好包含6个爻'
    );
  });
});

describe('identifyHexagram', () => {
  it('应识别乾下乾上为第 1 卦乾', () => {
    const result = identifyHexagram([
      'yang', 'yang', 'yang', 'yang', 'yang', 'yang',
    ]);

    expect(result).toEqual({
      index: 1,
      name: '乾',
      lowerTrigram: '乾',
      upperTrigram: '乾',
      guaCi: '元亨。利貞。',
      yaoCi: [
        '潛龍勿用。',
        '見龍在田，利見大人。',
        '君子終日乾乾，夕惕若；厲，无咎。',
        '或躍在淵，无咎。',
        '飛龍在天，利見大人。',
        '亢龍，有悔。',
      ],
      lines: ['yang', 'yang', 'yang', 'yang', 'yang', 'yang'],
    });
  });

  it('应识别坤下坤上为第 2 卦坤', () => {
    const result = identifyHexagram([
      'yin', 'yin', 'yin', 'yin', 'yin', 'yin',
    ]);

    expect(result.index).toBe(2);
    expect(result.name).toBe('坤');
  });

  it('应识别震下坎上为第 3 卦屯', () => {
    const result = identifyHexagram([
      'yang', 'yin', 'yin', 'yin', 'yang', 'yin',
    ]);

    expect(result.index).toBe(3);
    expect(result.name).toBe('屯');
  });

  it('应识别乾下坤上为第 11 卦泰', () => {
    const result = identifyHexagram([
      'yang', 'yang', 'yang', 'yin', 'yin', 'yin',
    ]);

    expect(result.index).toBe(11);
    expect(result.name).toBe('泰');
  });

  it('应识别坤下乾上为第 12 卦否', () => {
    const result = identifyHexagram([
      'yin', 'yin', 'yin', 'yang', 'yang', 'yang',
    ]);

    expect(result.index).toBe(12);
    expect(result.name).toBe('否');
  });

  it('应识别坎下坎上为第 29 卦坎', () => {
    const result = identifyHexagram([
      'yin', 'yang', 'yin', 'yin', 'yang', 'yin',
    ]);

    expect(result.index).toBe(29);
    expect(result.name).toBe('坎');
  });

  it('应识别离下离上为第 30 卦离', () => {
    const result = identifyHexagram([
      'yang', 'yin', 'yang', 'yang', 'yin', 'yang',
    ]);

    expect(result.index).toBe(30);
    expect(result.name).toBe('离');
  });

  it('应识别离下坎上为第 63 卦既济', () => {
    const result = identifyHexagram([
      'yang', 'yin', 'yang', 'yin', 'yang', 'yin',
    ]);

    expect(result.index).toBe(63);
    expect(result.name).toBe('既济');
  });

  it('输入长度不是 6 时，必须抛出错误', () => {
    expect(() => identifyHexagram(['yang', 'yang', 'yang'])).toThrow(
      '输入必须恰好包含6个爻'
    );
  });
});

describe('文王六十四卦数据', () => {
  it('数据总数必须恰好为 64', () => {
    expect(Object.keys(HEXAGRAMS)).toHaveLength(64);
  });

  it('64 个 lower|upper 组合必须唯一且与记录内容一致', () => {
    const entries = Object.entries(HEXAGRAMS);
    const keys = entries.map(([key]) => key);

    expect(new Set(keys).size).toBe(64);

    for (const [key, hexagram] of entries) {
      expect(key).toBe(
        `${hexagram.lowerTrigram}|${hexagram.upperTrigram}`
      );
    }
  });
});
