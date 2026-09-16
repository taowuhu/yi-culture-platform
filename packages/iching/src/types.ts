// 卦爻的数值，只能是 6、7、8、9
export type LineValue = 6 | 7 | 8 | 9;

// 阴阳属性，只能是 yin 或 yang
export type YinYang = 'yin' | 'yang';

// 八个三爻卦（乾、兑、离、震、巽、坎、艮、坤）的名称
export type TrigramName = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';

// 六条爻辞顺序固定为初爻到上爻。
export type YaoCi = readonly [string, string, string, string, string, string];

// 一个卦由六爻组成，并包含对应的基础经文。
export interface Hexagram {
  index: number; // 文王卦序 1~64
  name: string;
  lowerTrigram: TrigramName;
  upperTrigram: TrigramName;
  guaCi: string;
  yaoCi: YaoCi;
  lines: YinYang[];
}

// calculateHexagram 返回的本卦、变卦与动爻信息
export type HexagramResult = {
  benGua: Hexagram;
  bianGua?: Hexagram;
  // 1~6 表示初爻到上爻，不使用数组 0~5 索引
  movingLines: number[];
};

// 六爻拆分为下卦和上卦的结果
export type HexagramTrigrams = {
  lower: TrigramName;
  upper: TrigramName;
};