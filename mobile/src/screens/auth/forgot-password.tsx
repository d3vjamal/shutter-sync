import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spacing } from '@/constants/theme';
import { isValidEmail } from '@/lib/validation';

export function ForgotPassword({ onBack }: { onBack: () => void }) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fail = (message: string) => Toast.show({ type: 'error', text1: message });

  const requestCode = async () => {
    if (!isValidEmail(email)) return fail('Enter a valid email address.');
    setLoading(true);
    try {
      await signIn('password', { email, flow: 'reset' });
      setStep('verify');
      Toast.show({ type: 'success', text1: 'We emailed you a reset code.' });
    } catch {
      fail('Could not send reset email. Check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (code.length !== 8) return fail('Enter the 8-digit code from your email.');
    if (newPassword.length < 8) return fail('Password must be at least 8 characters');
    if (!/[A-Z]/.test(newPassword)) return fail('Password must contain at least one uppercase letter');
    if (!/[0-9]/.test(newPassword)) return fail('Password must contain at least one number');
    setLoading(true);
    try {
      // On success this also signs the user in.
      await signIn('password', { email, code, newPassword, flow: 'reset-verification' });
    } catch {
      fail('Invalid or expired code. Please try again.');
      setLoading(false);
    }
  };

  return (
    <View style={{ gap: Spacing.three }}>
      <ThemedText type="small" themeColor="textSecondary">
        {step === 'request'
          ? "Enter your account email and we'll send you a reset code."
          : `Enter the code sent to ${email} and choose a new password.`}
      </ThemedText>

      {step === 'request' ? (
        <>
          <View style={{ gap: Spacing.one }}>
            <Label>Email</Label>
            <Input
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <Button title="Send Reset Code" onPress={requestCode} loading={loading} />
        </>
      ) : (
        <>
          <View style={{ gap: Spacing.one }}>
            <Label>Reset Code</Label>
            <Input
              placeholder="12345678"
              value={code}
              onChangeText={(v) => /^[0-9]*$/.test(v) && setCode(v)}
              keyboardType="number-pad"
              maxLength={8}
            />
          </View>
          <View style={{ gap: Spacing.one }}>
            <Label>New Password</Label>
            <Input placeholder="••••••••" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
          </View>
          <Button title="Reset Password" onPress={resetPassword} loading={loading} />
        </>
      )}

      <Button title="Back to Sign In" variant="outline" onPress={onBack} disabled={loading} />
    </View>
  );
}
