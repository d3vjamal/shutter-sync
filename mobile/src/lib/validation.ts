/** Shared field validators + messages, used across forms for inline errors and toasts. */

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidUpiId(value: string): boolean {
  return /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/.test(value.trim());
}

export function isValidAmount(value: string): boolean {
  if (!isNonEmpty(value)) return false;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0;
}
