import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import { PublicStackParamList } from '@/@types/navigation';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { useAuthContext } from '@/context/auth.context';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { FormRegisterParams } from '@/shared/types/forms';
import { registerSchema } from '@/screens/register/schema';

type Navigation = StackNavigationProp<PublicStackParamList, 'register'>;

export function RegisterForm() {
  const navigation = useNavigation<Navigation>();
  const { handleRegister } = useAuthContext();
  const errorHandler = useErrorHandler();

  const { control, handleSubmit, formState: { isSubmitting } } =
    useForm<FormRegisterParams>({
      resolver: yupResolver(registerSchema),
      defaultValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    });

  const onSubmit = async (data: FormRegisterParams) => {
    try {
      await handleRegister(data);
    } catch (error) {
      errorHandler(error, 'Falha ao criar conta');
    }
  };

  return (
    <View>
      <AppInput name="name" control={control} placeholder="Nome completo" />
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
      <AppInput
        name="confirmPassword"
        control={control}
        placeholder="Confirmar senha"
        isPassword
      />
      <View className="mt-2">
        {isSubmitting ? (
          <View className="h-[57px] items-center justify-center">
            <ActivityIndicator color="#00B37E" />
          </View>
        ) : (
          <AppButton title="Criar conta" onPress={handleSubmit(onSubmit)} />
        )}
      </View>
      <View className="mt-4">
        <AppButton
          title="Voltar para login"
          mode="outline"
          onPress={() => navigation.navigate('login')}
        />
      </View>
    </View>
  );
}
