import type { ComponentType, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FadeIn } from '@/components/ui/fade-in';
import { Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Titled form card with a tinted icon chip; `index` staggers the entrance. */
export function FormSection({
  icon: Icon,
  title,
  tint,
  index = 0,
  children,
}: {
  icon: ComponentType<{ size?: number; color?: string }>;
  title: string;
  tint?: string;
  index?: number;
  children: ReactNode;
}) {
  const theme = useTheme();
  const color = tint ?? theme.primary;
  return (
    <FadeIn index={index}>
      <View style={[styles.card, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.head}>
          <View style={[styles.icon, { backgroundColor: color + '1F' }]}>
            <Icon size={16} color={color} />
          </View>
          <ThemedText type="smallBold" style={styles.title}>
            {title}
          </ThemedText>
        </View>
        {children}
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: Spacing.three },
  head: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  icon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16 },
});
