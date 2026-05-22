import { ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DismissKeyboardViewProps = {
  children: ReactNode;
};

export function DismissKeyboardView({ children }: DismissKeyboardViewProps) {
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="flex-grow"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
