// 八卦三爻均按从下到上的顺序保存；这是八卦结构的唯一事实来源。
export const TRIGRAM_LINES = {
    '乾': ['yang', 'yang', 'yang'],
    '兑': ['yang', 'yang', 'yin'],
    '离': ['yang', 'yin', 'yang'],
    '震': ['yang', 'yin', 'yin'],
    '巽': ['yin', 'yang', 'yang'],
    '坎': ['yin', 'yang', 'yin'],
    '艮': ['yin', 'yin', 'yang'],
    '坤': ['yin', 'yin', 'yin'],
};
const TRIGRAM_BY_LINES = Object.fromEntries(Object.entries(TRIGRAM_LINES).map(([name, lines]) => [
    lines.join(','),
    name,
]));
export function getTrigramLines(name) {
    return TRIGRAM_LINES[name];
}
export function getTrigramByLines(lines) {
    return TRIGRAM_BY_LINES[lines.join(',')];
}
