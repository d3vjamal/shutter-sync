import { useId, useState } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type GradientProps = ViewProps & {
  colors: readonly string[];
  /** 0–1 coordinates; defaults to a top-left → bottom-right diagonal. */
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  radius?: number;
};

/** Linear gradient background built on react-native-svg (no extra native module). */
export function Gradient({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  radius = 0,
  style,
  children,
  ...rest
}: GradientProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <View
      style={[{ overflow: 'hidden', borderRadius: radius }, style]}
      {...rest}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize((p) => (p.w === width && p.h === height ? p : { w: width, h: height }));
        rest.onLayout?.(e);
      }}>
      <Svg style={StyleSheet.absoluteFill} width={size.w} height={size.h} pointerEvents="none">
        <Defs>
          <LinearGradient id={id} x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
            {colors.map((c, i) => (
              <Stop key={i} offset={i / (colors.length - 1)} stopColor={c} />
            ))}
          </LinearGradient>
        </Defs>
        <Rect width={size.w} height={size.h} fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}
