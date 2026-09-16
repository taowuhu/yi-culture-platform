import { calculateHexagram } from './engine';
// 投一枚铜钱：随机值小于 0.5 时记为 2，否则记为 3。
function castCoin(rng) {
    return rng() < 0.5 ? 2 : 3;
}
// 投三枚铜钱并将总和作为一爻。
export function castLineByCoin(rng = Math.random) {
    const total = castCoin(rng) + castCoin(rng) + castCoin(rng);
    if (total === 6 || total === 7 || total === 8 || total === 9) {
        return total;
    }
    throw new Error(`铜钱起爻得到无效数值: ${total}`);
}
// 连续起六爻，并复用 calculateHexagram 计算完整卦象结果。
export function castByCoin(options) {
    const rng = options?.rng ?? Math.random;
    const lines = [];
    // 每次 push 的顺序依次对应初爻、二爻，直到上爻。
    for (let position = 1; position <= 6; position += 1) {
        lines.push(castLineByCoin(rng));
    }
    return calculateHexagram(lines);
}
