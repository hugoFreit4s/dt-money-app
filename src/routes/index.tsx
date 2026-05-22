import { NavigationContainer } from '@react-navigation/native';
import { Loading } from '@/components/Loading';
import { useAuthContext } from '@/context/auth.context';
import { PrivateRoutes } from '@/routes/private.routes';
import { PublicRoutes } from '@/routes/public.routes';

export function NavigationRouter() {
  const { user, token, isRestoringSession } = useAuthContext();

  if (isRestoringSession) {
    return <Loading />;
  }

  const isAuthenticated = Boolean(user && token);

  return (
    <NavigationContainer>
      {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  );
}
