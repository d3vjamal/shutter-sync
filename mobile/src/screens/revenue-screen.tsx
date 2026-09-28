import { format } from 'date-fns';
import { Download, IndianRupee, TrendingUp } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, Share, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BarChart } from '@/components/ui/bar-chart';
import { FadeIn } from '@/components/ui/fade-in';
import { SkeletonCard, SkeletonStat } from '@/components/ui/skeleton';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useAssignments } from '@/hooks/use-assignments';
import { useAuth } from '@/hooks/use-auth';
import { useFreelanceAssignments } from '@/hooks/use-freelance-assignments';
import { useGradients, useTheme } from '@/hooks/use-theme';
import { generateAndSharePdf } from '@/lib/pdf';
import { buildRevenueReportHtml } from '@/lib/pdf-templates';
import { monthlyCollected, toAssignmentCard, toFreelanceCard, toRevenueCsv, type RevenueItem } from '@/lib/revenue';

/** Revenue totals, chart, booking list and export, embedded in the Business tab. */
export function RevenueBody({
  refreshing,
  onRefresh,
}: {
  refreshing?: boolean;
  onRefresh?: () => void;
} = {}) {
  const theme = useTheme();
  const gradients = useGradients();
  const { user } = useAuth();
  const { assignments, isLoading: assignmentsLoading } = useAssignments(user);
  const { freelanceJobs, isLoading: freelanceLoading } = useFreelanceAssignments(user);
  const isLoading = assignmentsLoading || freelanceLoading;

  const items = useMemo<RevenueItem[]>(() => {
    const all = [...assignments.map(toAssignmentCard), ...freelanceJobs.map(toFreelanceCard)];
    return all.sort((a, b) => {
      const dA = new Date(a.date || a._creationTime).getTime();
      const dB = new Date(b.date || b._creationTime).getTime();
      return dB - dA;
    });
  }, [assignments, freelanceJobs]);

  const totals = useMemo(() => {
    const collected = items.reduce((sum, i) => sum + i.paid, 0);
    const pending = items.reduce((sum, i) => sum + Math.max(0, i.total - i.paid), 0);
    return { collected, pending };
  }, [items]);

  const chartData = useMemo(() => monthlyCollected(items), [items]);
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    Alert.alert('Export Revenue', 'Choose a format', [
      { text: 'Export CSV', onPress: exportCsv },
      { text: 'Export PDF', onPress: exportPdf },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const exportCsv = async () => {
    const csv = toRevenueCsv(items);
    try {
      await Share.share({ message: csv, title: 'Revenue Export' });
    } catch {
      // user dismissed the share sheet
    }
  };

  const exportPdf = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const html = buildRevenueReportHtml(items, user);
      await generateAndSharePdf(html, 'Revenue-Report');
    } catch (err) {
      Alert.alert('PDF failed', err instanceof Error ? err.message : 'Could not generate the revenue report.');
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.list}>
        <View style={[styles.statsRow, { marginBottom: Spacing.three }]}>
          <SkeletonStat />
          <SkeletonStat />
        </View>
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={theme.primary} colors={[theme.primary]} />
        ) : undefined
      }
      ListHeaderComponent={
        <View style={{ gap: Spacing.three, marginBottom: Spacing.three }}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.success + '1F' }]}>
                <TrendingUp size={16} color={theme.success} />
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                Collected
              </ThemedText>
              <ThemedText type="subtitle" style={{ color: theme.success }}>
                ₹{totals.collected.toLocaleString()}
              </ThemedText>
            </View>
            <View style={[styles.statCard, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.accent + '1F' }]}>
                <IndianRupee size={16} color={theme.accent} />
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                Pending
              </ThemedText>
              <ThemedText type="subtitle" style={{ color: theme.accent }}>
                ₹{totals.pending.toLocaleString()}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.chartCard, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.chartHeader}>
              <ThemedText type="smallBold">Last 6 Months</ThemedText>
              <Pressable
                onPress={handleExport}
                style={[styles.exportButton, { borderColor: theme.border }]}
                hitSlop={8}>
                <Download size={14} color={theme.primary} />
                <ThemedText type="small" style={{ color: theme.primary }}>
                  Export
                </ThemedText>
              </Pressable>
            </View>
            <BarChart data={chartData} colors={gradients.primary} />
          </View>

          <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: Spacing.one }}>
            All bookings
          </ThemedText>
        </View>
      }
      renderItem={({ item, index }) => {
        const pending = Math.max(0, item.total - item.paid);
        return (
          <FadeIn index={index}>
            <View style={[styles.row, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={{ flex: 1, gap: 2 }}>
                <ThemedText type="smallBold" numberOfLines={1}>
                  {item.title}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.date ? format(new Date(item.date), 'dd MMM yyyy') : 'Date TBD'} ·{' '}
                  {item.source === 'assignment' ? 'Assignment' : 'Freelance'}
                </ThemedText>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                <ThemedText type="smallBold" style={{ color: theme.success }}>
                  ₹{item.paid.toLocaleString()}
                </ThemedText>
                {pending > 0 && (
                  <ThemedText type="small" style={{ color: theme.accent, fontSize: 12 }}>
                    ₹{pending.toLocaleString()} due
                  </ThemedText>
                )}
              </View>
            </View>
          </FadeIn>
        );
      }}
      ListEmptyComponent={
        <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: Spacing.six }}>
          No bookings yet
        </ThemedText>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.three, paddingBottom: 120 },
  statsRow: { flexDirection: 'row', gap: Spacing.three },
  statCard: { flex: 1, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: 4 },
  statIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  chartCard: { borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.two },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    borderRadius: Radius,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
});
