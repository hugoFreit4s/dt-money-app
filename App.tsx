import './src/styles/global.css';
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContextProvider } from '@/context/auth.context';
import { SnackbarProvider } from '@/context/snackbar.context';
import { NavigationRouter } from '@/routes';
import { Loading } from '@/components/Loading';
import { useAuthContext } from '@/context/auth.context';
import { useSnackbar } from '@/context/snackbar.context';
import { useEffect, useRef } from 'react';
import { setOnUnauthorized } from '@/shared/api/dtmoney';

function UnauthorizedHandler() {
  const { handleLogout } = useAuthContext();
  const { notify } = useSnackbar();
  const handleLogoutRef = useRef(handleLogout);
  const notifyRef = useRef(notify);

  handleLogoutRef.current = handleLogout;
  notifyRef.current = notify;

  useEffect(() => {
    setOnUnauthorized(() => {
      notifyRef.current({ message: 'Sessão expirada' });
      void handleLogoutRef.current();
    });
    return () => setOnUnauthorized(null);
  }, []);

  return null;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContextProvider>
        <SnackbarProvider>
          <UnauthorizedHandler />
          <NavigationRouter />
          <StatusBar style="light" />
        </SnackbarProvider>
      </AuthContextProvider>
    </GestureHandlerRootView>
  );
}
