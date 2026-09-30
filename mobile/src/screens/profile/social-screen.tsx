import { useNavigation } from '@react-navigation/native';
import { useMutation } from 'convex/react';
import { Globe } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { FormScreen } from '@/components/ui/form-screen';
import { Input } from '@/components/ui/input';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { SettingsCard } from '@/screens/profile/profile-parts';
import { api } from '@convex/_generated/api';

type SocialKey = 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'website';

const PLATFORMS: {
  key: SocialKey;
  label: string;
  prefix: string;
  placeholder: string;
  color: string;
  glyph?: string;
}[] = [
  { key: 'instagram', label: 'Instagram', prefix: '@', placeholder: 'yourhandle', color: '#E1306C', glyph: 'IG' },
  { key: 'facebook', label: 'Facebook', prefix: 'facebook.com/', placeholder: 'yourpage', color: '#1877F2', glyph: 'f' },
  { key: 'twitter', label: 'Twitter / X', prefix: '@', placeholder: 'yourhandle', color: '#111111', glyph: 'X' },
  { key: 'youtube', label: 'YouTube', prefix: '@', placeholder: 'yourchannel', color: '#FF0000', glyph: '▶' },
  { key: 'linkedin', label: 'LinkedIn', prefix: 'linkedin.com/in/', placeholder: 'yourname', color: '#0A66C2', glyph: 'in' },
  { key: 'website', label: 'Website', prefix: '', placeholder: 'www.yourstudio.com', color: '#0F766E' },
];

const EMPTY: Record<SocialKey, string> = {
  instagram: '',
  facebook: '',
  twitter: '',
  youtube: '',
  linkedin: '',
  website: '',
};

/** "https://instagram.com/@jane/" → "jane": accept pasted links as well as bare handles. */
function toHandle(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/^(instagram\.com|facebook\.com|twitter\.com|x\.com|youtube\.com|linkedin\.com\/in)\//i, '')
    .replace(/^@/, '')
    .replace(/[/?#].*$/, '')
    .replace(/\s/g, '');
}

export function SocialScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      instagram: toHandle(user.instagram || ''),
      facebook: toHandle(user.facebook || ''),
      twitter: toHandle(user.twitter || ''),
      youtube: toHandle(user.youtube || ''),
      linkedin: toHandle(user.linkedin || ''),
      website: user.website || '',
    });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        ...form,
        website: form.website.trim().replace(/^https?:\/\//i, ''),
      });
      Toast.show({ type: 'success', text1: 'Social links updated' });
      navigation.goBack();
    } catch {
      Toast.show({ type: 'error', text1: 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <FormScreen
      eyebrow="Profile"
      title="Social handles"
      onClose={() => navigation.goBack()}
      submitTitle="Save handles"
      onSubmit={handleSave}
      loading={saving}
      hint="Shown as icons on your public profile page.">
      <SettingsCard hint="Just the handle is enough. Pasted links are cleaned up for you.">
        {PLATFORMS.map((p) => (
          <View key={p.key} style={styles.row}>
            <View style={[styles.badge, { backgroundColor: p.color }]}>
              {p.glyph ? (
                <ThemedText style={styles.glyph}>{p.glyph}</ThemedText>
              ) : (
                <Globe size={18} color="#fff" />
              )}
            </View>
            <View style={styles.inputCol}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
                {p.label}
              </ThemedText>
              <View style={styles.inputRow}>
                {!!p.prefix && (
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {p.prefix}
                  </ThemedText>
                )}
                <Input
                  style={styles.input}
                  value={form[p.key]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType={p.key === 'website' ? 'url' : 'default'}
                  placeholder={p.placeholder}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, [p.key]: p.key === 'website' ? v : toHandle(v) }))
                  }
                />
              </View>
            </View>
          </View>
        ))}
      </SettingsCard>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  badge: { width: 40, height: 40, borderRadius: Radius - 4, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  glyph: { color: '#fff', fontWeight: '800', fontSize: 14, lineHeight: 18 },
  inputCol: { flex: 1, gap: 2 },
  label: { fontSize: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  input: { flex: 1 },
});
