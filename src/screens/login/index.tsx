import { View } from 'react-native';
import { DismissKeyboardView } from '@/components/DismissKeyboardView';
import { Logo } from '@/components/Logo';
import { useKeyboardVisible } from '@/shared/hooks/useKeyboardVisible';
import { LoginForm } from '@/screens/login/loginForm';

export function LoginScreen() {
  const keyboardVisible = useKeyboardVisible();

  return (
    <DismissKeyboardView>
      <View className="flex-1 px-6 py-8 bg-background-primary">
        {!keyboardVisible ? (
          <View className="items-center my-8">
            <Logo />
          </View>
        ) : null}
        <LoginForm />
      </View>
    </DismissKeyboardView>
  );
}
