import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Gradient } from '@/components/ui/gradient';
import { Spacing } from '@/constants/theme';
import { useGradients } from '@/hooks/use-theme';

/** Gradient hero header with rounded bottom; `children` renders below the title (stats, controls). */
export function ScreenHeader({
  eyebrow,
  title,
  right,
  children,
  paddingTop = Spacing.three,
  colors,
}: {
  eyebrow?: string;
  title: string;
  right?: ReactNode;
  children?: ReactNode;
  paddingTop?: number;
  colors?: readonly string[];
}) {
  const gradients = useGradients();
  return (
    <Gradient colors={colors ?? gradients.primary} style={[styles.wrap, { paddingTop }]}>
      <View style={styles.blobA} />
      <View style={styles.blobB} />
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          {!!eyebrow && <ThemedText type="small" style={styles.eyebrow}>{eyebrow}</ThemedText>}
          <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>{title}</ThemedText>
        </View>
        {right}
      </View>
      {children}
    </Gradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  blobA: { position: 'absolute', right: -40, top: -50, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.12)' },
  blobB: { position: 'absolute', left: -60, bottom: -70, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,140,90,0.18)' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  eyebrow: { color: 'rgba(255,255,255,0.75)' },
  title: { color: '#fff', fontSize: 26, lineHeight: 32 },
});
