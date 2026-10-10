import { WEB_URL } from '@/config/env';

type LinkUser = { _id: string; username?: string | null };

/** Same URL scheme as the web app: /photographer/<username or id>. Null until WEB_URL is configured. */
export function publicProfileUrl(user: LinkUser): string | null {
  if (!WEB_URL) return null;
  return `${WEB_URL}/photographer/${user.username || user._id}`;
}
