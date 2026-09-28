import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { NavigationContainer } from '@react-navigation/native';
import { ConvexReactClient } from 'convex/react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { CONVEX_URL } from '@/config/env';
import { useOAuthRedirect } from '@/hooks/use-oauth-redirect';
import { ThemeProvider, useThemePreference } from '@/hooks/use-theme';
import { keychainStorage } from '@/lib/keychain-storage';
import { RootNavigator } from '@/navigation/root-navigator';

const convex = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

function AppContent() {
  useOAuthRedirect();
  const { scheme } = useThemePreference();

  return (
    <>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ConvexAuthProvider client={convex} storage={keychainStorage}>
          <AppContent />
          <Toast />
        </ConvexAuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
