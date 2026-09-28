import { format, isFuture, isSameMonth } from 'date-fns';

export type SectionKey = 'ongoing' | 'upcoming' | 'past';

export function groupByStatusAndMonth<T extends { status: string; _creationTime: number }>(
  items: T[],
  getDate: (item: T) => string | undefined,
): Record<SectionKey, Record<string, T[]>> {
  const categorized: Record<SectionKey, Record<string, T[]>> = {
    ongoing: {},
    upcoming: {},
    past: {},
  };

  const sorted = [...items].sort((a, b) => {
    const dA = new Date(getDate(a) || a._creationTime).getTime();
    const dB = new Date(getDate(b) || b._creationTime).getTime();
    return dB - dA;
  });

  sorted.forEach((item) => {
    const dStr = getDate(item);
    const d = dStr ? new Date(dStr) : null;
    const monthKey = d ? format(d, 'MMMM yyyy') : 'Date TBD';

    let sectionKey: SectionKey = 'ongoing';
    if (item.status === 'Completed') {
      sectionKey = 'past';
    } else if (d && isFuture(d) && !isSameMonth(d, new Date())) {
      sectionKey = 'upcoming';
    }

    if (!categorized[sectionKey][monthKey]) categorized[sectionKey][monthKey] = [];
    categorized[sectionKey][monthKey].push(item);
  });

  return categorized;
}
