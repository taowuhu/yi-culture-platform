import { describe, expect, it } from 'vitest';
import { getYaoCiByPosition } from '../src/classics';
import { identifyHexagram } from '../src/engine';
import { HEXAGRAMS } from '../src/hexagrams';

describe('《周易》基础经文数据', () => {
  it('64 卦都应有非空卦辞和恰好 6 条非空爻辞', () => {
    const hexagrams = Object.values(HEXAGRAMS);

    expect(hexagrams).toHaveLength(64);

    for (const hexagram of hexagrams) {
      expect(hexagram.guaCi.trim()).not.toBe('');
      expect(hexagram.yaoCi).toHaveLength(6);

      for (const yaoCi of hexagram.yaoCi) {
        expect(yaoCi.trim()).not.toBe('');
      }
    }
  });

  it('应正确映射乾卦经文', () => {
    const qian = HEXAGRAMS['乾|乾'];

    expect(qian.guaCi).toBe('元亨。利貞。');
    expect(qian.yaoCi[0]).toBe('潛龍勿用。');
    expect(qian.yaoCi[5]).toBe('亢龍，有悔。');
  });

  it('应正确映射坤卦经文', () => {
    const kun = HEXAGRAMS['坤|坤'];

    expect(kun.guaCi).toBe(
      '元亨。利牝馬之貞。君子有攸往，先迷後得主。利西南得朋，東北喪朋。安貞，吉。'
    );
    expect(kun.yaoCi[0]).toBe('履霜，堅冰至。');
    expect(kun.yaoCi[5]).toBe('龍戰于野，其血玄黃。');
  });

  it('应正确映射屯、泰、坎、革、既济、未济经文', () => {
    expect(HEXAGRAMS['震|坎'].guaCi).toBe(
      '元亨，利貞。勿用有攸往，利建侯。'
    );
    expect(HEXAGRAMS['震|坎'].yaoCi[2]).toBe(
      '即鹿无虞，惟入于林中，君子幾不如舍，往吝。'
    );

    expect(HEXAGRAMS['乾|坤'].guaCi).toBe('小往大來，吉亨。');
    expect(HEXAGRAMS['乾|坤'].yaoCi[0]).toBe('拔茅茹以其彙，征吉。');

    expect(HEXAGRAMS['坎|坎'].guaCi).toBe(
      '習坎：有孚，維心亨。行有尚。'
    );
    expect(HEXAGRAMS['坎|坎'].yaoCi[5]).toBe(
      '係用徽纆，寘于叢棘，三歲不得，凶。'
    );

    expect(HEXAGRAMS['离|兑'].guaCi).toBe(
      '巳日乃孚，元亨。利貞。悔亡。'
    );
    expect(HEXAGRAMS['离|兑'].yaoCi[1]).toBe(
      '巳日乃革之，征吉，无咎。'
    );

    expect(HEXAGRAMS['离|坎'].guaCi).toBe('亨小。利貞。初吉終亂。');
    expect(HEXAGRAMS['离|坎'].yaoCi[4]).toBe(
      '東鄰殺牛，不如西鄰之禴祭，實受其福。'
    );

    expect(HEXAGRAMS['坎|离'].guaCi).toBe(
      '亨。小狐汔濟，濡其尾，无攸利。'
    );
    expect(HEXAGRAMS['坎|离'].yaoCi[5]).toBe(
      '有孚于飲酒，无咎，濡其首，有孚失是。'
    );
  });
});

describe('爻位与爻辞索引映射', () => {
  it('外部爻位 1~6 应依次映射到 yaoCi[0]~yaoCi[5]', () => {
    const qian = identifyHexagram([
      'yang', 'yang', 'yang', 'yang', 'yang', 'yang',
    ]);
    const texts = [1, 2, 3, 4, 5, 6].map((position) =>
      getYaoCiByPosition(qian, position)
    );

    expect(texts).toEqual([
      '潛龍勿用。',
      '見龍在田，利見大人。',
      '君子終日乾乾，夕惕若；厲，无咎。',
      '或躍在淵，无咎。',
      '飛龍在天，利見大人。',
      '亢龍，有悔。',
    ]);
  });

  it('爻位超出 1~6 时应抛出错误', () => {
    const qian = identifyHexagram([
      'yang', 'yang', 'yang', 'yang', 'yang', 'yang',
    ]);

    expect(() => getYaoCiByPosition(qian, 0)).toThrow('爻位必须是 1~6');
    expect(() => getYaoCiByPosition(qian, 7)).toThrow('爻位必须是 1~6');
  });
});
