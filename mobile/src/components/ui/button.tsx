import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Gradient } from '@/components/ui/gradient';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useGradients, useTheme } from '@/hooks/use-theme';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'destructive';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({ title, variant = 'primary', loading, disabled, icon, ...rest }: ButtonProps) {
  const theme = useTheme();
  const gradients = useGradients();
  const isDisabled = disabled || loading;
  const isFilled = variant === 'primary' || variant === 'destructive';

  const backgroundColor = variant === 'destructive' ? theme.destructive : 'transparent';
  const borderColor = variant === 'outline' ? theme.border : 'transparent';
  const textColor = isFilled ? theme.onPrimary : theme.text;

  return (
    <PressableScale
      disabled={isDisabled}
      style={[
        styles.base,
        { backgroundColor, borderColor, opacity: isDisabled ? 0.6 : 1 },
        variant === 'primary' && Shadow.glow,
      ]}
      contentStyle={styles.content}
      {...rest}>
      {variant === 'primary' && (
        <Gradient colors={gradients.primary} radius={Radius} style={StyleSheet.absoluteFill} />
      )}
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.row}>
          {icon}
          <ThemedText type="smallBold" style={{ color: textColor, fontSize: 15 }}>
            {title}
          </ThemedText>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius,
    borderWidth: 1,
  },
  content: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
