import { RefreshCw } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/** Spinning icon for a ScreenHeader's `right` slot while a pull-to-refresh is in flight. */
export function RefreshIndicator({ active }: { active: boolean }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    spin.setValue(0);
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 700, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [active, spin]);

  if (!active) return null;

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <RefreshCw size={18} color="#fff" />
    </Animated.View>
  );
}
