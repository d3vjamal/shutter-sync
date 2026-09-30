import { useNavigation } from '@react-navigation/native';
import { useAction } from 'convex/react';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

import { FormScreen } from '@/components/ui/form-screen';
import { Field, SettingsCard } from '@/screens/profile/profile-parts';
import { api } from '@convex/_generated/api';

export function SecurityScreen() {
  const navigation = useNavigation();
  const updatePassword = useAction(api.users.updatePassword);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!current) return Toast.show({ type: 'error', text1: 'Enter your current password' });
    if (next.length < 8) return Toast.show({ type: 'error', text1: 'New password must be at least 8 characters' });
    if (next !== confirm) return Toast.show({ type: 'error', text1: 'New passwords do not match' });

    setSaving(true);
    try {
      await updatePassword({ currentPassword: current, newPassword: next });
      Toast.show({ type: 'success', text1: 'Password updated successfully' });
      navigation.goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      Toast.show({
        type: 'error',
        text1: message.toLowerCase().includes('invalid')
          ? 'Current password is incorrect'
          : message || 'Failed to update password',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreen
      eyebrow="Profile"
      title="Security"
      onClose={() => navigation.goBack()}
      submitTitle="Update password"
      onSubmit={handleSubmit}
      loading={saving}>
      <SettingsCard title="Change password" hint="At least 8 characters.">
        <Field label="Current Password" value={current} onChangeText={setCurrent} secureTextEntry />
        <Field label="New Password" value={next} onChangeText={setNext} secureTextEntry />
        <Field label="Confirm New Password" value={confirm} onChangeText={setConfirm} secureTextEntry />
      </SettingsCard>
    </FormScreen>
  );
}
