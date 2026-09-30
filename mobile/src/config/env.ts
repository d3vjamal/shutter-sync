import { CONVEX_URL as RAW_CONVEX_URL, WEB_URL as RAW_WEB_URL } from '@env';

if (!RAW_CONVEX_URL) {
  throw new Error(
    'CONVEX_URL is not set. Copy mobile/.env.example to mobile/.env and fill in your Convex deployment URL.',
  );
}

export const CONVEX_URL = RAW_CONVEX_URL;

/** Origin of the deployed web app (no trailing slash); public profile and package links are built from it. */
export const WEB_URL = (RAW_WEB_URL || '').trim().replace(/\/+$/, '');
