import { ActivityIndicator, View } from 'react-native';

export function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-background-primary">
      <ActivityIndicator size="large" color="#00B37E" />
    </View>
  );
}
