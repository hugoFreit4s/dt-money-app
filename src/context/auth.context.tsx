import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { IUser } from '@/interfaces/user.interface';
import { authenticate, registerUser } from '@/services/dtmoney/auth.service';
import { setAuthToken } from '@/shared/api/dtmoney';
import { FormLoginParams, FormRegisterParams } from '@/shared/types/forms';
import {
  clearSession,
  loadSession,
  saveSession,
} from '@/shared/storage/session';

type AuthContextType = {
  user: IUser | null;
  token: string | null;
  isRestoringSession: boolean;
  handleAuthenticate: (params: FormLoginParams) => Promise<void>;
  handleRegister: (params: FormRegisterParams) => Promise<void>;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  const applySession = useCallback((nextUser: IUser, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    setAuthToken(nextToken);
  }, []);

  const restoreUserSession = useCallback(async () => {
    const session = await loadSession();
    if (session) {
      applySession(session.user, session.token);
    }
  }, [applySession]);

  useEffect(() => {
    restoreUserSession().finally(() => setIsRestoringSession(false));
  }, [restoreUserSession]);

  const handleAuthenticate = useCallback(
    async (params: FormLoginParams) => {
      const { user: nextUser, token: nextToken } = await authenticate(params);
      await saveSession(nextUser, nextToken);
      applySession(nextUser, nextToken);
    },
    [applySession]
  );

  const handleRegister = useCallback(
    async (params: FormRegisterParams) => {
      const { confirmPassword: _, ...payload } = params;
      const { user: nextUser, token: nextToken } = await registerUser(payload);
      await saveSession(nextUser, nextToken);
      applySession(nextUser, nextToken);
    },
    [applySession]
  );

  const handleLogout = useCallback(async () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    await clearSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isRestoringSession,
      handleAuthenticate,
      handleRegister,
      handleLogout,
    }),
    [
      user,
      token,
      isRestoringSession,
      handleAuthenticate,
      handleRegister,
      handleLogout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
