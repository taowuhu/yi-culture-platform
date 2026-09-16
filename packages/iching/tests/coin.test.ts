import { describe, expect, it } from 'vitest';
import { castByCoin, castLineByCoin } from '../src/coin';
import { calculateHexagram } from '../src/engine';
import type { LineValue } from '../src/types';

function createSequenceRng(values: number[]): () => number {
  let index = 0;

  return () => {
    const value = values[index];

    if (value === undefined) {
      throw new Error('测试随机序列已经用完');
    }

    index += 1;
    return value;
  };
}

function coinValuesToRng(coinValues: Array<2 | 3>): () => number {
  const rngValues = coinValues.map((value) => value === 2 ? 0.25 : 0.75);
  return createSequenceRng(rngValues);
}

describe('castLineByCoin', () => {
  it('三枚铜钱都是 2 时，应得到 6', () => {
    expect(castLineByCoin(coinValuesToRng([2, 2, 2]))).toBe(6);
  });

  it('三枚铜钱是 2、2、3 时，应得到 7', () => {
    expect(castLineByCoin(coinValuesToRng([2, 2, 3]))).toBe(7);
  });

  it('三枚铜钱是 2、3、3 时，应得到 8', () => {
    expect(castLineByCoin(coinValuesToRng([2, 3, 3]))).toBe(8);
  });

  it('三枚铜钱都是 3 时，应得到 9', () => {
    expect(castLineByCoin(coinValuesToRng([3, 3, 3]))).toBe(9);
  });
});

describe('castByCoin', () => {
  const coinSequence: Array<2 | 3> = [
    2, 2, 2, // 初爻：6
    2, 2, 3, // 二爻：7
    2, 3, 3, // 三爻：8
    3, 3, 3, // 四爻：9
    2, 2, 3, // 五爻：7
    2, 3, 3, // 上爻：8
  ];

  it('相同的固定 rng 序列应产生完全相同的结果', () => {
    const first = castByCoin({ rng: coinValuesToRng(coinSequence) });
    const second = castByCoin({ rng: coinValuesToRng(coinSequence) });

    expect(second).toEqual(first);
  });

  it('应把六爻直接交给 calculateHexagram 生成完整结果', () => {
    const expectedLines: LineValue[] = [6, 7, 8, 9, 7, 8];
    const expected = calculateHexagram(expectedLines);
    const result = castByCoin({ rng: coinValuesToRng(coinSequence) });

    expect(result).toEqual(expected);
    expect(result.benGua.name).toBe('困');
    expect(result.movingLines).toEqual([1, 4]);
    expect(result.bianGua?.name).toBe('节');
  });
});
