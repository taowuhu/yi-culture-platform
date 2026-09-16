import { HEXAGRAMS } from './hexagrams';
import { getTrigramByLines } from './trigrams';
import type {
  Hexagram,
  HexagramResult,
  HexagramTrigrams,
  LineValue,
  TrigramName,
  YinYang,
} from './types';

// 卦爻转换规则：将数值转换为阴阳（本卦用）
const lineToYinYang = (line: LineValue): YinYang => {
  switch (line) {
    case 6: return 'yin';  // 本卦: yin
    case 7: return 'yang'; // 本卦: yang
    case 8: return 'yin';  // 本卦: yin
    case 9: return 'yang'; // 本卦: yang
    default: throw new Error(`Invalid line value: ${line}. Must be 6, 7, 8, or 9.`);
  }
};

// 变卦转换规则：动爻的变化（6→yang, 9→yin）
const getChangedValue = (line: LineValue): LineValue => {
  switch (line) {
    case 6: return 7; // 6 → yang (7)
    case 9: return 8; // 9 → yin (8)
    default: return line; // 7, 8 保持不变（不动爻）
  }
};

// 计算卦象
export function calculateHexagram(lines: LineValue[]): HexagramResult {
  // 1. 验证输入长度
  if (lines.length !== 6) {
    throw new Error('输入必须恰好包含6个爻，当前长度: ' + lines.length);
  }

  // 2. 转换本卦（保持原始阴阳状态）
  const benGuaLines: YinYang[] = lines.map(lineToYinYang);

  // 3. 检查动爻并构建变卦（如果有动爻）
  const movingLines: number[] = []; // 存储 1~6 的动爻位置（对外接口用）
  let bianGuaLines: YinYang[] | undefined;

  for (let i = 0; i < 6; i++) {
    const line = lines[i];
    if (line === 6 || line === 9) { // 6和9是动爻
      movingLines.push(i + 1); // 1~6 表示位置（index 0 = 第一爻）
    }
  }

  // 只有有动爻时才构建变卦
  if (movingLines.length > 0) {
    bianGuaLines = lines.map((line, index) => {
      if (lines[index] === 6 || lines[index] === 9) {
        // 动爻：转换为变卦状态
        return lineToYinYang(getChangedValue(lines[index]));
      }
      // 静爻：保持不变
      return lineToYinYang(line);
    });
  }

  // 4. 构建并返回结果
  const result: HexagramResult = {
    benGua: identifyHexagram(benGuaLines),
    movingLines: movingLines
  };

  // 条件添加变卦（只有有动爻时）
  if (bianGuaLines) {
    result.bianGua = identifyHexagram(bianGuaLines);
  }

  return result;
}

// 识别八卦：根据连续三个 YinYang 值（bottom-up）返回对应的 TrigramName
export function identifyTrigram(lines: YinYang[]): TrigramName {
  // 1. 验证输入长度
  if (lines.length !== 3) {
    throw new Error('输入必须恰好包含3个爻，当前长度: ' + lines.length);
  }

  // 2. 从共享八卦结构反向识别卦名
  const trigram = getTrigramByLines(lines);

  // 3. 如果找不到（理论上不会发生，因为 YinYang 只有 yin/yang），抛出清晰错误
  if (!trigram) {
    throw new Error(`无效的卦象: ${lines.join(',')}`);
  }

  return trigram;
}

// 识别六爻卦的上下卦：将 6 个爻拆分为下卦（前 3 个）和上卦（后 3 个）
export function identifyHexagramTrigrams(lines: YinYang[]): HexagramTrigrams {
  // 1. 验证输入长度
  if (lines.length !== 6) {
    throw new Error('输入必须恰好包含6个爻，当前长度: ' + lines.length);
  }

  // 2. 拆分：前 3 个为下卦，后 3 个为上卦（bottom-up 顺序不变）
  const lowerLines = lines.slice(0, 3);
  const upperLines = lines.slice(3, 6);

  // 3. 复用现有 identifyTrigram，不重复写八卦识别逻辑
  const lower = identifyTrigram(lowerLines);
  const upper = identifyTrigram(upperLines);

  return { lower, upper };
}

// 识别六爻卦：复用上下卦识别结果查询文王六十四卦映射。
export function identifyHexagram(lines: YinYang[]): Hexagram {
  const { lower, upper } = identifyHexagramTrigrams(lines);
  const key = `${lower}|${upper}`;
  const match = HEXAGRAMS[key];

  if (!match) {
    throw new Error(`未找到对应的六十四卦: ${key}`);
  }

  return {
    ...match,
    lines: [...lines],
  };
}
