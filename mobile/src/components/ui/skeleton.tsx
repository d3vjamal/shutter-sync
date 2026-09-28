import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Pulsing placeholder block for loading states. */
export function Skeleton({ style, ...rest }: ViewProps) {
  const theme = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <Animated.View
      style={[styles.base, { backgroundColor: theme.backgroundElement, opacity }, style]}
      {...rest}
    />
  );
}

/** Placeholder shaped like a list card: icon block + two text lines + a bar. */
export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton style={styles.icon} />
      <View style={styles.lines}>
        <Skeleton style={{ width: '60%' }} />
        <Skeleton style={{ width: '40%', height: 12 }} />
        <Skeleton style={{ width: '100%', height: 6 }} />
      </View>
    </View>
  );
}

/** Placeholder shaped like a stat tile: label + big value. */
export function SkeletonStat() {
  return (
    <View style={styles.stat}>
      <Skeleton style={{ width: '70%', height: 12 }} />
      <Skeleton style={{ width: '50%', height: 22 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius,
    height: 16,
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  icon: { width: 48, height: 48, borderRadius: 14 },
  lines: { flex: 1, gap: Spacing.two },
  stat: { flex: 1, gap: Spacing.two, padding: Spacing.three },
});
