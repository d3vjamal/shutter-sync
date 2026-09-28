import { useRef } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  /** Style for the inner pressable (layout of children). */
  contentStyle?: StyleProp<ViewStyle>;
};

/** Pressable that springs down slightly while pressed. */
export function PressableScale({ style, contentStyle, scaleTo = 0.96, onPressIn, onPressOut, ...rest }: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const spring = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Pressable
        onPressIn={(e) => {
          spring(scaleTo);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          spring(1);
          onPressOut?.(e);
        }}
        {...rest}
        style={contentStyle}
      />
    </Animated.View>
  );
}
