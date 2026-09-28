import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Gradient } from '@/components/ui/gradient';
import { useGradients, useTheme } from '@/hooks/use-theme';

/** Animated payment/progress bar; `value` is 0–100. */
export function ProgressBar({
  value,
  height = 6,
  colors,
}: {
  value: number;
  height?: number;
  colors?: readonly string[];
}) {
  const theme = useTheme();
  const gradients = useGradients();
  const [width, setWidth] = useState(0);
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(v, { toValue: value / 100, duration: 700, useNativeDriver: false }).start();
  }, [v, value]);

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.track, { height, backgroundColor: theme.backgroundSelected }]}>
      <Animated.View style={{ width: v.interpolate({ inputRange: [0, 1], outputRange: [0, width] }), height }}>
        <Gradient
          colors={value >= 100 ? gradients.success : (colors ?? gradients.primary)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          radius={height}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: 99, overflow: 'hidden' },
});
