import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

/** Translucent stat tiles for use inside a gradient `ScreenHeader`. */
export function HeaderStats({ stats }: { stats: { label: string; value: number }[] }) {
  return (
    <View style={styles.row}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.stat}>
          <ThemedText style={styles.value}>{stat.value}</ThemedText>
          <ThemedText type="small" style={styles.label}>{stat.label}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.two },
  stat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 16, paddingVertical: Spacing.two, alignItems: 'center' },
  value: { color: '#fff', fontSize: 24, fontWeight: '800', lineHeight: 30 },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
});
