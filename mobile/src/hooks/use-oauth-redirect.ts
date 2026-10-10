import { useAuthActions } from '@convex-dev/auth/react';
import { useEffect, useRef } from 'react';
import { Linking } from 'react-native';

export const OAUTH_REDIRECT_URL = 'shuttersync://auth-callback';

/**
 * Bare-RN OAuth completion: Convex Auth's `signIn(provider, {redirectTo})`
 * returns a `redirect` URL to open in the system browser (see the
 * `ConvexAuthActionsContext` type in @convex-dev/auth/react). Once the
 * provider finishes, it redirects back to `redirectTo` with a `code` query
 * param, which this app receives as a deep link — completed here by calling
 * `signIn(undefined, {code})` (no provider — that is what makes Convex Auth
 * verify the code instead of starting a new OAuth flow).
 *
 * The code is read with a regex because React Native's `URL.searchParams`
 * throws "not implemented".
 */
export function useOAuthRedirect() {
  const { signIn } = useAuthActions();
  const handledCodes = useRef(new Set<string>());

  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      if (!url.startsWith(OAUTH_REDIRECT_URL)) return;
      const match = url.match(/[?&]code=([^&#]+)/);
      if (!match) return;
      const code = decodeURIComponent(match[1]);
      // getInitialURL and the 'url' event can both deliver the same link.
      if (handledCodes.current.has(code)) return;
      handledCodes.current.add(code);
      try {
        // The typings require a provider string, but verifying a code takes none.
        await signIn(undefined as unknown as string, { code });
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
