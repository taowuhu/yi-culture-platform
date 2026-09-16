import { calculateHexagram } from './engine';
import type { HexagramResult, LineValue } from './types';

// 投一枚铜钱：随机值小于 0.5 时记为 2，否则记为 3。
function castCoin(rng: () => number): 2 | 3 {
  return rng() < 0.5 ? 2 : 3;
}

// 投三枚铜钱并将总和作为一爻。
export function castLineByCoin(rng: () => number = Math.random): LineValue {
  const total = castCoin(rng) + castCoin(rng) + castCoin(rng);

  if (total === 6 || total === 7 || total === 8 || total === 9) {
    return total;
  }

  throw new Error(`铜钱起爻得到无效数值: ${total}`);
}

// 连续起六爻，并复用 calculateHexagram 计算完整卦象结果。
export function castByCoin(options?: { rng?: () => number }): HexagramResult {
  const rng = options?.rng ?? Math.random;
  const lines: LineValue[] = [];

  // 每次 push 的顺序依次对应初爻、二爻，直到上爻。
  for (let position = 1; position <= 6; position += 1) {
    lines.push(castLineByCoin(rng));
  }

  return calculateHexagram(lines);
}
