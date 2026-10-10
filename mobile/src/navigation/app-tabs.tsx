import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Briefcase, Camera } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FloatingTabBar } from '@/components/ui/floating-tab-bar';
import { Gradient } from '@/components/ui/gradient';
import { Radius, Spacing } from '@/constants/theme';
import { useGradients, useTheme } from '@/hooks/use-theme';
import type { AppStackParamList, TabParamList } from '@/navigation/types';
import { BusinessScreen } from '@/screens/business-screen';
import { CommunityScreen } from '@/screens/community-screen';
import { DashboardScreen } from '@/screens/dashboard-screen';
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
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Tab.Navigator
        // React Navigation invokes `tabBar` as a plain function, so it must return an element
        // (rendering the component) for the bar's hooks to run inside a component.
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
        />
        <Tab.Screen
          name="Community"
          component={CommunityScreen}
        />
        <Tab.Screen
          name="CreateAction"
          component={EmptyScreen}
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
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
        />
      </Tab.Navigator>
      <CreateActionSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
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
