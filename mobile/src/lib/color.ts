/** Small hex-colour helpers used to derive a full theme from a user-picked primary/secondary. */

const HEX = /^#?([0-9a-f]{6})$/i;

export function normalizeHex(input: string): string | null {
  const m = HEX.exec(input.trim());
  return m ? `#${m[1].toUpperCase()}` : null;
}

function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

/** Blend `hex` toward `target` by `amount` (0–1). */
export function mix(hex: string, target: string, amount: number): string {
  const a = toRgb(hex);
  const b = toRgb(target);
  return toHex([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * amount) as [number, number, number]);
}

export const lighten = (hex: string, amount: number) => mix(hex, '#FFFFFF', amount);
export const darken = (hex: string, amount: number) => mix(hex, '#000000', amount);

/** WCAG relative luminance, 0 (black) – 1 (white). */
export function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Pull a colour into [min, max] luminance so it stays legible on the current surface. */
export function clampLuminance(hex: string, min: number, max: number): string {
  let out = hex;
  for (let i = 0; i < 20 && luminance(out) > max; i++) out = darken(out, 0.08);
  for (let i = 0; i < 20 && luminance(out) < min; i++) out = lighten(out, 0.08);
  return out;
}

/** Black or white, whichever reads better on `hex`. */
export function readableOn(hex: string): string {
  return luminance(hex) > 0.6 ? '#141925' : '#FFFFFF';
}
