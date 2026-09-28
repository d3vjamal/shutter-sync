import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Input({ style, onFocus, onBlur, error, ...rest }: TextInputProps & { error?: boolean }) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      placeholderTextColor={theme.textSecondary}
      style={[
        styles.base,
        {
          backgroundColor: focused ? theme.card : theme.backgroundElement,
          color: theme.text,
          borderColor: error ? theme.destructive : focused ? theme.primary : theme.border,
        },
        style,
      ]}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...rest}
    />
  );
}

export function Textarea({ style, numberOfLines = 4, ...rest }: TextInputProps & { error?: boolean }) {
  return (
    <Input
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      style={[{ minHeight: 96, paddingTop: Spacing.two }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: Radius,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
});
