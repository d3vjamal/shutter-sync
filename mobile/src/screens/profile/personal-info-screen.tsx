import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from 'convex/react';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { FormScreen } from '@/components/ui/form-screen';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WEB_URL } from '@/config/env';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { isNonEmpty, isValidPhone, isValidUpiId } from '@/lib/validation';
import { Field, SettingsCard } from '@/screens/profile/profile-parts';
import { api } from '@convex/_generated/api';

export function PersonalInfoScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const updateUserProfile = useMutation(api.users.updateUserProfile);

  const [form, setForm] = useState({ name: '', contact: '', upiId: '', bio: '', username: '' });
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        contact: user.contact || '',
        upiId: user.upiId || '',
        bio: user.bio || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const setField = (field: keyof typeof form, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const usernameValid = /^[a-z0-9_]{3,20}$/.test(form.username);
  const usernameCheck = useQuery(api.users.checkUsername, usernameValid ? { username: form.username } : 'skip');
  const usernameStatus = !form.username
    ? 'empty'
    : !usernameValid
      ? 'invalid'
      : usernameCheck === undefined
        ? 'checking'
        : usernameCheck.available
          ? 'available'
          : 'taken';

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
        Toast.show({ type: 'error', text1: 'Username must be 3–20 characters: letters, numbers, underscores only.' });
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
      navigation.goBack();
    } catch {
      Toast.show({ type: 'error', text1: 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const statusColor =
    usernameStatus === 'available' ? theme.success : usernameStatus === 'taken' ? theme.destructive : theme.textSecondary;

  return (
    <FormScreen
      eyebrow="Profile"
      title="Personal info"
      onClose={() => navigation.goBack()}
      submitTitle="Save changes"
      onSubmit={handleSave}
      loading={saving}>
      <SettingsCard title="About you">
        <Field
          label="Full Name"
          value={form.name}
          onChangeText={(v) => setField('name', v)}
          error={submitAttempted ? fieldErrors.name : undefined}
        />
        <Field label="Bio" value={form.bio} onChangeText={(v) => setField('bio', v)} multiline />
      </SettingsCard>

      <SettingsCard title="Contact & payments" hint="Contact is used for the WhatsApp button on your public page.">
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
      </SettingsCard>

      <SettingsCard title="Username" hint="Part of your public profile link.">
        <View style={styles.field}>
          <Label>Username</Label>
          <Input
            value={form.username}
            autoCapitalize="none"
            onChangeText={(v) => setField('username', v.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20))}
            placeholder="e.g. jane_photography"
          />
          {!!form.username && (
            <View style={styles.statusRow}>
              {usernameStatus === 'available' && <CheckCircle2 size={12} color={theme.success} />}
              {usernameStatus === 'taken' && <XCircle size={12} color={theme.destructive} />}
              <ThemedText type="small" style={{ color: statusColor }}>
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
          {!!form.username && usernameStatus === 'available' && !!WEB_URL && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.mono}>
              {WEB_URL.replace(/^https?:\/\//, '')}/photographer/
              <ThemedText type="small" style={[styles.mono, { color: theme.primary, fontWeight: '700' }]}>
                {form.username}
              </ThemedText>
            </ThemedText>
          )}
        </View>
      </SettingsCard>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  field: { gap: Spacing.one },
  mono: { fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
