import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Label } from '@/components/ui/label';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Labeled form field wrapper that renders a validation error below its input. */
export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <Label>{label}</Label>
      {children}
      {!!error && (
        <ThemedText type="small" style={{ color: theme.destructive }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({ field: { gap: Spacing.one } });
