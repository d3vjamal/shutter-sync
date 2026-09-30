import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppTabs } from '@/navigation/app-tabs';
import type { AppStackParamList } from '@/navigation/types';
import { CreateAssignmentScreen } from '@/screens/create-assignment-screen';
import { CreateFreelanceScreen } from '@/screens/create-freelance-screen';
import { AppearanceScreen } from '@/screens/profile/appearance-screen';
import { BrandScreen } from '@/screens/profile/brand-screen';
import { PersonalInfoScreen } from '@/screens/profile/personal-info-screen';
import { SecurityScreen } from '@/screens/profile/security-screen';
import { SocialScreen } from '@/screens/profile/social-screen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="SocialHandles" component={SocialScreen} />
      <Stack.Screen name="Brand" component={BrandScreen} />
      <Stack.Screen name="Appearance" component={AppearanceScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
        <Stack.Screen
          name="CreateAssignment"
          component={CreateAssignmentScreen}
          options={({ route }) => ({
            title: route.params?.assignment ? 'Edit Assignment' : 'New Assignment',
          })}
        />
        <Stack.Screen
          name="CreateFreelance"
          component={CreateFreelanceScreen}
          options={({ route }) => ({
            title: route.params?.job ? 'Edit Freelance Job' : 'New Freelance Job',
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
