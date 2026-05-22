import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '@/screens/home';
import { ProfileScreen } from '@/screens/profile';
import { PrivateStackParamList } from '@/@types/navigation';

const PrivateStack = createStackNavigator<PrivateStackParamList>();

export function PrivateRoutes() {
  return (
    <PrivateStack.Navigator screenOptions={{ headerShown: false }}>
      <PrivateStack.Screen name="home" component={HomeScreen} />
      <PrivateStack.Screen name="profile" component={ProfileScreen} />
    </PrivateStack.Navigator>
  );
}
