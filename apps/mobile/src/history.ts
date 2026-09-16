import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LineValue } from '@yi-culture/iching';

const HISTORY_KEY = '@yi-culture/iching-history/v1';
const MAX_RECORDS = 50;

export type DivinationMethod = 'coin' | 'manual';

export interface DivinationRecord {
  id: string;
  createdAt: string;
  method: DivinationMethod;
  lines: LineValue[];
}

function isLineValue(value: unknown): value is LineValue {
  return value === 6 || value === 7 || value === 8 || value === 9;
}

function isRecord(value: unknown): value is DivinationRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<DivinationRecord>;
  return (
    typeof record.id === 'string' &&
    typeof record.createdAt === 'string' &&
    (record.method === 'coin' || record.method === 'manual') &&
    Array.isArray(record.lines) &&
    record.lines.length === 6 &&
    record.lines.every(isLineValue)
  );
}

export async function loadHistory(): Promise<DivinationRecord[]> {
  try {
    const stored = await AsyncStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isRecord) : [];
  } catch {
    return [];
  }
}

export async function prependHistory(
  records: DivinationRecord[],
  record: DivinationRecord,
): Promise<DivinationRecord[]> {
  const next = [record, ...records].slice(0, MAX_RECORDS);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}
