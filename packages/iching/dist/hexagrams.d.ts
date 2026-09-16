import type { TrigramName, YaoCi } from './types';
export interface HexagramInfo {
    index: number;
    name: string;
    lowerTrigram: TrigramName;
    upperTrigram: TrigramName;
    guaCi: string;
    yaoCi: YaoCi;
}
export declare const HEXAGRAMS: Record<string, HexagramInfo>;
//# sourceMappingURL=hexagrams.d.ts.map