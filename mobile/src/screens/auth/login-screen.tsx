import { useAuthActions } from '@convex-dev/auth/react';
import { useMutation, useConvex } from 'convex/react';
import { AlertCircle } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandLogo } from '@/components/ui/brand-logo';
import { FadeIn } from '@/components/ui/fade-in';
import { Gradient } from '@/components/ui/gradient';
import { GoogleIcon } from '@/components/ui/google-icon';
import { Segmented } from '@/components/ui/segmented';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { OAUTH_REDIRECT_URL } from '@/hooks/use-oauth-redirect';
import { useGradients, useTheme } from '@/hooks/use-theme';
import { isValidEmail, isValidPhone } from '@/lib/validation';
import { api } from '@convex/_generated/api';

const numberOnly = (value: string) => /^[0-9]*$/.test(value);
const textOnly = (value: string) => /^[a-zA-Z\s]*$/.test(value);

export function LoginScreen() {
  const theme = useTheme();
  const gradients = useGradients();
  const { signIn } = useAuthActions();
  const convex = useConvex();
  const updateUserProfile = useMutation(api.users.updateUserProfile);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fail = (message: string) => {
    setError(message);
    Toast.show({ type: 'error', text1: message });
  };

  const handleSubmit = async () => {
    setError('');

    if (!email || !password) {
      fail('Please fill in all required fields.');
      return;
    }
    if (!isValidEmail(email)) {
      fail('Enter a valid email address.');
      return;
    }
    if (!isLogin && (!name || !contact)) {
      fail('Please fill in all required fields for registration.');
      return;
    }
    if (password.length < 8) {
      fail('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      fail('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[0-9]/.test(password)) {
      fail('Password must contain at least one number');
      return;
    }
    if (!isLogin && !isValidPhone(contact)) {
      fail('Contact number must be exactly 10 digits');
      return;
    }

    setLoading(true);
    try {
      if (!isLogin) {
        const exists = await convex.query(api.users.emailExists, { email });
        if (exists) {
          fail('This email is already registered. Please sign in instead.');
          setLoading(false);
          return;
        }
      }

      if (isLogin) {
        await signIn('password', { email, password, flow: 'signIn' });
      } else {
        await signIn('password', { email, password, flow: 'signUp', name });
        await updateUserProfile({ contact });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('Invalid email')) {
        fail('Invalid email address.');
      } else if (message.includes('password')) {
        fail('Invalid password. Please try again.');
      } else if (message.includes('email')) {
        fail('Email not found. Please check or register a new account.');
      } else if (message.includes('already exists')) {
        fail('This email is already registered. Please log in instead.');
      } else {
        fail('Authentication failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { redirect } = await signIn('google', { redirectTo: OAUTH_REDIRECT_URL });
      if (redirect) {
        await Linking.openURL(redirect.toString());
      }
    } catch (err) {
      console.error('Google login error:', err);
      fail('Google login failed. Please try again or use email/password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Gradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={StyleSheet.absoluteFill}>
        <View style={[styles.blob, { top: -80, right: -70, backgroundColor: theme.primary + '33' }]} />
        <View style={[styles.blob, { bottom: 60, left: -110, width: 260, height: 260, borderRadius: 130, backgroundColor: theme.accent + '22' }]} />
      </Gradient>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <FadeIn style={styles.header}>
            <BrandLogo size={84} animated />
            <ThemedText type="title" style={styles.brand}>
              ShutterSync
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Smart photography, simplified
            </ThemedText>
          </FadeIn>

          <FadeIn delay={120}>
            <Segmented
              options={[
                { key: 'in', label: 'Sign In' },
                { key: 'up', label: 'Register' },
              ]}
              value={isLogin ? 'in' : 'up'}
              onChange={(k) => setIsLogin(k === 'in')}
            />
          </FadeIn>

          <FadeIn delay={220} style={[styles.form, styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {!isLogin && (
              <View style={styles.field}>
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChangeText={(value) => textOnly(value) && setName(value)}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.field}>
              <Label>Email</Label>
              <Input
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Label>Password</Label>
              <Input
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {!isLogin && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                  Min 8 chars, 1 uppercase, 1 number
                </ThemedText>
              )}
            </View>

            {!isLogin && (
              <View style={styles.field}>
                <Label>Contact</Label>
                <Input
                  placeholder="Enter mobile"
                  value={contact}
                  onChangeText={(value) => numberOnly(value) && setContact(value)}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
            )}

            {!!error && (
              <View style={[styles.errorBox, { backgroundColor: theme.destructive + '1A' }]}>
                <AlertCircle size={14} color={theme.destructive} />
                <ThemedText type="small" style={{ color: theme.destructive, flex: 1 }}>
                  {error}
                </ThemedText>
              </View>
            )}

            <Button
              title={isLogin ? 'Sign In' : 'Get Started'}
              onPress={handleSubmit}
              loading={loading}
            />

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <ThemedText type="small" themeColor="textSecondary">
                or continue with
              </ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <Button
              title="Continue with Google"
              variant="outline"
              icon={<GoogleIcon size={18} />}
              onPress={handleGoogleLogin}
              disabled={loading}
            />
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.four,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.five,
  },
  logo: {
    width: 72,
    height: 69,
    marginBottom: Spacing.two,
  },
  brand: {
    fontSize: 28,
    lineHeight: 32,
  },
  tabRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 8,
    alignItems: 'center',
  },
  form: {
    gap: Spacing.three,
  },
  formCard: {
    padding: Spacing.four,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#0B1B4D',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  blob: { position: 'absolute', width: 220, height: 220, borderRadius: 110 },
  field: {
    gap: Spacing.one,
  },
  hint: {
    fontSize: 10,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
});
