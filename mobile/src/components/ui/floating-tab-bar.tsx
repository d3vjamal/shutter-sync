import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Banknote, LayoutDashboard, Plus, User, Users, type LucideIcon } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Gradient } from '@/components/ui/gradient';
import { Shadow, Spacing } from '@/constants/theme';
import { useGradients, useTheme } from '@/hooks/use-theme';

const ICONS: Record<string, { Icon: LucideIcon; label: string }> = {
  Dashboard: { Icon: LayoutDashboard, label: 'Home' },
  Community: { Icon: Users, label: 'Community' },
  Business: { Icon: Banknote, label: 'Business' },
  Profile: { Icon: User, label: 'Profile' },
};

function TabItem({ name, focused, onPress, onLongPress }: {
  name: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const theme = useTheme();
  const { Icon, label } = ICONS[name];
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, { toValue: focused ? 1 : 0, useNativeDriver: true, speed: 16, bounciness: 8 }).start();
  }, [focused, progress]);

  const color = focused ? theme.primary : theme.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      style={styles.item}>
      <Animated.View
        style={[
          styles.pill,
          {
            backgroundColor: theme.primary + '1F',
            opacity: progress,
            transform: [{ scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
          },
        ]}
      />
      <Animated.View
        style={{
          transform: [
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -1] }) },
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) },
          ],
        }}>
        <Icon size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
      </Animated.View>
      <Animated.Text style={[styles.label, { color, fontWeight: focused ? '700' : '500' }]} numberOfLines={1}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

/** Floating rounded tab bar with a springy active pill and a raised centre "create" button. */
export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const gradients = useGradients();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.background, paddingBottom: Math.max(insets.bottom, Spacing.two) },
      ]}>
      <View style={[styles.bar, { backgroundColor: theme.card, borderColor: theme.border }, Shadow.soft]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };
          const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

          if (route.name === 'CreateAction') {
            return (
              <View key={route.key} style={styles.item}>
                <Pressable
                  onPress={onPress}
                  accessibilityRole="button"
                  accessibilityLabel="Create new"
                  style={({ pressed }) => [styles.create, Shadow.glow, pressed && { transform: [{ scale: 0.92 }] }]}>
                  <Gradient colors={gradients.primary} radius={26} style={StyleSheet.absoluteFill} />
                  <Plus size={26} color="#fff" strokeWidth={3} />
                </Pressable>
              </View>
            );
          }

          return <TabItem key={route.key} name={route.name} focused={focused} onPress={onPress} onLongPress={onLongPress} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 66,
    borderRadius: 33,
    paddingHorizontal: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
  },
  item: { flex: 1, height: 52, alignItems: 'center', justifyContent: 'center', gap: 2 },
  pill: { position: 'absolute', top: 0, bottom: 0, left: 4, right: 4, borderRadius: 22 },
  label: { fontSize: 10.5 },
  create: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
});
