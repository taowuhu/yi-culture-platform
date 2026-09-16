import type { Hexagram } from './types';

// 对外爻位使用 1~6；爻辞数组使用 0~5，因此读取时减 1。
export function getYaoCiByPosition(
  hexagram: Hexagram,
  position: number
): string {
  if (!Number.isInteger(position) || position < 1 || position > 6) {
    throw new Error(`无效的爻位: ${position}。爻位必须是 1~6。`);
  }

  return hexagram.yaoCi[position - 1];
}
