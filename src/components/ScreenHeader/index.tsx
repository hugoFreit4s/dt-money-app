import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
};

export function ScreenHeader({ title, showBack = false }: ScreenHeaderProps) {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center px-6 py-4 bg-background-secondary">
      {showBack ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4 min-h-[44px] justify-center pr-2"
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text className="text-accent-brand-light text-base">← Voltar</Text>
        </TouchableOpacity>
      ) : null}
      <Text className="text-white text-lg font-bold flex-1">{title}</Text>
    </View>
  );
}
