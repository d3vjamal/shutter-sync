import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/hooks/use-auth';
import { AppStack } from '@/navigation/app-stack';
import type { RootStackParamList } from '@/navigation/types';
import { AdminNotSupportedScreen } from '@/screens/admin-not-supported-screen';
import { LoginScreen } from '@/screens/auth/login-screen';
import { LoadingScreen } from '@/screens/loading-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user } = useAuth();

  if (user === undefined) {
    return <LoadingScreen />;
  }

  const isAdmin = user?.roleCode === 0;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={LoginScreen} />
      ) : isAdmin ? (
        <Stack.Screen name="AdminBlocked" component={AdminNotSupportedScreen} />
      ) : (
        <Stack.Screen name="App" component={AppStack} />
      )}
    </Stack.Navigator>
  );
}
