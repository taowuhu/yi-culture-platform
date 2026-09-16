import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  calculateHexagram,
  type Hexagram,
  type HexagramResult,
  type LineValue,
} from '@yi-culture/iching';

const LINE_OPTIONS: ReadonlyArray<{ value: LineValue; label: string }> = [
  { value: 6, label: '老阴' },
  { value: 7, label: '少阳' },
  { value: 8, label: '少阴' },
  { value: 9, label: '老阳' },
];

const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'] as const;

type Screen = 'home' | 'cast' | 'result';

function HexagramLines({ hexagram }: { hexagram: Hexagram }) {
  return (
    <View style={styles.diagram} accessibilityLabel={`${hexagram.name}卦六爻卦象`}>
      {[...hexagram.lines].reverse().map((line, reversedIndex) => {
        const position = 6 - reversedIndex;
        return (
          <View key={position} style={styles.diagramRow}>
            <Text style={styles.positionMark}>{POSITION_NAMES[position - 1]}</Text>
            {line === 'yang' ? (
              <View style={styles.yangLine} />
            ) : (
              <View style={styles.yinLine}>
                <View style={styles.yinHalf} />
                <View style={styles.yinHalf} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

function HexagramCard({ title, hexagram }: { title: string; hexagram: Hexagram }) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{title}</Text>
      <Text style={styles.hexagramName}>第 {hexagram.index} 卦 · {hexagram.name}</Text>
      <Text style={styles.trigrams}>下{hexagram.lowerTrigram} · 上{hexagram.upperTrigram}</Text>
      <HexagramLines hexagram={hexagram} />
      <View style={styles.textDivider} />
      <Text style={styles.sectionLabel}>卦辞</Text>
      <Text style={styles.classicalText}>{hexagram.guaCi}</Text>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [lines, setLines] = useState<LineValue[]>([7, 8, 7, 8, 7, 8]);
  const [result, setResult] = useState<HexagramResult | null>(null);

  const updateLine = (index: number, value: LineValue) => {
    setLines((current) => current.map((line, lineIndex) => (
      lineIndex === index ? value : line
    )));
  };

  const cast = () => {
    setResult(calculateHexagram(lines));
    setScreen('result');
  };

  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.home}>
          <Text style={styles.seal}>易</Text>
          <Text style={styles.brand}>东方传统文化</Text>
          <Text style={styles.tagline}>从一卦开始，读懂变化中的智慧</Text>
          <Pressable
            accessibilityRole="button"
            testID="home-zhouyi"
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            onPress={() => setScreen('cast')}
          >
            <Text style={styles.primaryButtonText}>周易起卦</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'cast') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.page}>
          <Pressable accessibilityRole="button" onPress={() => setScreen('home')}>
            <Text style={styles.back}>‹ 返回首页</Text>
          </Pressable>
          <Text style={styles.pageTitle}>六爻起卦</Text>
          <Text style={styles.pageIntro}>依次选择初爻至上爻。爻序由下而上。</Text>

          <View style={styles.legend}>
            {LINE_OPTIONS.map((option) => (
              <Text key={option.value} style={styles.legendText}>
                {option.value} {option.label}
              </Text>
            ))}
          </View>

          <View style={styles.inputCard}>
            {lines.map((line, index) => (
              <View key={index} style={styles.lineInputRow}>
                <Text style={styles.lineLabel}>{POSITION_NAMES[index]}</Text>
                <View style={styles.optionRow}>
                  {LINE_OPTIONS.map((option) => {
                    const selected = line === option.value;
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        testID={`line-${index + 1}-${option.value}`}
                        key={option.value}
                        onPress={() => updateLine(index, option.value)}
                        style={({ pressed }) => [
                          styles.option,
                          selected && styles.optionSelected,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text style={[styles.optionNumber, selected && styles.optionTextSelected]}>
                          {option.value}
                        </Text>
                        <Text style={[styles.optionLabel, selected && styles.optionTextSelected]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            testID="calculate-hexagram"
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            onPress={cast}
          >
            <Text style={styles.primaryButtonText}>排卦</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!result) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.page}>
        <Pressable accessibilityRole="button" onPress={() => setScreen('cast')}>
          <Text style={styles.back}>‹ 修改六爻</Text>
        </Pressable>
        <Text style={styles.pageTitle}>排卦结果</Text>

        <HexagramCard title="本卦" hexagram={result.benGua} />

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>动爻</Text>
          {result.movingLines.length === 0 ? (
            <Text style={styles.bodyText}>本卦无动爻。</Text>
          ) : (
            result.movingLines.map((position) => (
              <View key={position} style={styles.movingTextRow}>
                <Text style={styles.movingPosition}>{POSITION_NAMES[position - 1]}</Text>
                <Text style={styles.classicalText}>{result.benGua.yaoCi[position - 1]}</Text>
              </View>
            ))
          )}
        </View>

        {result.bianGua ? (
          <HexagramCard title="变卦" hexagram={result.bianGua} />
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>变卦</Text>
            <Text style={styles.bodyText}>无动爻，故无变卦。</Text>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          testID="cast-again"
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          onPress={() => setScreen('cast')}
        >
          <Text style={styles.secondaryButtonText}>重新起卦</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const colors = {
  paper: '#F5F0E6',
  ink: '#28241F',
  muted: '#756C60',
  red: '#8C3027',
  gold: '#B79252',
  card: '#FFFCF5',
  border: '#D8CDBB',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper },
  home: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seal: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: colors.red,
    color: '#FFF8EB',
    fontSize: 44,
    lineHeight: 76,
    textAlign: 'center',
    marginBottom: 26,
  },
  brand: { color: colors.ink, fontSize: 32, fontWeight: '600', letterSpacing: 3 },
  tagline: { color: colors.muted, fontSize: 16, marginTop: 14, marginBottom: 44 },
  page: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 48,
  },
  back: { color: colors.red, fontSize: 16, marginBottom: 18 },
  pageTitle: { color: colors.ink, fontSize: 30, fontWeight: '600', letterSpacing: 2 },
  pageIntro: { color: colors.muted, fontSize: 15, lineHeight: 24, marginTop: 8, marginBottom: 18 },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  legendText: { color: colors.muted, fontSize: 13 },
  inputCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
  },
  lineInputRow: { marginBottom: 18 },
  lineLabel: { color: colors.ink, fontSize: 15, fontWeight: '600', marginBottom: 9 },
  optionRow: { flexDirection: 'row', gap: 8 },
  option: {
    flex: 1,
    minHeight: 58,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF6ED',
  },
  optionSelected: { backgroundColor: colors.red, borderColor: colors.red },
  optionNumber: { color: colors.ink, fontSize: 18, fontWeight: '700' },
  optionLabel: { color: colors.muted, fontSize: 11, marginTop: 2 },
  optionTextSelected: { color: '#FFF8EB' },
  primaryButton: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    backgroundColor: colors.red,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#FFF9EF', fontSize: 18, fontWeight: '600', letterSpacing: 2 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  secondaryButtonText: { color: colors.red, fontSize: 16, fontWeight: '600' },
  pressed: { opacity: 0.75 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    marginTop: 18,
  },
  eyebrow: { color: colors.red, fontSize: 14, fontWeight: '700', letterSpacing: 3 },
  hexagramName: { color: colors.ink, fontSize: 27, fontWeight: '600', marginTop: 8 },
  trigrams: { color: colors.muted, fontSize: 14, marginTop: 6 },
  diagram: { marginVertical: 22, gap: 11 },
  diagramRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  positionMark: { width: 42, color: colors.muted, fontSize: 12 },
  yangLine: { width: 148, height: 10, borderRadius: 2, backgroundColor: colors.ink },
  yinLine: { width: 148, flexDirection: 'row', justifyContent: 'space-between' },
  yinHalf: { width: 62, height: 10, borderRadius: 2, backgroundColor: colors.ink },
  textDivider: { height: 1, backgroundColor: colors.border, marginBottom: 16 },
  sectionLabel: { color: colors.red, fontSize: 15, fontWeight: '700', marginBottom: 9 },
  classicalText: { flex: 1, color: colors.ink, fontSize: 16, lineHeight: 27 },
  bodyText: { color: colors.muted, fontSize: 15, lineHeight: 24 },
  movingTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  movingPosition: { width: 48, color: colors.gold, fontSize: 14, fontWeight: '700', paddingTop: 3 },
});
