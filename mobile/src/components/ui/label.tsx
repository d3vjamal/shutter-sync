import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export function Label({ children }: { children: string }) {
  return (
    <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
      {children}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
