/** Digits-only international number; bare 10-digit numbers are assumed Indian (+91). */
export function normalizePhone(contact?: string): string | null {
  const digits = (contact ?? '').replace(/\D/g, '').replace(/^0+/, '');
  if (digits.length === 10) return `91${digits}`;
  return digits.length >= 11 ? digits : null;
}

export function buildReminderMessage({
  clientName,
  total,
  paid,
  senderName,
}: {
  clientName: string;
  total: number;
  paid: number;
  senderName?: string;
}): string {
  const balance = Math.max(0, total - paid);
  return [
    `Hello ${clientName},`,
    '',
    `This is a gentle reminder about the pending balance for our photography booking.`,
    `Total: ₹${total.toLocaleString()}`,
    `Received: ₹${paid.toLocaleString()}`,
    `Balance due: ₹${balance.toLocaleString()}`,
    '',
    'Kindly arrange the payment at your earliest convenience. Thank you!',
    senderName ? `— ${senderName}` : '',
  ]
    .join('\n')
    .trim();
}

export function whatsappUrl(contact: string | undefined, message: string): string | null {
  const phone = normalizePhone(contact);
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : null;
}
