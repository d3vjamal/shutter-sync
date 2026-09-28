import { CONVEX_URL as RAW_CONVEX_URL } from '@env';

if (!RAW_CONVEX_URL) {
  throw new Error(
    'CONVEX_URL is not set. Copy mobile/.env.example to mobile/.env and fill in your Convex deployment URL.',
  );
}

export const CONVEX_URL = RAW_CONVEX_URL;
