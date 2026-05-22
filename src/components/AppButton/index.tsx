import clsx from 'clsx';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type AppButtonProps = TouchableOpacityProps & {
  title: string;
  mode?: 'fill' | 'outline';
};

export function AppButton({
  title,
  mode = 'fill',
  disabled,
  className,
  ...rest
}: AppButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      className={clsx(
        'h-[57px] rounded-lg items-center justify-center px-4',
        mode === 'fill'
          ? 'bg-accent-brand'
          : 'border border-accent-brand bg-transparent',
        disabled && 'opacity-50',
        className
      )}
      {...rest}
    >
      <Text
        className={clsx(
          'text-base font-medium',
          mode === 'fill' ? 'text-white' : 'text-accent-brand-light'
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
