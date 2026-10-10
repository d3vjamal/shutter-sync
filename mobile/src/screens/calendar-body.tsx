import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { AlertTriangle, CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useAssignments } from '@/hooks/use-assignments';
import { useAuth } from '@/hooks/use-auth';
import { useFreelanceAssignments } from '@/hooks/use-freelance-assignments';
import { useTheme } from '@/hooks/use-theme';
import { buildCalendarEvents, findClashes, googleCalendarUrl, groupByDay } from '@/lib/calendar';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Month grid of all shoot days, with clash warnings and an "add to Google Calendar" action per booking. */
export function CalendarBody() {
  const theme = useTheme();
  const { user } = useAuth();
  const { assignments } = useAssignments(user);
  const { freelanceJobs } = useFreelanceAssignments(user);

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState(() => format(new Date(), 'yyyy-MM-dd'));

  const byDay = useMemo(() => groupByDay(buildCalendarEvents(assignments, freelanceJobs)), [assignments, freelanceJobs]);
  const clashes = useMemo(() => findClashes(byDay), [byDay]);

  const days = eachDayOfInterval({ start: startOfWeek(month), end: endOfWeek(endOfMonth(month)) });
  const monthClashes = [...clashes].filter((d) => d.startsWith(format(month, 'yyyy-MM'))).sort();
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const dayEvents = byDay.get(selected) ?? [];

  const addToGoogle = (url: string) =>
    Linking.openURL(url).catch(() => Toast.show({ type: 'error', text1: "Couldn't open Google Calendar" }));

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.card, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.monthRow}>
          <Pressable onPress={() => setMonth(addMonths(month, -1))} hitSlop={10} accessibilityLabel="Previous month">
            <ChevronLeft size={22} color={theme.text} />
          </Pressable>
          <ThemedText type="smallBold">{format(month, 'MMMM yyyy')}</ThemedText>
          <Pressable onPress={() => setMonth(addMonths(month, 1))} hitSlop={10} accessibilityLabel="Next month">
            <ChevronRight size={22} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.week}>
          {WEEKDAYS.map((d, i) => (
            <ThemedText key={i} type="small" themeColor="textSecondary" style={styles.weekday}>
              {d}
            </ThemedText>
          ))}
        </View>

        <View style={styles.grid}>
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const inMonth = isSameMonth(day, month);
            const count = inMonth ? (byDay.get(key)?.length ?? 0) : 0;
            const isSelected = key === selected;
            const clash = clashes.has(key);
            return (
              <Pressable key={key} style={styles.cell} onPress={() => setSelected(key)}>
                <View
                  style={[
                    styles.day,
                    isSelected && { backgroundColor: theme.primary },
                    !isSelected && key === todayKey && { borderColor: theme.primary, borderWidth: 1 },
                  ]}>
                  <ThemedText
                    type="small"
                    style={{
                      color: isSelected ? theme.onPrimary : inMonth ? theme.text : theme.textSecondary + '66',
                      fontWeight: count ? '700' : '400',
                    }}>
                    {format(day, 'd')}
                  </ThemedText>
                  {count > 0 ? (
                    <ThemedText
                      style={[
                        styles.mark,
                        { color: clash ? theme.destructive : isSelected ? theme.onPrimary : theme.accent },
                      ]}>
                      B
                    </ThemedText>
                  ) : (
                    <View style={styles.markSpace} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {monthClashes.length > 0 && (
        <View style={[styles.warning, { backgroundColor: theme.destructive + '1A', borderColor: theme.destructive + '55' }]}>
          <AlertTriangle size={18} color={theme.destructive} />
          <View style={{ flex: 1 }}>
            <ThemedText type="smallBold" style={{ color: theme.destructive }}>
              {monthClashes.length} double-booked {monthClashes.length === 1 ? 'day' : 'days'}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {monthClashes.map((d) => format(new Date(`${d}T00:00:00`), 'd MMM')).join(', ')}
            </ThemedText>
          </View>
        </View>
      )}

      <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
        {format(new Date(`${selected}T00:00:00`), 'EEEE, d MMMM')}
      </ThemedText>

      {clashes.has(selected) && (
        <ThemedText type="small" style={{ color: theme.destructive }}>
          Heads up: more than one booking on this day.
        </ThemedText>
      )}

      {dayEvents.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary">
          No bookings on this day.
        </ThemedText>
      ) : (
        dayEvents.map((event) => (
          <View
            key={`${event.id}-${event.dateKey}`}
            style={[styles.event, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText type="smallBold" numberOfLines={1}>
                {event.title}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                {event.subtitle}
                {event.location ? ` · ${event.location}` : ''}
              </ThemedText>
              <ThemedText type="small" style={{ color: event.status === 'Completed' ? theme.success : theme.accent }}>
                {event.status}
              </ThemedText>
            </View>
            <Pressable
              onPress={() => addToGoogle(googleCalendarUrl(event))}
              style={[styles.addButton, { borderColor: theme.border }]}
              accessibilityLabel="Add to Google Calendar"
              hitSlop={8}>
              <CalendarPlus size={16} color={theme.primary} />
              <ThemedText type="small" style={{ color: theme.primary }}>
                Add
              </ThemedText>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.three, paddingBottom: 120, gap: Spacing.two },
  card: { borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: Spacing.two },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  week: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 2 },
  day: { width: 38, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 2 },
  markSpace: { height: 12 },
  mark: { fontSize: 10, lineHeight: 12, fontWeight: '800' },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius,
    borderWidth: 1,
    padding: Spacing.three,
  },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
});
