import { Text } from 'react-native';

type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return <Text className="text-accent-red text-sm mt-1">{message}</Text>;
}
