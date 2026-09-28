import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

/** Soft radial glow in one of the logo's own blade colors. */
function Glow({ color, size }: { color: string; size: number }) {
  const id = `glow-${color.replace('#', '')}`;
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.55} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

/**
 * ShutterSync logo with an optional float + "sync pulse" loop: a soft glow that
 * alternates between the mark's own navy and gold blade colors behind the logo,
 * instead of a generic blue accent.
 */
export function BrandLogo({ size = 72, animated = false }: { size?: number; animated?: boolean }) {
  const theme = useTheme();

  const float = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    const pulseLoop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    );
    floatLoop.start();
    pulseLoop.start();
    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [float, pulse, animated]);

  const glowSize = size * 2.2;
  const navyOpacity = pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 0.1, 0.6] });
  const goldOpacity = pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 0.6, 0.1] });
  const glowScale = pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.92, 1.08, 0.92] });

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      {animated && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[styles.glow, { width: glowSize, height: glowSize, opacity: navyOpacity, transform: [{ scale: glowScale }] }]}>
            <Glow color={theme.primary} size={glowSize} />
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={[styles.glow, { width: glowSize, height: glowSize, opacity: goldOpacity, transform: [{ scale: glowScale }] }]}>
            <Glow color={theme.accent} size={glowSize} />
          </Animated.View>
        </>
      )}
      <Animated.View
        style={{
          transform: [
            { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) },
            { scale: float.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) },
          ],
        }}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={{ width: size, height: size * 0.955 }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute' },
});
