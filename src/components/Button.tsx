import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'w-full items-center justify-center rounded-lg py-3.5 active:opacity-80';

  const variants = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-800',
    outline: 'border border-gray-300 bg-transparent',
  };

  const textVariants = {
    primary: 'text-white font-semibold text-base',
    secondary: 'text-white font-semibold text-base',
    outline: 'text-gray-700 font-semibold text-base',
  };

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#374151' : 'white'}
        />
      ) : (
        <Text className={textVariants[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
