import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@yi-culture/profile/v1';
const FIRST_RUN_KEY = '@yi-culture/first-run/v1';

export interface UserProfile {
  id: string;
  nickname: string;
  gender?: string;
  birthDate?: string;
  birthTime?: string;
  birthLocation?: string;
  createdAt: string;
  updatedAt: string;
}

export async function loadProfile(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.id && parsed.nickname ? parsed as UserProfile : null;
  } catch {
    return null;
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  await AsyncStorage.setItem(FIRST_RUN_KEY, '1');
}

export async function isFirstRun(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(FIRST_RUN_KEY);
    return raw !== '1';
  } catch {
    return true;
  }
}

export async function resetFirstRun(): Promise<void> {
  await AsyncStorage.removeItem(FIRST_RUN_KEY);
}
