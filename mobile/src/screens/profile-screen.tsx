import { useAction, useMutation, useQuery } from 'convex/react';
import {
  AtSign,
  Camera,
  CheckCircle2,
  ChevronRight,
  ImageIcon,
  LogOut,
  Lock,
  Monitor,
  Moon,
  Palette,
  Sun,
  User as UserIcon,
  XCircle,
} from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FadeIn } from '@/components/ui/fade-in';
import { Gradient } from '@/components/ui/gradient';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useGradients, useTheme, useThemePreference } from '@/hooks/use-theme';
import { uploadImageToConvex } from '@/lib/upload-image';
import { isNonEmpty, isValidPhone, isValidUpiId } from '@/lib/validation';
import { api } from '@convex/_generated/api';

const EMPTY_FORM = {
  name: '',
  contact: '',
  upiId: '',
  bio: '',
  instagram: '',
  facebook: '',
  twitter: '',
  username: '',
};

export function ProfileScreen() {
  const theme = useTheme();
  const gradients = useGradients();
  const { preference, setPreference } = useThemePreference();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updatePassword = useAction(api.users.updatePassword);

  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState<'avatar' | 'brandLogo' | 'coverImage' | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNext, setPwNext] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const usernameValid = /^[a-z0-9_]{3,20}$/.test(form.username);
  const usernameCheck = useQuery(
    api.users.checkUsername,
    usernameValid ? { username: form.username } : 'skip',
  );
  const usernameStatus = !form.username
    ? 'empty'
    : !usernameValid
      ? 'invalid'
      : usernameCheck === undefined
        ? 'checking'
        : usernameCheck.available
          ? 'available'
          : 'taken';

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        contact: user.contact || '',
        upiId: user.upiId || '',
        bio: user.bio || '',
        instagram: user.instagram || '',
        facebook: user.facebook || '',
        twitter: user.twitter || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const setField = (field: keyof typeof EMPTY_FORM, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const pickAndUpload = async (type: 'avatar' | 'brandLogo' | 'coverImage') => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    setUploading(type);
    try {
      const uploadUrl = await generateUploadUrl();
      const storageId = await uploadImageToConvex(uploadUrl, {
        uri: asset.uri,
        type: asset.type,
      });
      const field =
        type === 'avatar' ? 'avatarUrl' : type === 'brandLogo' ? 'brandLogoUrl' : 'coverImageUrl';
      await updateUserProfile({ [field]: storageId } as any);
      Toast.show({ type: 'success', text1: 'Photo updated' });
    } catch {
      Toast.show({ type: 'error', text1: 'Upload failed' });
    } finally {
      setUploading(null);
    }
  };

  const fieldErrors = useMemo(() => {
    const e: Partial<Record<'name' | 'contact' | 'upiId', string>> = {};
    if (!isNonEmpty(form.name)) e.name = 'Full name is required';
    if (isNonEmpty(form.contact) && !isValidPhone(form.contact)) e.contact = 'Enter a valid phone number (10-13 digits)';
    if (isNonEmpty(form.upiId) && !isValidUpiId(form.upiId)) e.upiId = 'Enter a valid UPI ID (e.g. name@bank)';
    return e;
  }, [form.name, form.contact, form.upiId]);

  const handleSave = async () => {
    if (Object.keys(fieldErrors).length > 0) {
      setSubmitAttempted(true);
      Toast.show({ type: 'error', text1: Object.values(fieldErrors)[0]! });
      return;
    }
    if (form.username) {
      if (!usernameValid) {
        Toast.show({
          type: 'error',
          text1: 'Username must be 3–20 characters: letters, numbers, underscores only.',
        });
        return;
      }
      if (usernameStatus === 'taken') {
        Toast.show({ type: 'error', text1: 'That username is already taken.' });
        return;
      }
    }
    setSaving(true);
    try {
      await updateUserProfile(form);
      Toast.show({ type: 'success', text1: 'Profile updated' });
    } catch {
      Toast.show({ type: 'error', text1: 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!pwCurrent) {
      Toast.show({ type: 'error', text1: 'Enter your current password' });
      return;
    }
    if (pwNext.length < 8) {
      Toast.show({ type: 'error', text1: 'New password must be at least 8 characters' });
      return;
    }
    if (pwNext !== pwConfirm) {
      Toast.show({ type: 'error', text1: 'New passwords do not match' });
      return;
    }
    setPwSaving(true);
    try {
      await updatePassword({ currentPassword: pwCurrent, newPassword: pwNext });
      Toast.show({ type: 'success', text1: 'Password updated successfully' });
      setPwCurrent('');
      setPwNext('');
      setPwConfirm('');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      Toast.show({
        type: 'error',
        text1: message.toLowerCase().includes('invalid')
          ? 'Current password is incorrect'
          : message || 'Failed to update password',
      });
    } finally {
      setPwSaving(false);
    }
  };

  if (!user) return null;

  const initial = (user.name || user.email || 'U')[0].toUpperCase();

  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Gradient colors={gradients.primary} style={[styles.hero, { paddingTop: insets.top + Spacing.four }]}>
          <View style={styles.blobA} />
          <View style={styles.blobB} />
          <Pressable onPress={() => pickAndUpload('avatar')} style={styles.avatarWrap}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <ThemedText style={styles.avatarInitial}>{initial}</ThemedText>
              </View>
            )}
            <View style={[styles.avatarBadge, { backgroundColor: theme.card }]}>
              <Camera size={13} color={theme.primary} />
            </View>
          </Pressable>
          <ThemedText type="subtitle" style={styles.heroName} numberOfLines={1}>
            {uploading === 'avatar' ? 'Uploading…' : user.name || 'Photographer'}
          </ThemedText>
          <ThemedText type="small" style={styles.heroEmail}>
            {user.email}
          </ThemedText>
          {!!user.username && (
            <View style={styles.handle}>
              <AtSign size={12} color="#fff" />
              <ThemedText type="smallBold" style={{ color: '#fff', fontSize: 12 }}>
                {user.username}
              </ThemedText>
            </View>
          )}
        </Gradient>

        <View style={styles.body}>
          <FadeIn index={0}>
            <Section icon={UserIcon} title="Identity" tint={theme.primary}>
              <Field
                label="Full Name"
                value={form.name}
                onChangeText={(v) => setField('name', v)}
                error={submitAttempted ? fieldErrors.name : undefined}
              />
              <Field
                label="Contact"
                value={form.contact}
                onChangeText={(v) => setField('contact', v.replace(/[^\d+]/g, '').slice(0, 13))}
                keyboardType="phone-pad"
                error={submitAttempted ? fieldErrors.contact : undefined}
              />
              <Field
                label="UPI ID"
                value={form.upiId}
                onChangeText={(v) => setField('upiId', v)}
                autoCapitalize="none"
                error={submitAttempted ? fieldErrors.upiId : undefined}
              />
              <View style={styles.field}>
                <Label>Username</Label>
                <Input
                  value={form.username}
                  autoCapitalize="none"
                  onChangeText={(v) => setField('username', v.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20))}
                  placeholder="e.g. jane_photography"
                />
                {!!form.username && (
                  <View style={styles.usernameStatusRow}>
                    {usernameStatus === 'available' && <CheckCircle2 size={12} color={theme.success} />}
                    {usernameStatus === 'taken' && <XCircle size={12} color={theme.destructive} />}
                    <ThemedText
                      type="small"
                      style={{
                        color:
                          usernameStatus === 'available'
                            ? theme.success
                            : usernameStatus === 'taken'
                              ? theme.destructive
                              : theme.textSecondary,
                      }}>
                      {usernameStatus === 'available'
                        ? 'Available'
                        : usernameStatus === 'taken'
                          ? 'Already taken'
                          : usernameStatus === 'invalid'
                            ? 'Letters, numbers, underscores only'
                            : 'Checking…'}
                    </ThemedText>
                  </View>
                )}
              </View>
            </Section>
          </FadeIn>

          <FadeIn index={1}>
            <Section icon={Palette} title="Brand" tint={theme.accent}>
              {(
                [
                  ['brandLogo', user.brandLogoUrl, 'Brand logo', 'Shown on agreements & receipts'],
                  ['coverImage', user.coverImageUrl, 'Public profile cover', 'Banner on your portfolio page'],
                ] as const
              ).map(([type, url, title, hint]) => (
                <PressableScale
                  key={type}
                  onPress={() => pickAndUpload(type)}
                  scaleTo={0.98}
                  style={[styles.imageUploadRow, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
                  contentStyle={styles.imageUploadInner}>
                  {url ? (
                    <Image source={{ uri: url }} style={styles.brandLogoPreview} />
                  ) : (
                    <View style={[styles.brandLogoPreview, styles.previewEmpty, { backgroundColor: theme.accent + '1F' }]}>
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
            </Section>
          </FadeIn>

          <FadeIn index={2}>
            <Section icon={Moon} title="Appearance" tint={theme.text}>
              <View style={styles.modeRow}>
                {(
                  [
                    ['light', Sun, 'Light'],
                    ['dark', Moon, 'Dark'],
                    ['system', Monitor, 'System'],
                  ] as const
                ).map(([key, Icon, label]) => {
                  const active = preference === key;
                  return (
                    <Pressable
                      key={key}
                      onPress={() => setPreference(key)}
                      style={[
                        styles.modeCard,
                        {
                          borderColor: active ? theme.primary : theme.border,
                          backgroundColor: active ? theme.primary + '14' : theme.backgroundElement,
                        },
                      ]}>
                      <Icon size={18} color={active ? theme.primary : theme.textSecondary} />
                      <ThemedText
                        type="small"
                        style={{ color: active ? theme.primary : theme.textSecondary, fontWeight: active ? '700' : '400' }}>
                        {label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </Section>
          </FadeIn>

          <FadeIn index={3}>
            <Section icon={AtSign} title="Social Presence" tint={theme.primary}>
              <Field label="Bio" value={form.bio} onChangeText={(v) => setField('bio', v)} multiline />
              <Field label="Instagram" value={form.instagram} onChangeText={(v) => setField('instagram', v)} autoCapitalize="none" />
              <Field label="Facebook" value={form.facebook} onChangeText={(v) => setField('facebook', v)} autoCapitalize="none" />
              <Field label="Twitter / X" value={form.twitter} onChangeText={(v) => setField('twitter', v)} autoCapitalize="none" />
            </Section>
          </FadeIn>

          <FadeIn index={4}>
            <Section icon={Lock} title="Security" tint={theme.destructive}>
              <Field label="Current Password" value={pwCurrent} onChangeText={setPwCurrent} secureTextEntry />
              <Field label="New Password" value={pwNext} onChangeText={setPwNext} secureTextEntry />
              <Field label="Confirm New Password" value={pwConfirm} onChangeText={setPwConfirm} secureTextEntry />
              <Button title="Update Password" variant="outline" onPress={handlePasswordChange} loading={pwSaving} />
            </Section>
          </FadeIn>

          <Pressable
            onPress={() => signOut()}
            style={[styles.logout, { borderColor: theme.destructive + '55', backgroundColor: theme.destructive + '12' }]}>
            <View style={styles.logoutLeft}>
              <LogOut size={16} color={theme.destructive} />
              <ThemedText type="smallBold" style={{ color: theme.destructive }}>
                Log out
              </ThemedText>
            </View>
            <ChevronRight size={16} color={theme.destructive} />
          </Pressable>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: theme.card, borderTopColor: theme.border, paddingBottom: Math.max(insets.bottom, 12) },
        ]}>
        <Button title="Save Profile" onPress={handleSave} loading={saving} />
      </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

function Section({
  icon: Icon,
  title,
  tint,
  children,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  tint: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.card, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.sectionHead}>
        <View style={[styles.sectionIcon, { backgroundColor: tint + '1F' }]}>
          <Icon size={16} color={tint} />
        </View>
        <ThemedText type="smallBold" style={{ fontSize: 16 }}>
          {title}
        </ThemedText>
      </View>
      {children}
    </View>
  );
}

function Field({
  label,
  error,
  ...rest
}: { label: string; error?: string } & Omit<React.ComponentProps<typeof Input>, 'error'>) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <Label>{label}</Label>
      <Input {...rest} error={!!error} />
      {!!error && (
        <ThemedText type="small" style={{ color: theme.destructive }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.four },
  hero: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: Spacing.five,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  blobA: { position: 'absolute', right: -50, top: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.12)' },
  blobB: { position: 'absolute', left: -70, bottom: -80, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255,140,90,0.18)' },
  avatarWrap: { marginBottom: Spacing.two },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.22)' },
  avatarInitial: { color: '#fff', fontSize: 38, fontWeight: '800', lineHeight: 46 },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.soft,
  },
  heroName: { color: '#fff', fontSize: 24, lineHeight: 30, paddingHorizontal: Spacing.four },
  heroEmail: { color: 'rgba(255,255,255,0.8)' },
  handle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  body: { padding: Spacing.three, gap: Spacing.three },
  card: { borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: Spacing.three },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  sectionIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  field: { gap: Spacing.one },
  usernameStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  imageUploadRow: { borderWidth: 1, borderRadius: Radius },
  imageUploadInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.two },
  brandLogoPreview: { width: 44, height: 44, borderRadius: 12 },
  previewEmpty: { alignItems: 'center', justifyContent: 'center' },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    minHeight: 50,
    borderRadius: Radius,
    borderWidth: 1,
  },
  logoutLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  modeRow: { flexDirection: 'row', gap: Spacing.two },
  modeCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.three,
    borderRadius: Radius,
    borderWidth: 1.5,
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
