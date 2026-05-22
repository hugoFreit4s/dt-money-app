import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/AppButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuthContext } from '@/context/auth.context';

export function ProfileScreen() {
  const { user, handleLogout } = useAuthContext();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <ScreenHeader title="Perfil" showBack />
      <View className="flex-1 px-6 pt-8">
        <View className="bg-background-secondary rounded-lg p-4 mb-4">
          <Text className="text-gray-700 text-sm">Nome</Text>
          <Text className="text-white text-lg mt-1">{user?.name}</Text>
        </View>
        <View className="bg-background-secondary rounded-lg p-4 mb-8">
          <Text className="text-gray-700 text-sm">E-mail</Text>
          <Text className="text-white text-lg mt-1">{user?.email}</Text>
        </View>
        <AppButton title="Sair" mode="outline" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}
