import { ShieldAlert } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';

export function AdminNotSupportedScreen() {
  const theme = useTheme();
  const { signOut } = useAuth();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ShieldAlert size={40} color={theme.textSecondary} />
        <ThemedText type="subtitle" style={styles.title}>
          Admin accounts aren't supported yet
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
          The mobile app currently only supports photographer accounts. Please use the web
          dashboard to manage admin features.
        </ThemedText>
        <View style={styles.button}>
          <Button title="Log out" variant="outline" onPress={() => signOut()} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.three,
    alignSelf: 'stretch',
  },
});
