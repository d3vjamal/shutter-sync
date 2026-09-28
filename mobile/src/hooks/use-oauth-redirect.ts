import { useAuthActions } from '@convex-dev/auth/react';
import { useEffect } from 'react';
import { Linking } from 'react-native';

export const OAUTH_REDIRECT_URL = 'shuttersync://auth-callback';

/**
 * Bare-RN OAuth completion: Convex Auth's `signIn(provider, {redirectTo})`
 * returns a `redirect` URL to open in the system browser (see the
 * `ConvexAuthActionsContext` type in @convex-dev/auth/react). Once the
 * provider finishes, it redirects back to `redirectTo` with a `code` query
 * param, which this app receives as a deep link — completed here by calling
 * `signIn(provider, {code})` again.
 */
export function useOAuthRedirect() {
  const { signIn } = useAuthActions();

  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      if (!url.startsWith(OAUTH_REDIRECT_URL)) return;
      const code = new URL(url).searchParams.get('code');
      if (!code) return;
      try {
        await signIn('google', { code });
      } catch (err) {
        console.error('Failed to complete Google sign-in:', err);
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => subscription.remove();
  }, [signIn]);
}
