import type { Doc } from '@convex/_generated/dataModel';

export type RevenueItem = {
  id: string;
  title: string;
  subtitle: string;
  date?: string;
  location?: string;
  total: number;
  paid: number;
  status: string;
  _creationTime: number;
  source: 'assignment' | 'freelance';
  raw: Doc<'assignments'> | Doc<'freelanceAssignments'>;
};

export function toAssignmentCard(a: Doc<'assignments'>): RevenueItem {
  return {
    id: a._id,
    title: a.clientName || a.title || 'Client Session',
    subtitle: a.title || 'Photography Session',
    date: a.eventStartDate || a.captureDate,
    location: a.location,
    total: Number(a.amount || 0),
    paid: Number(a.paidAmount || 0),
    status: a.status,
    _creationTime: a._creationTime,
    source: 'assignment',
    raw: a,
  };
}

export function toFreelanceCard(j: Doc<'freelanceAssignments'>): RevenueItem {
  const total =
    Number(j.photographyAmount || 0) + (j.hasVideography ? Number(j.videographyAmount || 0) : 0);
  const paid =
    Number(j.photographyReceived || 0) + (j.hasVideography ? Number(j.videographyReceived || 0) : 0);
  return {
    id: j._id,
    title: j.studioName,
    subtitle: j.studioOwnerName,
    date: j.dates?.[0],
    location: j.location || j.venue,
    total,
    paid,
    status: j.status,
    _creationTime: j._creationTime,
    source: 'freelance',
    raw: j,
  };
}

export type MonthlyRevenue = { label: string; collected: number };

/** Collected amount per month for the last `months` months (oldest first), keyed off each item's date. */
export function monthlyCollected(items: RevenueItem[], months = 6): MonthlyRevenue[] {
  const now = new Date();
  const buckets: MonthlyRevenue[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ label: d.toLocaleDateString('en-US', { month: 'short' }), collected: 0 });
  }
  const startKey = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1).getTime();

  items.forEach((item) => {
    const raw = item.date ? new Date(item.date) : new Date(item._creationTime);
    if (Number.isNaN(raw.getTime())) return;
    const monthStart = new Date(raw.getFullYear(), raw.getMonth(), 1).getTime();
    if (monthStart < startKey) return;
    const index = months - 1 - (now.getMonth() - raw.getMonth() + 12 * (now.getFullYear() - raw.getFullYear()));
    if (index >= 0 && index < months) buckets[index].collected += item.paid;
  });

  return buckets;
}

/** Builds a CSV string: Client, Type, Date, Total, Collected, Pending, Status. */
export function toRevenueCsv(items: RevenueItem[]): string {
  const header = ['Client', 'Type', 'Date', 'Total', 'Collected', 'Pending', 'Status'];
  const rows = items.map((item) => [
    item.title,
    item.source === 'assignment' ? 'Assignment' : 'Freelance',
    item.date ? new Date(item.date).toISOString().slice(0, 10) : '',
    item.total.toFixed(2),
    item.paid.toFixed(2),
    Math.max(0, item.total - item.paid).toFixed(2),
    item.status,
  ]);
  const escape = (cell: string) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell);
  return [header, ...rows].map((row) => row.map((c) => escape(String(c))).join(',')).join('\n');
}
