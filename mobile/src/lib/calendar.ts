import { addDays, format, parseISO } from 'date-fns';

import type { Doc } from '@convex/_generated/dataModel';

export type CalendarEvent = {
  id: string;
  title: string;
  subtitle: string;
  /** Local calendar day, `yyyy-MM-dd`. */
  dateKey: string;
  source: 'assignment' | 'freelance';
  status: string;
  location?: string;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}/;

function toKey(value?: string): string | null {
  if (!value || !DATE_RE.test(value)) return null;
  if (value.length === 10) return value;
  // Full timestamps (e.g. captureDate from toISOString) are UTC: convert to the local calendar day, not the UTC slice.
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : format(d, 'yyyy-MM-dd');
}

/** One event per shoot day: assignments use their photographer days (falling back to start/capture date), freelance jobs their dates. */
export function buildCalendarEvents(
  assignments: Doc<'assignments'>[],
  freelanceJobs: Doc<'freelanceAssignments'>[],
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  assignments.forEach((a) => {
    const days = (a.photographerDays?.length ? a.photographerDays : [a.eventStartDate || a.captureDate])
      .map(toKey)
      .filter((d): d is string => !!d);
    new Set(days).forEach((dateKey) =>
      events.push({
        id: a._id,
        title: a.clientName || a.title || 'Client Session',
        subtitle: a.title || 'Photography Session',
        dateKey,
        source: 'assignment',
        status: a.status,
        location: a.venue || a.location,
      }),
    );
  });

  freelanceJobs.forEach((j) => {
    new Set(j.dates.map(toKey).filter((d): d is string => !!d)).forEach((dateKey) =>
      events.push({
        id: j._id,
        title: j.studioName,
        subtitle: 'Freelance job',
        dateKey,
        source: 'freelance',
        status: j.status,
        location: j.venue || j.location,
      }),
    );
  });

  return events;
}

export function groupByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  events.forEach((e) => map.set(e.dateKey, [...(map.get(e.dateKey) ?? []), e]));
  return map;
}

/** Days with two or more distinct, not-yet-completed bookings. */
export function findClashes(byDay: Map<string, CalendarEvent[]>): Set<string> {
  const clashes = new Set<string>();
  byDay.forEach((list, day) => {
    const active = new Set(list.filter((e) => e.status !== 'Completed').map((e) => e.id));
    if (active.size > 1) clashes.add(day);
  });
  return clashes;
}

/** Google Calendar "create event" link; opens the Calendar app or browser with the event prefilled (no sign-in needed here). */
export function googleCalendarUrl(event: CalendarEvent): string {
  const day = parseISO(event.dateKey);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} — ${event.subtitle}`,
    dates: `${format(day, 'yyyyMMdd')}/${format(addDays(day, 1), 'yyyyMMdd')}`,
  });
  if (event.location) params.set('location', event.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
