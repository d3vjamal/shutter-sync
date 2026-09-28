import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Banknote, Briefcase, Camera, Layers2, LayoutDashboard, Plus, User } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Gradient } from '@/components/ui/gradient';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useGradients, useTheme } from '@/hooks/use-theme';
import type { AppStackParamList, TabParamList } from '@/navigation/types';
import { BusinessScreen } from '@/screens/business-screen';
import { DashboardScreen } from '@/screens/dashboard-screen';
import { PackagesScreen } from '@/screens/packages-screen';
import { ProfileScreen } from '@/screens/profile-screen';

const Tab = createBottomTabNavigator<TabParamList>();

function EmptyScreen() {
  return null;
}

function CreateActionSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const theme = useTheme();
  const gradients = useGradients();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 6 }).start();
    else anim.setValue(0);
  }, [visible, anim]);

  const open = (screen: 'CreateAssignment' | 'CreateFreelance') => {
    onClose();
    navigation.navigate(screen);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={{ transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [260, 0] }) }] }}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.card }]}>
          <View style={[styles.grabber, { backgroundColor: theme.border }]} />
          <ThemedText type="subtitle" style={styles.sheetTitle}>
            Create New
          </ThemedText>
          <Pressable
            style={[styles.sheetOption, { backgroundColor: theme.primary + '1A' }]}
            onPress={() => open('CreateAssignment')}>
            <Gradient colors={gradients.primary} radius={Radius} style={styles.sheetIcon}>
              <Camera size={20} color="#fff" />
            </Gradient>
            <View style={styles.sheetOptionText}>
              <ThemedText type="smallBold">Assignment</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Standard booking session
              </ThemedText>
            </View>
          </Pressable>
          <Pressable
            style={[styles.sheetOption, { backgroundColor: theme.accent + '1A' }]}
            onPress={() => open('CreateFreelance')}>
            <Gradient colors={gradients.accent} radius={Radius} style={styles.sheetIcon}>
              <Briefcase size={20} color="#fff" />
            </Gradient>
            <View style={styles.sheetOptionText}>
              <ThemedText type="smallBold">Freelance Job</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                B2B or studio work
              </ThemedText>
            </View>
          </Pressable>
        </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export function AppTabs() {
  const theme = useTheme();
  const gradients = useGradients();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopWidth: 0,
            height: 62 + insets.bottom,
            paddingTop: 6,
            paddingBottom: Math.max(insets.bottom, 8),
            ...Shadow.soft,
          },
        }}>
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Packages"
          component={PackagesScreen}
          options={{ tabBarIcon: ({ color, size }) => <Layers2 color={color} size={size} /> }}
        />
        <Tab.Screen
          name="CreateAction"
          component={EmptyScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: () => (
              <PressableScale
                scaleTo={0.9}
                style={[styles.createButton, Shadow.glow]}
                contentStyle={styles.createInner}
                pointerEvents="none">
                <Gradient colors={gradients.primary} radius={28} style={StyleSheet.absoluteFill} />
                <Plus size={26} color="#fff" strokeWidth={3} />
              </PressableScale>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setSheetOpen(true);
            },
          }}
        />
        <Tab.Screen
          name="Business"
          component={BusinessScreen}
          options={{ tabBarIcon: ({ color, size }) => <Banknote color={color} size={size} /> }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
        />
      </Tab.Navigator>
      <CreateActionSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    top: -16,
  },
  createInner: { flex: 1, width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  grabber: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  sheetTitle: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius,
  },
  sheetIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetOptionText: {
    flex: 1,
    gap: 2,
  },
});
