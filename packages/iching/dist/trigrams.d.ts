import type { TrigramName, YinYang } from './types';
export type TrigramLines = readonly [YinYang, YinYang, YinYang];
export declare const TRIGRAM_LINES: {
    readonly 乾: readonly ["yang", "yang", "yang"];
    readonly 兑: readonly ["yang", "yang", "yin"];
    readonly 离: readonly ["yang", "yin", "yang"];
    readonly 震: readonly ["yang", "yin", "yin"];
    readonly 巽: readonly ["yin", "yang", "yang"];
    readonly 坎: readonly ["yin", "yang", "yin"];
    readonly 艮: readonly ["yin", "yin", "yang"];
    readonly 坤: readonly ["yin", "yin", "yin"];
};
export declare function getTrigramLines(name: TrigramName): TrigramLines;
export declare function getTrigramByLines(lines: readonly YinYang[]): TrigramName | undefined;
//# sourceMappingURL=trigrams.d.ts.map