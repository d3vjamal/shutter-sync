import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppTabs } from '@/navigation/app-tabs';
import type { AppStackParamList } from '@/navigation/types';
import { CreateAssignmentScreen } from '@/screens/create-assignment-screen';
import { CreateFreelanceScreen } from '@/screens/create-freelance-screen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
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
