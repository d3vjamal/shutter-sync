import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Rounded white card that groups related settings on a sub-screen. */
export function SettingsCard({ title, hint, children }: { title?: string; hint?: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.card, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {!!title && (
        <View style={{ gap: 2 }}>
          <ThemedText type="smallBold" style={{ fontSize: 16 }}>
            {title}
          </ThemedText>
          {!!hint && (
            <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12 }}>
              {hint}
            </ThemedText>
          )}
        </View>
      )}
      {children}
    </View>
  );
}

export function Field({
  label,
  error,
  ...rest
}: { label: string; error?: string } & Omit<React.ComponentProps<typeof Input>, 'error'>) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <Label>{label}</Label>
      <Input {...rest} error={!!error} />
      {!!error && (
        <ThemedText type="small" style={{ color: theme.destructive }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: Spacing.three },
  field: { gap: Spacing.one },
});
