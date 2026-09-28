import * as Keychain from 'react-native-keychain';

/**
 * Storage adapter for ConvexAuthProvider's `storage` prop, backed by the
 * native Keychain (iOS) / Keystore (Android) via react-native-keychain —
 * the bare-RN equivalent of the expo-secure-store adapter Convex's own
 * docs use. Convex Auth calls getItem/setItem/removeItem with its own
 * key names (e.g. one for the JWT, one for the refresh token), so each
 * key is stored under its own Keychain "service".
 */
export const keychainStorage = {
  async getItem(key: string): Promise<string | null> {
    const result = await Keychain.getGenericPassword({ service: key });
    return result ? result.password : null;
  },
  async setItem(key: string, value: string): Promise<void> {
    await Keychain.setGenericPassword(key, value, { service: key });
  },
  async removeItem(key: string): Promise<void> {
    await Keychain.resetGenericPassword({ service: key });
  },
};
