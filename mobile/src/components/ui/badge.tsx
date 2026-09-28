import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Badge({ label, color = 'primary' }: { label: string; color?: ThemeColor }) {
  const theme = useTheme();
  return (
    <View style={[styles.base, { backgroundColor: theme[color] + '22' }]}>
      <ThemedText type="small" themeColor={color} style={styles.text}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
  },
});
