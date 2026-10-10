export type SocialKey = 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'website';

export const SOCIAL_PLATFORMS: { key: SocialKey; label: string; color: string; glyph?: string }[] = [
  { key: 'instagram', label: 'Instagram', color: '#E1306C', glyph: 'IG' },
  { key: 'facebook', label: 'Facebook', color: '#1877F2', glyph: 'f' },
  { key: 'twitter', label: 'X', color: '#111111', glyph: 'X' },
  { key: 'youtube', label: 'YouTube', color: '#FF0000', glyph: '▶' },
  { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', glyph: 'in' },
  { key: 'website', label: 'Website', color: '#0F766E' },
];

/** "https://instagram.com/@jane/" → "jane": accepts pasted links as well as bare handles. */
function toHandle(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/^(instagram\.com|facebook\.com|twitter\.com|x\.com|youtube\.com|linkedin\.com\/in)\//i, '')
    .replace(/^@/, '')
    .replace(/[/?#].*$/, '')
    .replace(/\s/g, '');
}

/** Full profile URL for a stored handle/website, or null when the user hasn't added one. */
export function socialUrl(key: SocialKey, value?: string | null): string | null {
  const raw = (value ?? '').trim();
  if (!raw) return null;
  if (key === 'website') return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  const handle = toHandle(raw);
  if (!handle) return null;
  switch (key) {
    case 'instagram':
      return `https://instagram.com/${handle}`;
    case 'facebook':
      return `https://facebook.com/${handle}`;
    case 'twitter':
      return `https://x.com/${handle}`;
    case 'youtube':
      return `https://youtube.com/@${handle}`;
    case 'linkedin':
      return `https://linkedin.com/in/${handle}`;
  }
}
