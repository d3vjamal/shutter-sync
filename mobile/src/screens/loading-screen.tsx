import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandLogo } from '@/components/ui/brand-logo';

export function LoadingScreen() {
  return (
    <ThemedView style={styles.root}>
      <BrandLogo size={96} animated />
      <ThemedText type="smallBold" themeColor="textSecondary">
        ShutterSync
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 } });
