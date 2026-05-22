import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '@/interfaces/user.interface';

const USER_KEY = '@dtmoney:user';
const TOKEN_KEY = '@dtmoney:token';

export async function saveSession(user: IUser, token: string) {
  await Promise.all([
    AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
    AsyncStorage.setItem(TOKEN_KEY, token),
  ]);
}

export async function loadSession(): Promise<{ user: IUser; token: string } | null> {
  const [userRaw, token] = await Promise.all([
    AsyncStorage.getItem(USER_KEY),
    AsyncStorage.getItem(TOKEN_KEY),
  ]);

  if (!userRaw || !token) {
    return null;
  }

  return {
    user: JSON.parse(userRaw) as IUser,
    token,
  };
}

export async function clearSession() {
  await Promise.all([
    AsyncStorage.removeItem(USER_KEY),
    AsyncStorage.removeItem(TOKEN_KEY),
  ]);
}
