import { Text, View } from 'react-native';

type SnackbarProps = {
  message: string;
};

export function Snackbar({ message }: SnackbarProps) {
  return (
    <View className="absolute bottom-8 left-6 right-6 bg-background-tertiary rounded-lg px-4 py-3 border border-gray-800">
      <Text className="text-white text-center">{message}</Text>
    </View>
  );
}
