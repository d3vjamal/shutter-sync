import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Gradient } from '@/components/ui/gradient';
import { Spacing } from '@/constants/theme';
import { useGradients, useTheme } from '@/hooks/use-theme';

/** Full-screen form shell: gradient header with close, scrolling body, sticky submit bar. */
export function FormScreen({
  eyebrow,
  title,
  onClose,
  submitTitle,
  onSubmit,
  loading,
  disabled,
  hint,
  children,
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
  submitTitle: string;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  const theme = useTheme();
  const gradients = useGradients();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={{ flex: 1 }}>
      <Gradient colors={gradients.primary} style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
        <View style={styles.blob} />
        <View style={{ flex: 1 }}>
          <ThemedText type="small" style={styles.eyebrow}>{eyebrow}</ThemedText>
          <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>{title}</ThemedText>
        </View>
        <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
          <X size={18} color="#fff" strokeWidth={3} />
        </Pressable>
      </Gradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
        <View
          style={[
            styles.footer,
            { backgroundColor: theme.card, borderTopColor: theme.border, paddingBottom: Math.max(insets.bottom, 12) },
          ]}>
          {!!hint && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
              {hint}
            </ThemedText>
          )}
          <Button title={submitTitle} onPress={onSubmit} loading={loading} disabled={disabled} />
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  blob: { position: 'absolute', right: -40, top: -60, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255,255,255,0.12)' },
  eyebrow: { color: 'rgba(255,255,255,0.75)' },
  title: { color: '#fff', fontSize: 24, lineHeight: 30 },
  close: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: Spacing.three, gap: Spacing.three, paddingBottom: Spacing.five },
  footer: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, borderTopWidth: StyleSheet.hairlineWidth, gap: 6 },
  hint: { textAlign: 'center', fontSize: 12 },
});
