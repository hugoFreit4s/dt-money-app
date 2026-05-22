import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuthContext } from '@/context/auth.context';

export function Header() {
  const { user } = useAuthContext();
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between px-6 py-4 mb-8 bg-background-secondary">
      <Text className="text-white text-lg">
        Olá, {user?.name ?? 'Visitante'}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('profile' as never)}>
        <Text className="text-accent-brand-light text-sm">Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}
