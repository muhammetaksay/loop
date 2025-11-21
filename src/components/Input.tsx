import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="mb-4 w-full">
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      <TextInput
        className={`w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
}
