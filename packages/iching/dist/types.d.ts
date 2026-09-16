export type LineValue = 6 | 7 | 8 | 9;
export type YinYang = 'yin' | 'yang';
export type TrigramName = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';
export type YaoCi = readonly [string, string, string, string, string, string];
export interface Hexagram {
    index: number;
    name: string;
    lowerTrigram: TrigramName;
    upperTrigram: TrigramName;
    guaCi: string;
    yaoCi: YaoCi;
    lines: YinYang[];
}
export type HexagramResult = {
    benGua: Hexagram;
    bianGua?: Hexagram;
    movingLines: number[];
};
export type HexagramTrigrams = {
    lower: TrigramName;
    upper: TrigramName;
};
//# sourceMappingURL=types.d.ts.map