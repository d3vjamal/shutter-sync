import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BarChart } from '@/components/ui/bar-chart';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useAssignments } from '@/hooks/use-assignments';
import { useAuth } from '@/hooks/use-auth';
import { useFreelanceAssignments } from '@/hooks/use-freelance-assignments';
import { useMoney } from '@/hooks/use-money';
import { useGradients, useTheme } from '@/hooks/use-theme';
import { busiestMonths, monthlyTrend, topClients } from '@/lib/insights';
import { toAssignmentCard, toFreelanceCard } from '@/lib/revenue';

/** Monthly revenue trend, top clients and busiest months. */
export function InsightsBody({ refreshing, onRefresh }: { refreshing?: boolean; onRefresh?: () => void } = {}) {
  const theme = useTheme();
  const { money } = useMoney();
  const gradients = useGradients();
  const { user } = useAuth();
  const { assignments } = useAssignments(user);
  const { freelanceJobs } = useFreelanceAssignments(user);

  const items = useMemo(
    () => [...assignments.map(toAssignmentCard), ...freelanceJobs.map(toFreelanceCard)],
    [assignments, freelanceJobs],
  );
  const trend = useMemo(() => monthlyTrend(items, 6), [items]);
  const clients = useMemo(() => topClients(items), [items]);
  const busy = useMemo(() => busiestMonths(items), [items]);

  const current = trend[trend.length - 1];
  const previous = trend[trend.length - 2];
  const delta = previous && previous.collected > 0 ? ((current.collected - previous.collected) / previous.collected) * 100 : null;
  const avgBooking = items.length ? items.reduce((s, i) => s + i.total, 0) / items.length : 0;
  const up = (delta ?? 0) >= 0;
  const card = [styles.card, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }];

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={theme.primary} colors={[theme.primary]} />
        ) : undefined
      }>
      <View style={styles.row}>
        <View style={[card, { flex: 1 }]}>
          <ThemedText type="small" themeColor="textSecondary">
            This month
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.success }}>
            {money(current.collected)}
          </ThemedText>
          {delta !== null && (
            <View style={styles.delta}>
              {up ? <TrendingUp size={14} color={theme.success} /> : <TrendingDown size={14} color={theme.destructive} />}
              <ThemedText type="small" style={{ color: up ? theme.success : theme.destructive }}>
                {Math.abs(Math.round(delta))}% vs last month
              </ThemedText>
            </View>
          )}
        </View>
        <View style={[card, { flex: 1 }]}>
          <ThemedText type="small" themeColor="textSecondary">
            Avg. booking
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.accent }}>
            {money(Math.round(avgBooking))}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {items.length} bookings
          </ThemedText>
        </View>
      </View>

      <View style={card}>
        <ThemedText type="smallBold" style={{ marginBottom: Spacing.two }}>
          Collected · last 6 months
        </ThemedText>
        <BarChart data={trend} colors={gradients.primary} />
      </View>

      <View style={card}>
        <ThemedText type="smallBold">Top clients</ThemedText>
        {clients.length === 0 && (
          <ThemedText type="small" themeColor="textSecondary">
            No bookings yet.
          </ThemedText>
        )}
        {clients.map((c, i) => (
          <View key={c.name} style={styles.listRow}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={{ width: 20 }}>
              {i + 1}
            </ThemedText>
            <View style={{ flex: 1 }}>
              <ThemedText type="smallBold" numberOfLines={1}>
                {c.name}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {c.bookings} {c.bookings === 1 ? 'booking' : 'bookings'}
              </ThemedText>
            </View>
            <ThemedText type="smallBold">{money(c.total)}</ThemedText>
          </View>
        ))}
      </View>

      <View style={card}>
        <ThemedText type="smallBold">Busiest months</ThemedText>
        {busy.length === 0 && (
          <ThemedText type="small" themeColor="textSecondary">
            No bookings yet.
          </ThemedText>
        )}
        {busy.map((m) => (
          <View key={m.label} style={styles.listRow}>
            <ThemedText type="smallBold" style={{ flex: 1 }}>
              {m.label}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {m.bookings} {m.bookings === 1 ? 'booking' : 'bookings'} · {money(m.total)}
            </ThemedText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.three, paddingBottom: 120, gap: Spacing.three },
  row: { flexDirection: 'row', gap: Spacing.three },
  card: { borderRadius: Radius, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: 4 },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.two },
});
