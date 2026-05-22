import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '@/screens/login';
import { RegisterScreen } from '@/screens/register';
import { PublicStackParamList } from '@/@types/navigation';

const PublicStack = createStackNavigator<PublicStackParamList>();

export function PublicRoutes() {
  return (
    <PublicStack.Navigator screenOptions={{ headerShown: false }}>
      <PublicStack.Screen name="login" component={LoginScreen} />
      <PublicStack.Screen name="register" component={RegisterScreen} />
    </PublicStack.Navigator>
  );
}
