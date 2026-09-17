import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  calculateHexagram,
  castLineByCoin,
  CLASSICS_SCOPE,
  CLASSICS_SOURCES,
  CLASSICS_VARIANT_NOTE,
  type Hexagram,
  type HexagramResult,
  type LineValue,
} from '@yi-culture/iching';
import {
  clearHistory,
  loadHistory,
  prependHistory,
  type DivinationMethod,
  type DivinationRecord,
} from './src/history';
import {
  loadProfile,
  saveProfile,
  isFirstRun,
  type UserProfile,
} from './src/profile';

const LINE_OPTIONS: ReadonlyArray<{ value: LineValue; label: string }> = [
  { value: 6, label: '老阴' },
  { value: 7, label: '少阳' },
  { value: 8, label: '少阴' },
  { value: 9, label: '老阳' },
];

const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'] as const;

type Screen = 'welcome' | 'profile-setup' | 'home' | 'cast' | 'result' | 'history' | 'profile';

type ResultState = {
  value: HexagramResult;
  method: DivinationMethod;
};

function lineLabel(value: LineValue): string {
  return LINE_OPTIONS.find((option) => option.value === value)?.label ?? '';
}

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

function SourceCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>原典来源</Text>
      <Text style={styles.bodyText}>{CLASSICS_SCOPE}</Text>
      {CLASSICS_SOURCES.map((source) => (
        <Pressable
          accessibilityRole="link"
          key={source.id}
          onPress={() => void Linking.openURL(source.url)}
          style={({ pressed }) => [styles.sourceRow, pressed && styles.pressed]}
        >
          <View style={styles.sourceTextWrap}>
            <Text style={styles.sourceTitle}>{source.title}</Text>
            <Text style={styles.sourceRole}>
              {source.role === 'transcription-base' ? '录入底本' : '交叉核对'}
            </Text>
          </View>
          <Text style={styles.sourceArrow}>↗</Text>
        </Pressable>
      ))}
      <Text style={styles.sourceNote}>{CLASSICS_VARIANT_NOTE}</Text>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [method, setMethod] = useState<DivinationMethod>('coin');
  const [manualLines, setManualLines] = useState<LineValue[]>([7, 8, 7, 8, 7, 8]);
  const [coinLines, setCoinLines] = useState<LineValue[]>([]);
  const [result, setResult] = useState<ResultState | null>(null);
  const [history, setHistory] = useState<DivinationRecord[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstRunChecked, setFirstRunChecked] = useState(false);

  useEffect(() => {
    void loadHistory().then(setHistory);
  }, []);

  useEffect(() => {
    void (async () => {
      const prof = await loadProfile();
      setProfile(prof);
      const first = await isFirstRun();
      if (!prof || first) {
        setScreen('welcome');
      } else {
        setScreen('home');
      }
      setFirstRunChecked(true);
    })();
  }, []);

  const updateManualLine = (index: number, value: LineValue) => {
    setManualLines((current) => current.map((line, lineIndex) => (
      lineIndex === index ? value : line
    )));
  };

  const finishDivination = (lines: LineValue[], selectedMethod: DivinationMethod) => {
    const calculated = calculateHexagram(lines);
    const record: DivinationRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      method: selectedMethod,
      lines: [...lines],
    };

    setResult({ value: calculated, method: selectedMethod });
    setScreen('result');
    void prependHistory(history, record).then(setHistory);
  };

  const throwCoins = () => {
    if (coinLines.length >= 6) return;
    setCoinLines((current) => [...current, castLineByCoin()]);
  };

  const openRecord = (record: DivinationRecord) => {
    setResult({ value: calculateHexagram(record.lines), method: record.method });
    setScreen('result');
  };

  const startCasting = (selectedMethod: DivinationMethod = 'coin') => {
    setMethod(selectedMethod);
    if (selectedMethod === 'coin') setCoinLines([]);
    setScreen('cast');
  };

  if (!firstRunChecked) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.home}>
          <Text style={styles.seal}>易</Text>
          <Text style={styles.brand}>东方传统文化</Text>
          <Text style={styles.tagline}>正准备迎接你……</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'welcome') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.pageTitle}>欢迎</Text>
          <Text style={styles.pageIntro}>在正式开始之前，先创建你的个人档案。</Text>
          <Pressable accessibilityRole="button" testID="start-profile" onPress={() => setScreen('profile-setup')}>
            <Text style={styles.primaryButtonText}>开始使用</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'profile-setup') {
    const [nickname, setNickname] = useState('');
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <Text style={styles.pageTitle}>创建档案</Text>
          <Text style={styles.pageIntro}>昵称是必填项，其他信息可后续完善。</Text>
          <View style={styles.inputCard}>
            <Text style={styles.sectionLabel}>昵称</Text>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              placeholder="例如：知行者"
              placeholderTextColor="#B8A690"
              style={{ borderWidth: 1, borderColor: '#D8CDBB', borderRadius: 10, padding: 14, fontSize: 16, backgroundColor: '#FAF6ED', color: '#28241F' }}
              testID="nickname-input"
            />
          </View>
          <Pressable accessibilityRole="button" testID="save-profile" disabled={nickname.trim().length === 0} onPress={async () => {
            const now = new Date().toISOString();
            const newProfile = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, nickname: nickname.trim(), createdAt: now, updatedAt: now };
            await saveProfile(newProfile);
            setProfile(newProfile);
            setScreen('home');
          }}>
            <Text style={styles.primaryButtonText}>完成</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.home}>
          <Text style={styles.seal}>易</Text>
          <Text style={styles.brand}>东方传统文化</Text>
          <Text style={styles.tagline}>{profile ? `早上好，${profile.nickname}` : '从一卦开始，读懂变化中的智慧'}</Text>
          <Pressable accessibilityRole="button" testID="home-zhouyi" style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={() => startCasting('coin')}>
            <Text style={styles.primaryButtonText}>周易起卦</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            testID="home-profile"
            style={({ pressed }) => [styles.homeLink, pressed && styles.pressed]}
            onPress={() => setScreen('profile')}
          >
            <Text style={styles.homeLinkText}>我的</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            testID="home-history"
            style={({ pressed }) => [styles.homeLink, pressed && styles.pressed]}
            onPress={() => setScreen('history')}
          >
            <Text style={styles.homeLinkText}>历史记录{history.length > 0 ? ` · ${history.length}` : ''}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'history') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.page}>
          <Pressable accessibilityRole="button" onPress={() => setScreen('home')}>
            <Text style={styles.back}>‹ 返回首页</Text>
          </Pressable>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>历史记录</Text>
            {history.length > 0 && (
              <Pressable
                accessibilityRole="button"
                testID="clear-history"
                onPress={() => void clearHistory().then(() => setHistory([]))}
              >
                <Text style={styles.clearText}>清空</Text>
              </Pressable>
            )}
          </View>
          {history.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>尚无起卦记录</Text>
              <Text style={styles.bodyText}>完成一次起卦后，结果会保存在此设备。</Text>
            </View>
          ) : (
            history.map((record) => {
              const saved = calculateHexagram(record.lines);
              return (
                <Pressable
                  accessibilityRole="button"
                  testID={`history-${record.id}`}
                  key={record.id}
                  onPress={() => openRecord(record)}
                  style={({ pressed }) => [styles.historyCard, pressed && styles.pressed]}
                >
                  <View>
                    <Text style={styles.historyName}>
                      {saved.benGua.name}{saved.bianGua ? ` → ${saved.bianGua.name}` : ''}
                    </Text>
                    <Text style={styles.historyMeta}>
                      {record.method === 'coin' ? '铜钱起卦' : '手动排卦'} · {new Date(record.createdAt).toLocaleString('zh-CN')}
                    </Text>
                  </View>
                  <Text style={styles.sourceArrow}>›</Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>
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
          <Text style={styles.pageTitle}>周易起卦</Text>
          <Text style={styles.pageIntro}>选择铜钱起卦，或使用已知的六爻数值手动排卦。</Text>

          <View style={styles.methodTabs}>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: method === 'coin' }}
              testID="method-coin"
              onPress={() => { setMethod('coin'); setCoinLines([]); }}
              style={[styles.methodTab, method === 'coin' && styles.methodTabSelected]}
            >
              <Text style={[styles.methodTabText, method === 'coin' && styles.methodTabTextSelected]}>铜钱起卦</Text>
            </Pressable>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: method === 'manual' }}
              testID="method-manual"
              onPress={() => setMethod('manual')}
              style={[styles.methodTab, method === 'manual' && styles.methodTabSelected]}
            >
              <Text style={[styles.methodTabText, method === 'manual' && styles.methodTabTextSelected]}>手动排卦</Text>
            </Pressable>
          </View>

          {method === 'coin' ? (
            <View style={styles.inputCard}>
              <Text style={styles.sectionLabel}>三枚铜钱，依次成爻</Text>
              <Text style={styles.bodyText}>从初爻开始，每次投掷三枚铜钱；完成六爻后即可查看卦象。</Text>
              <View style={styles.coinProgress}>
                {POSITION_NAMES.map((name, index) => {
                  const value = coinLines[index];
                  return (
                    <View key={name} style={[styles.coinLine, value && styles.coinLineDone]}>
                      <Text style={styles.coinPosition}>{name}</Text>
                      <Text style={styles.coinValue}>{value ? `${value} · ${lineLabel(value)}` : '待投'}</Text>
                    </View>
                  );
                })}
              </View>
              {coinLines.length < 6 ? (
                <Pressable
                  accessibilityRole="button"
                  testID="throw-coins"
                  onPress={throwCoins}
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                >
                  <Text style={styles.primaryButtonText}>投第 {coinLines.length + 1} 爻</Text>
                </Pressable>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  testID="finish-coin-cast"
                  onPress={() => finishDivination(coinLines, 'coin')}
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                >
                  <Text style={styles.primaryButtonText}>查看卦象</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <>
              <View style={styles.legend}>
                {LINE_OPTIONS.map((option) => (
                  <Text key={option.value} style={styles.legendText}>{option.value} {option.label}</Text>
                ))}
              </View>
              <View style={styles.inputCard}>
                {manualLines.map((line, index) => (
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
                            onPress={() => updateManualLine(index, option.value)}
                            style={[styles.option, selected && styles.optionSelected]}
                          >
                            <Text style={[styles.optionNumber, selected && styles.optionTextSelected]}>{option.value}</Text>
                            <Text style={[styles.optionLabel, selected && styles.optionTextSelected]}>{option.label}</Text>
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
                onPress={() => finishDivination(manualLines, 'manual')}
              >
                <Text style={styles.primaryButtonText}>排卦</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'profile') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.page}>
          <Pressable accessibilityRole="button" onPress={() => setScreen('home')}>
            <Text style={styles.back}>‹ 返回首页</Text>
          </Pressable>
          <Text style={styles.pageTitle}>我的</Text>
          {profile ? (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>昵称</Text>
              <Text style={styles.classicalText}>{profile.nickname}</Text>
              <Text style={styles.bodyText}>创建于 {new Date(profile.createdAt).toLocaleString('zh-CN')}</Text>
            </View>
          ) : (
            <Text style={styles.bodyText}>暂无档案信息</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!result) return null;
  const { value } = result;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.page}>
        <Pressable accessibilityRole="button" testID="result-home" onPress={() => setScreen('home')}>
          <Text style={styles.back}>‹ 返回首页</Text>
        </Pressable>
        <Text style={styles.pageTitle}>排卦结果</Text>
        <Text style={styles.resultMethod}>{result.method === 'coin' ? '三枚铜钱起卦' : '手动六爻排卦'}</Text>

        <HexagramCard title="本卦" hexagram={value.benGua} />

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>动爻</Text>
          {value.movingLines.length === 0 ? (
            <Text style={styles.bodyText}>本卦无动爻。</Text>
          ) : (
            value.movingLines.map((position) => (
              <View key={position} style={styles.movingTextRow}>
                <Text style={styles.movingPosition}>{POSITION_NAMES[position - 1]}</Text>
                <Text style={styles.classicalText}>{value.benGua.yaoCi[position - 1]}</Text>
              </View>
            ))
          )}
        </View>

        {value.bianGua ? (
          <HexagramCard title="变卦" hexagram={value.bianGua} />
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>变卦</Text>
            <Text style={styles.bodyText}>无动爻，故无变卦。</Text>
          </View>
        )}

        <SourceCard />

        <Pressable
          accessibilityRole="button"
          testID="cast-again"
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          onPress={() => startCasting('coin')}
        >
          <Text style={styles.secondaryButtonText}>再次起卦</Text>
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
  home: { flex: 1, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  seal: { width: 76, height: 76, borderRadius: 10, backgroundColor: colors.red, color: '#FFF8EB', fontSize: 44, lineHeight: 76, textAlign: 'center', marginBottom: 26 },
  brand: { color: colors.ink, fontSize: 32, fontWeight: '600', letterSpacing: 3 },
  tagline: { color: colors.muted, fontSize: 16, marginTop: 14, marginBottom: 44 },
  page: { width: '100%', maxWidth: 680, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 22, paddingBottom: 48 },
  back: { color: colors.red, fontSize: 16, marginBottom: 18 },
  pageTitle: { color: colors.ink, fontSize: 30, fontWeight: '600', letterSpacing: 2 },
  pageIntro: { color: colors.muted, fontSize: 15, lineHeight: 24, marginTop: 8, marginBottom: 18 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  clearText: { color: colors.red, fontSize: 14 },
  homeLink: { marginTop: 22, padding: 10 },
  homeLinkText: { color: colors.red, fontSize: 15 },
  methodTabs: { flexDirection: 'row', backgroundColor: '#EAE1D3', borderRadius: 12, padding: 4, marginBottom: 18 },
  methodTab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 9 },
  methodTabSelected: { backgroundColor: colors.card },
  methodTabText: { color: colors.muted, fontSize: 15 },
  methodTabTextSelected: { color: colors.red, fontWeight: '700' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  legendText: { color: colors.muted, fontSize: 13 },
  inputCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, marginBottom: 22 },
  lineInputRow: { marginBottom: 18 },
  lineLabel: { color: colors.ink, fontSize: 15, fontWeight: '600', marginBottom: 9 },
  optionRow: { flexDirection: 'row', gap: 8 },
  option: { flex: 1, minHeight: 58, borderWidth: 1, borderColor: colors.border, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF6ED' },
  optionSelected: { backgroundColor: colors.red, borderColor: colors.red },
  optionNumber: { color: colors.ink, fontSize: 18, fontWeight: '700' },
  optionLabel: { color: colors.muted, fontSize: 11, marginTop: 2 },
  optionTextSelected: { color: '#FFF8EB' },
  coinProgress: { marginVertical: 20, gap: 8 },
  coinLine: { flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border, borderRadius: 9, padding: 11, backgroundColor: '#FAF6ED' },
  coinLineDone: { borderColor: colors.gold, backgroundColor: '#F8EFD9' },
  coinPosition: { color: colors.ink, fontWeight: '600' },
  coinValue: { color: colors.muted },
  primaryButton: { width: '100%', maxWidth: 360, alignSelf: 'center', backgroundColor: colors.red, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { color: '#FFF9EF', fontSize: 18, fontWeight: '600', letterSpacing: 2 },
  secondaryButton: { borderWidth: 1, borderColor: colors.red, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
  secondaryButtonText: { color: colors.red, fontSize: 16, fontWeight: '600' },
  pressed: { opacity: 0.75 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20, marginTop: 18 },
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
  resultMethod: { color: colors.muted, fontSize: 14, marginTop: 6 },
  movingTextRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  movingPosition: { width: 48, color: colors.gold, fontSize: 14, fontWeight: '700', paddingTop: 3 },
  sourceRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 13 },
  sourceTextWrap: { flex: 1 },
  sourceTitle: { color: colors.ink, fontSize: 15, fontWeight: '600' },
  sourceRole: { color: colors.muted, fontSize: 12, marginTop: 3 },
  sourceArrow: { color: colors.red, fontSize: 22 },
  sourceNote: { color: colors.muted, fontSize: 12, lineHeight: 20, marginTop: 10 },
  historyCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginTop: 12 },
  historyName: { color: colors.ink, fontSize: 19, fontWeight: '600' },
  historyMeta: { color: colors.muted, fontSize: 12, marginTop: 5 },
  emptyCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 24, marginTop: 20, alignItems: 'center' },
  emptyTitle: { color: colors.ink, fontSize: 18, fontWeight: '600', marginBottom: 8 },
});
