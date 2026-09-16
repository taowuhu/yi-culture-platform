export interface ClassicalSource {
  id: 'wikisource' | 'gutenberg';
  title: string;
  role: 'transcription-base' | 'cross-check';
  url: string;
}

export const CLASSICS_SCOPE =
  '收录六十四卦卦辞及每卦六条爻辞，不含《彖》《象》《文言》等《易传》内容。';

export const CLASSICS_SOURCES: readonly ClassicalSource[] = [
  {
    id: 'wikisource',
    title: '维基文库《周易》',
    role: 'transcription-base',
    url: 'https://zh.wikisource.org/zh-hans/周易',
  },
  {
    id: 'gutenberg',
    title: 'Project Gutenberg eBook #25501《易經》',
    role: 'cross-check',
    url: 'https://www.gutenberg.org/ebooks/25501',
  },
] as const;

export const CLASSICS_VARIANT_NOTE =
  '项目保留维基文库底本文字，并以 Gutenberg 文本逐项交叉核对；存在异文时不自行拼合或猜测。';
