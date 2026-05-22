import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Text, View } from 'react-native';
import { PublicStackParamList } from '@/@types/navigation';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { useAuthContext } from '@/context/auth.context';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { FormLoginParams } from '@/shared/types/forms';
import { loginSchema } from '@/screens/login/schema';

type Navigation = StackNavigationProp<PublicStackParamList, 'login'>;

export function LoginForm() {
  const navigation = useNavigation<Navigation>();
  const { handleAuthenticate } = useAuthContext();
  const errorHandler = useErrorHandler();

  const { control, handleSubmit, formState: { isSubmitting } } =
    useForm<FormLoginParams>({
      resolver: yupResolver(loginSchema),
      defaultValues: {
        email: '',
        password: '',
      },
    });

  const onSubmit = async (data: FormLoginParams) => {
    try {
      await handleAuthenticate(data);
    } catch (error) {
      errorHandler(error, 'Falha ao entrar');
    }
  };

  return (
    <View>
      <AppInput
        name="email"
        control={control}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AppInput
        name="password"
        control={control}
        placeholder="Senha"
        isPassword
      />
      <View className="mt-2">
        {isSubmitting ? (
          <View className="h-[57px] items-center justify-center">
            <ActivityIndicator color="#00B37E" />
          </View>
        ) : (
          <AppButton title="Entrar" onPress={handleSubmit(onSubmit)} />
        )}
      </View>
      <View className="mt-4">
        <AppButton
          title="Criar conta"
          mode="outline"
          onPress={() => navigation.navigate('register')}
        />
      </View>
      <Text className="text-gray-700 text-center text-sm mt-6">
        Gerencie entradas e saídas com segurança
      </Text>
    </View>
  );
}
