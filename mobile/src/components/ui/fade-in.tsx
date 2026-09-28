import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

/** Fades and slides children up on mount; use `index` to stagger lists. */
export function FadeIn({
  children,
  index = 0,
  delay = 0,
  distance = 16,
  style,
}: {
  children: ReactNode;
  index?: number;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 420,
      delay: delay + Math.min(index, 8) * 60,
      useNativeDriver: true,
    }).start();
  }, [v, index, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v,
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }],
        },
      ]}>
      {children}
    </Animated.View>
  );
}
