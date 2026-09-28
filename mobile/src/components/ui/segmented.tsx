import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { Gradient } from '@/components/ui/gradient';
import { ThemedText } from '@/components/themed-text';
import { useGradients, useTheme } from '@/hooks/use-theme';

export type SegmentOption<T extends string> = { key: T; label: string };

/** Pill segmented control with a gradient indicator that slides between options. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  colors,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (key: T) => void;
  colors?: readonly string[];
}) {
  const theme = useTheme();
  const gradients = useGradients();
  const [width, setWidth] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const index = Math.max(0, options.findIndex((o) => o.key === value));
  const segment = width / options.length;

  useEffect(() => {
    Animated.spring(x, { toValue: index * segment, useNativeDriver: true, speed: 18, bounciness: 8 }).start();
  }, [x, index, segment]);

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width - 6)}
      style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
      {segment > 0 && (
        <Animated.View style={[styles.indicator, { width: segment, transform: [{ translateX: x }] }]}>
          <Gradient colors={colors ?? gradients.primary} radius={10} style={StyleSheet.absoluteFill} />
        </Animated.View>
      )}
      {options.map((o) => (
        <Pressable key={o.key} onPress={() => onChange(o.key)} style={styles.item}>
          <ThemedText
            type="smallBold"
            style={[styles.label, { color: o.key === value ? theme.onPrimary : theme.textSecondary }]}>
            {o.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: 13, padding: 3 },
  indicator: { position: 'absolute', top: 3, bottom: 3, left: 3 },
  item: { flex: 1, paddingVertical: 7, alignItems: 'center' },
  label: { fontSize: 13, lineHeight: 16 },
});
