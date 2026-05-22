import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

type AppInputProps<T extends FieldValues> = TextInputProps & {
  name: Path<T>;
  control: Control<T>;
  icon?: ReactNode;
  isPassword?: boolean;
};

export function AppInput<T extends FieldValues>({
  name,
  control,
  icon,
  isPassword = false,
  ...rest
}: AppInputProps<T>) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="mb-4">
          <View
            className={clsx(
              'flex-row items-center border rounded-lg px-4 min-h-[57px] bg-background-secondary',
              focused ? 'border-accent-brand-light' : 'border-gray-800',
              error && 'border-accent-red'
            )}
          >
            {icon ? <View className="mr-3">{icon}</View> : null}
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              onFocus={() => setFocused(true)}
              secureTextEntry={isPassword && !showPassword}
              placeholderTextColor="#7C7C8A"
              className="flex-1 text-white text-base py-3"
              {...rest}
            />
            {isPassword ? (
              <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                <Text className="text-gray-700 text-sm">
                  {showPassword ? 'Ocultar' : 'Ver'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {error?.message ? (
            <Text className="text-accent-red text-sm mt-1">{error.message}</Text>
          ) : null}
        </View>
      )}
    />
  );
}
