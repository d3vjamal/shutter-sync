import { format } from 'date-fns';
import { Download, IndianRupee, Lock, MessageCircle, TrendingUp } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Linking, Pressable, RefreshControl, Share, StyleSheet, View } from 'react-native';

import { PaymentsModal } from '@/components/payments-modal';
import { ThemedText } from '@/components/themed-text';
import { BarChart } from '@/components/ui/bar-chart';
import { FadeIn } from '@/components/ui/fade-in';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SkeletonCard, SkeletonStat } from '@/components/ui/skeleton';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useAssignments } from '@/hooks/use-assignments';
import { useAuth } from '@/hooks/use-auth';
import { useFreelanceAssignments } from '@/hooks/use-freelance-assignments';
import { useMoney } from '@/hooks/use-money';
import { useGradients, useTheme } from '@/hooks/use-theme';
import { generateAndSharePdf, notifyPdfDisabled, withInlinedLogo } from '@/lib/pdf';
import { buildRevenueReportHtml } from '@/lib/pdf-templates';
import { buildReminderMessage, whatsappUrl } from '@/lib/payment-reminder';
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
  const { money } = useMoney();
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
  const [paymentsFor, setPaymentsFor] = useState<RevenueItem | null>(null);

  const sendReminder = (item: RevenueItem) => {
    const url = whatsappUrl(
      item.contact,
      buildReminderMessage({ clientName: item.title, total: item.total, paid: item.paid, senderName: user?.name }),
    );
    if (!url) {
      Alert.alert('No phone number', 'Add a contact number to this booking to send a WhatsApp reminder.');
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert('WhatsApp unavailable', 'Could not open WhatsApp on this device.'));
  };

  // Admin can revoke PDF export per user (canExportPdf === false)
  const canExportPdf = user?.canExportPdf !== false;

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
      const html = buildRevenueReportHtml(items, user ? await withInlinedLogo(user) : user);
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
    <>
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
                {money(totals.collected)}
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
                {money(totals.pending)}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.chartCard, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.chartHeader}>
              <ThemedText type="smallBold">Last 6 Months</ThemedText>
              <View style={styles.exportRow}>
                <Pressable onPress={exportCsv} style={[styles.exportButton, { borderColor: theme.border }]} hitSlop={8}>
                  <Download size={14} color={theme.primary} />
                  <ThemedText type="small" style={{ color: theme.primary }}>
                    CSV
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={canExportPdf ? exportPdf : notifyPdfDisabled}
                  disabled={exporting}
                  accessibilityState={{ disabled: !canExportPdf }}
                  accessibilityHint={canExportPdf ? undefined : 'PDF export is turned off by your admin'}
                  style={[styles.exportButton, { borderColor: theme.border }, !canExportPdf && styles.dimmed]}
                  hitSlop={8}>
                  {canExportPdf ? <Download size={14} color={theme.primary} /> : <Lock size={14} color={theme.primary} />}
                  <ThemedText type="small" style={{ color: theme.primary }}>
                    PDF
                  </ThemedText>
                </Pressable>
              </View>
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
        const pct = item.total > 0 ? Math.min(100, Math.round((item.paid / item.total) * 100)) : 0;
        return (
          <FadeIn index={index}>
            <Pressable
              onPress={() => setPaymentsFor(item)}
              accessibilityHint="Opens payment history"
              style={[styles.row, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.rowTop}>
                <View style={{ flex: 1, gap: 2 }}>
                  <ThemedText type="smallBold" numberOfLines={1}>
                    {item.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.date ? format(new Date(item.date), 'dd MMM yyyy') : 'Date TBD'} ·{' '}
                    {item.source === 'assignment' ? 'Assignment' : 'Freelance'}
                  </ThemedText>
                </View>
                <ThemedText type="small" style={{ color: pending > 0 ? theme.accent : theme.success }}>
                  {pending > 0 ? `${pct}% paid` : 'Fully paid'}
                </ThemedText>
              </View>
              <ProgressBar value={pct} />
              <View style={styles.rowAmounts}>
                <View>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.amountLabel}>
                    Total
                  </ThemedText>
                  <ThemedText type="smallBold">{money(item.total)}</ThemedText>
                </View>
                <View>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.amountLabel}>
                    Received
                  </ThemedText>
                  <ThemedText type="smallBold" style={{ color: theme.success }}>
                    {money(item.paid)}
                  </ThemedText>
                </View>
                <View>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.amountLabel}>
                    Balance
                  </ThemedText>
                  <ThemedText type="smallBold" style={{ color: pending > 0 ? theme.accent : theme.textSecondary }}>
                    {money(pending)}
                  </ThemedText>
                </View>
                {pending > 0 && (
                  <Pressable
                    onPress={() => sendReminder(item)}
                    accessibilityLabel={`Send WhatsApp payment reminder to ${item.title}`}
                    style={[styles.remind, { backgroundColor: theme.success + '1F' }]}
                    hitSlop={6}>
                    <MessageCircle size={14} color={theme.success} />
                    <ThemedText type="small" style={{ color: theme.success }}>
                      Remind
                    </ThemedText>
                  </Pressable>
                )}
              </View>
            </Pressable>
          </FadeIn>
        );
      }}
      ListEmptyComponent={
        <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: Spacing.six }}>
          No bookings yet
        </ThemedText>
      }
    />
    {paymentsFor && (
      <PaymentsModal
        visible
        onClose={() => setPaymentsFor(null)}
        parentId={paymentsFor.id}
        parentType={paymentsFor.source}
        title={paymentsFor.title}
        totalAmount={paymentsFor.total}
      />
    )}
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.three, paddingBottom: 120 },
  statsRow: { flexDirection: 'row', gap: Spacing.three },
  statCard: { flex: 1, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: 4 },
  statIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  chartCard: { borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.two },
  dimmed: { opacity: 0.45 },
  exportRow: { flexDirection: 'row', gap: Spacing.two },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  rowAmounts: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: Spacing.two },
  amountLabel: { fontSize: 11 },
  remind: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99 },
  row: {
    gap: Spacing.two,
    borderRadius: Radius,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
});
