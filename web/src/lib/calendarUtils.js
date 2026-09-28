/**
 * Calendar utilities — generates ICS files and Google Calendar URLs
 * from ShutterSync assignment objects.
 */

/** "YYYY-MM-DD" → "YYYYMMDD" */
function toICSDate(dateStr) {
  return dateStr.replace(/-/g, "");
}

/** "YYYY-MM-DD" → "YYYY-MM-DD" shifted by `days` (timezone-safe) */
function shiftDate(dateStr, days) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + days); // local calendar arithmetic
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateRange(assignment) {
  const { photographerDays, eventStartDate } = assignment;
  if (photographerDays && photographerDays.length > 0) {
    const sorted = [...photographerDays].sort();
    return { start: sorted[0], end: sorted[sorted.length - 1] };
  }
  if (eventStartDate) {
    return { start: eventStartDate, end: eventStartDate };
  }
  return null;
}

/**
 * Returns a .ics file string for the assignment, or null if no dates set.
 */
export function buildICS(assignment) {
  const range = getDateRange(assignment);
  if (!range) return null;

  const { title, clientName, location, venue, description } = assignment;
  const locationStr = [venue, location].filter(Boolean).join(", ");
  const descStr = [`Client: ${clientName}`, description ? `Notes: ${description}` : null]
    .filter(Boolean)
    .join("\\n");

  const dtStart = toICSDate(range.start);
  // ICS all-day DTEND is exclusive — add one day past the last day
  const dtEnd = toICSDate(shiftDate(range.end, 1));
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}@shuttersync`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ShutterSync//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${descStr}`,
    locationStr ? `LOCATION:${locationStr}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter((l) => l !== null)
    .join("\r\n");

  return lines;
}

/**
 * Triggers a browser download of an .ics file for the assignment.
 */
export function downloadICS(assignment) {
  const ics = buildICS(assignment);
  if (!ics) return false;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${assignment.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Returns a pre-filled Google Calendar "new event" URL, or null if no dates.
 */
export function getGoogleCalendarUrl(assignment) {
  const range = getDateRange(assignment);
  if (!range) return null;

  const { title, clientName, location, venue, description } = assignment;
  const locationStr = [venue, location].filter(Boolean).join(", ");
  const detailsStr = [
    `Client: ${clientName}`,
    description ? `Notes: ${description}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const dtStart = toICSDate(range.start);
  const dtEnd = toICSDate(shiftDate(range.end, 1));

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${dtStart}/${dtEnd}`,
    details: detailsStr,
  });
  if (locationStr) params.set("location", locationStr);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
