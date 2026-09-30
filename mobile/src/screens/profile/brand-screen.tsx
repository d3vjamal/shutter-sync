import { useNavigation } from '@react-navigation/native';
import { Camera, ImageIcon } from 'lucide-react-native';
import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FormScreen } from '@/components/ui/form-screen';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useProfileImageUpload } from '@/hooks/use-profile-image-upload';
import { useTheme } from '@/hooks/use-theme';
import { SettingsCard } from '@/screens/profile/profile-parts';

export function BrandScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { uploading, pickAndUpload } = useProfileImageUpload();

  if (!user) return null;

  const items = [
    ['brandLogo', user.brandLogoUrl, 'Brand logo', 'Shown on agreements & receipts'],
    ['coverImage', user.coverImageUrl, 'Public profile cover', 'Banner on your portfolio page'],
  ] as const;

  return (
    <FormScreen eyebrow="Profile" title="Brand & images" onClose={() => navigation.goBack()}>
      <SettingsCard hint="Images upload as soon as you pick them.">
        {items.map(([type, url, title, hint]) => (
          <PressableScale
            key={type}
            onPress={() => pickAndUpload(type)}
            scaleTo={0.98}
            style={[styles.row, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
            contentStyle={styles.rowInner}>
            {url ? (
              <Image source={{ uri: url }} style={styles.preview} />
            ) : (
              <View style={[styles.preview, styles.empty, { backgroundColor: theme.accent + '1F' }]}>
                <ImageIcon size={20} color={theme.accent} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <ThemedText type="smallBold">{title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12 }}>
                {uploading === type ? 'Uploading…' : url ? 'Tap to change' : hint}
              </ThemedText>
            </View>
            <Camera size={16} color={theme.textSecondary} />
          </PressableScale>
        ))}
      </SettingsCard>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  row: { borderWidth: 1, borderRadius: Radius },
  rowInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.two },
  preview: { width: 56, height: 56, borderRadius: 12 },
  empty: { alignItems: 'center', justifyContent: 'center' },
});
