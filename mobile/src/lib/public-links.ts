import { WEB_URL } from '@/config/env';

type LinkUser = { _id: string; username?: string | null };

/** Same URL scheme as the web app: /photographer/<username or id>. Null until WEB_URL is configured. */
export function publicProfileUrl(user: LinkUser): string | null {
  if (!WEB_URL) return null;
  return `${WEB_URL}/photographer/${user.username || user._id}`;
}

/** The packages section of the public profile page (`id="packages"` on the web). */
export function publicPackagesUrl(user: LinkUser): string | null {
  const base = publicProfileUrl(user);
  return base ? `${base}#packages` : null;
}
