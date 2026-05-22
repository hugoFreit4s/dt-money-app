import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Snackbar } from '@/components/Snackbar';

type SnackbarNotifyParams = {
  message: string;
};

type SnackbarContextType = {
  notify: (params: SnackbarNotifyParams) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
  notify: () => undefined,
});

type SnackbarProviderProps = {
  children: ReactNode;
};

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [message, setMessage] = useState<string | null>(null);

  const notify = useCallback(({ message: nextMessage }: SnackbarNotifyParams) => {
    setMessage(nextMessage);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {message ? <Snackbar message={message} /> : null}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
