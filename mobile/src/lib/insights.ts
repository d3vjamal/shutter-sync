import { format } from 'date-fns';

import type { RevenueItem } from '@/lib/revenue';

function itemDate(item: RevenueItem): Date | null {
  const d = new Date(item.date || item._creationTime);
  return Number.isNaN(d.getTime()) ? null : d;
}

export type MonthPoint = { label: string; collected: number; booked: number };

/** Booked value and collected cash per month for the last `months` months (oldest first). */
export function monthlyTrend(items: RevenueItem[], months = 6): MonthPoint[] {
  const now = new Date();
  const points = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return { key: format(d, 'yyyy-MM'), label: format(d, 'MMM'), collected: 0, booked: 0 };
  });
  items.forEach((item) => {
    const d = itemDate(item);
    const point = d && points.find((p) => p.key === format(d, 'yyyy-MM'));
    if (point) {
      point.collected += item.paid;
      point.booked += item.total;
    }
  });
  return points.map(({ label, collected, booked }) => ({ label, collected, booked }));
}

export type TopClient = { name: string; bookings: number; total: number; paid: number };

export function topClients(items: RevenueItem[], limit = 5): TopClient[] {
  const map = new Map<string, TopClient>();
  items.forEach((item) => {
    const key = item.title.trim().toLowerCase();
    const entry = map.get(key) ?? { name: item.title.trim(), bookings: 0, total: 0, paid: 0 };
    entry.bookings += 1;
    entry.total += item.total;
    entry.paid += item.paid;
    map.set(key, entry);
  });
  return [...map.values()].sort((a, b) => b.total - a.total).slice(0, limit);
}

export type BusyMonth = { label: string; bookings: number; total: number };

export function busiestMonths(items: RevenueItem[], limit = 3): BusyMonth[] {
  const map = new Map<string, BusyMonth & { ts: number }>();
  items.forEach((item) => {
    const d = itemDate(item);
    if (!d) return;
    const key = format(d, 'yyyy-MM');
    const entry = map.get(key) ?? { label: format(d, 'MMMM yyyy'), bookings: 0, total: 0, ts: d.getTime() };
    entry.bookings += 1;
    entry.total += item.total;
    map.set(key, entry);
  });
  return [...map.values()].sort((a, b) => b.bookings - a.bookings || b.ts - a.ts).slice(0, limit);
}
