import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import {
  Aperture,
  Calendar,
  CheckCircle,
  Edit2,
  FileText,
  MapPin,
  PlayCircle,
  Receipt,
  Trash2,
  X,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, RefreshControl, SectionList, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaymentsModal } from '@/components/payments-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FadeIn } from '@/components/ui/fade-in';
import { Gradient } from '@/components/ui/gradient';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ProgressBar } from '@/components/ui/progress-bar';
import { RefreshIndicator } from '@/components/ui/refresh-indicator';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Segmented } from '@/components/ui/segmented';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useAssignments } from '@/hooks/use-assignments';
import { useAuth } from '@/hooks/use-auth';
import { useFreelanceAssignments } from '@/hooks/use-freelance-assignments';
import { useGradients, useTheme } from '@/hooks/use-theme';
import { usePullRefresh } from '@/hooks/use-pull-refresh';
import { groupByStatusAndMonth, type SectionKey } from '@/lib/dashboard-grouping';
import { generateAndSharePdf, withInlinedLogo } from '@/lib/pdf';
import { buildAgreementHtml, buildFreelanceAgreementHtml } from '@/lib/pdf-templates';
import { toAssignmentCard, toFreelanceCard, type RevenueItem } from '@/lib/revenue';
import type { AppStackParamList } from '@/navigation/types';
import type { Doc } from '@convex/_generated/dataModel';

type ViewMode = 'assignments' | 'freelance';

type CardItem = RevenueItem;

const SECTION_LABEL: Record<SectionKey, string> = {
  ongoing: 'Ongoing',
  upcoming: 'Upcoming',
  past: 'Past & Completed',
};
const SECTION_ICON: Record<SectionKey, typeof PlayCircle> = {
  ongoing: PlayCircle,
  upcoming: Calendar,
  past: CheckCircle,
};

export function DashboardScreen() {
  const theme = useTheme();
  const gradients = useGradients();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user } = useAuth();
  const { assignments, isLoading: assignmentsLoading, updateAssignStatus, deleteAssignment } = useAssignments(user);
  const { freelanceJobs, isLoading: freelanceLoading, updateJobStatus, deleteJob } = useFreelanceAssignments(user);
  const isLoading = assignmentsLoading || freelanceLoading;

  const [viewMode, setViewMode] = useState<ViewMode>('assignments');
  const modeColors = viewMode === 'assignments' ? gradients.primary : gradients.accent;
  const modeTint = viewMode === 'assignments' ? theme.primary : theme.accent;
  const [activeSection, setActiveSection] = useState<SectionKey>('ongoing');
  const [detailItem, setDetailItem] = useState<CardItem | null>(null);
  const [paymentsFor, setPaymentsFor] = useState<CardItem | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { refreshing, onRefresh } = usePullRefresh();

  const cards = useMemo<CardItem[]>(
    () =>
      viewMode === 'assignments'
        ? assignments.map(toAssignmentCard)
        : freelanceJobs.map(toFreelanceCard),
    [viewMode, assignments, freelanceJobs],
  );

  const grouped = useMemo(
    () => groupByStatusAndMonth(cards, (c) => c.date),
    [cards],
  );

  const counts: Record<SectionKey, number> = {
    ongoing: Object.values(grouped.ongoing).flat().length,
    upcoming: Object.values(grouped.upcoming).flat().length,
    past: Object.values(grouped.past).flat().length,
  };

  const sections = Object.entries(grouped[activeSection]).map(([title, data]) => ({
    title,
    data,
  }));

  const handleComplete = (item: CardItem) => {
    Alert.alert('Mark as complete?', `"${item.title}" will be moved to completed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          if (viewMode === 'assignments') await updateAssignStatus(item.id as any, 'Completed');
          else await updateJobStatus(item.id as any, 'Completed');
          setDetailItem(null);
        },
      },
    ]);
  };

  const handleDelete = (item: CardItem) => {
    Alert.alert('Delete this entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (viewMode === 'assignments') await deleteAssignment(item.id as any);
          else await deleteJob(item.id as any);
          setDetailItem(null);
        },
      },
    ]);
  };

  const handleAgreementPdf = async (item: CardItem) => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      const pdfUser = user ? await withInlinedLogo(user) : user;
      const html =
        item.source === 'assignment'
          ? buildAgreementHtml(item.raw as Doc<'assignments'>, pdfUser)
          : buildFreelanceAgreementHtml(item.raw as Doc<'freelanceAssignments'>, pdfUser);
      await generateAndSharePdf(html, `${item.source === 'assignment' ? 'Agreement' : 'Freelance-Agreement'}-${item.title}`);
    } catch (err) {
      Alert.alert('PDF failed', err instanceof Error ? err.message : 'Could not generate the agreement PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleEdit = (item: CardItem) => {
    setDetailItem(null);
    if (viewMode === 'assignments') {
      navigation.navigate('CreateAssignment', { assignment: item.raw as Doc<'assignments'> });
    } else {
      navigation.navigate('CreateFreelance', { job: item.raw as Doc<'freelanceAssignments'> });
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <ScreenHeader
          eyebrow={`Hello${user?.name ? ', ' + user.name.split(' ')[0] : ''} 👋`}
          title={viewMode === 'assignments' ? 'Your Shoots' : 'Freelance Jobs'}
          colors={modeColors}
          right={<RefreshIndicator active={refreshing} />}
          paddingTop={insets.top + Spacing.two}>
          <View style={styles.statsRow}>
            {[
              { label: 'Ongoing', value: counts.ongoing },
              { label: 'Upcoming', value: counts.upcoming },
              { label: 'Done', value: counts.past },
            ].map((stat) => (
              <View key={stat.label} style={styles.stat}>
                <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                <ThemedText type="small" style={styles.statLabel}>{stat.label}</ThemedText>
              </View>
            ))}
          </View>
        </ScreenHeader>

        <View style={styles.controls}>
          <Segmented
            options={[
              { key: 'assignments', label: 'Assignments' },
              { key: 'freelance', label: 'Freelance' },
            ]}
            value={viewMode}
            onChange={setViewMode}
            colors={modeColors}
          />
          <View style={styles.tabBar}>
            {(Object.keys(SECTION_LABEL) as SectionKey[]).map((key) => {
              const Icon = SECTION_ICON[key];
              const active = activeSection === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setActiveSection(key)}
                  style={[
                    styles.tab,
                    {
                      backgroundColor: active ? modeTint + '1F' : 'transparent',
                      borderColor: active ? modeTint : theme.border,
                    },
                  ]}>
                  <Icon size={13} color={active ? modeTint : theme.textSecondary} />
                  <ThemedText
                    type="smallBold"
                    style={{ fontSize: 12, color: active ? modeTint : theme.textSecondary }}>
                    {SECTION_LABEL[key].split(' ')[0]} · {counts[key]}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.list}>
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} colors={[theme.primary]} />
          }
          renderSectionHeader={({ section }) =>
            section.title !== 'Date TBD' ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.sectionHeader}>
                {section.title}
              </ThemedText>
            ) : null
          }
          renderItem={({ item, index }) => {
            const pct = item.total > 0 ? Math.min(100, Math.round((item.paid / item.total) * 100)) : 0;
            const paidUp = pct === 100;
            return (
              <FadeIn index={index}>
                <PressableScale
                  onPress={() => setDetailItem(item)}
                  scaleTo={0.98}
                  style={[styles.card, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}
                  contentStyle={styles.cardInner}>
                  <Gradient
                    colors={modeColors}
                    radius={14}
                    style={styles.cardIcon}>
                    <Aperture size={20} color="#fff" />
                  </Gradient>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.row}>
                      <ThemedText type="smallBold" numberOfLines={1} style={{ flex: 1, fontSize: 15 }}>
                        {item.title}
                      </ThemedText>
                      <View
                        style={[
                          styles.pill,
                          { backgroundColor: (paidUp ? theme.success : modeTint) + '22' },
                        ]}>
                        <ThemedText
                          type="smallBold"
                          style={{ fontSize: 10, color: paidUp ? theme.success : modeTint }}>
                          {paidUp ? 'PAID' : `${pct}%`}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                      {item.subtitle}
                    </ThemedText>
                    <View style={styles.metaRow}>
                      {!!item.date && (
                        <View style={styles.metaItem}>
                          <Calendar size={11} color={modeTint} />
                          <ThemedText type="small" themeColor="textSecondary" style={styles.metaText}>
                            {format(new Date(item.date), 'dd MMM yyyy')}
                          </ThemedText>
                        </View>
                      )}
                      {!!item.location && (
                        <View style={[styles.metaItem, { flex: 1 }]}>
                          <MapPin size={11} color={theme.textSecondary} />
                          <ThemedText
                            type="small"
                            themeColor="textSecondary"
                            numberOfLines={1}
                            style={styles.metaText}>
                            {item.location}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <ProgressBar value={pct} height={5} colors={modeColors} />
                  </View>
                </PressableScale>
              </FadeIn>
            );
          }}
          ListEmptyComponent={
            <FadeIn style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: modeTint + '1A' }]}>
                <Aperture size={30} color={modeTint} />
              </View>
              <ThemedText type="smallBold">Nothing here yet</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                No {SECTION_LABEL[activeSection].toLowerCase()} shoots
              </ThemedText>
            </FadeIn>
          }
        />
        )}
      </SafeAreaView>

      {/* Detail modal */}
      <Modal visible={!!detailItem} animationType="slide" onRequestClose={() => setDetailItem(null)}>
        {detailItem && (
          <ThemedView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.detailHeader}>
                <ThemedText type="smallBold" style={{ flex: 1 }} numberOfLines={1}>
                  {detailItem.title}
                </ThemedText>
                <Pressable
                  style={[styles.headerIconButton, { backgroundColor: theme.destructive + '17' }]}
                  hitSlop={6}
                  onPress={() => handleDelete(detailItem)}>
                  <Trash2 size={16} color={theme.destructive} />
                </Pressable>
                <Pressable style={styles.headerIconButton} hitSlop={6} onPress={() => setDetailItem(null)}>
                  <X size={20} color={theme.text} />
                </Pressable>
              </View>
              <View style={styles.detailBody}>
                <ThemedText type="subtitle" style={styles.detailTitle}>
                  {detailItem.title}
                </ThemedText>
                <ThemedText type="small" style={{ color: modeTint }}>
                  {detailItem.subtitle}
                </ThemedText>

                <View style={styles.infoGrid}>
                  <View style={[styles.infoBox, { backgroundColor: theme.backgroundElement }]}>
                    <ThemedText type="small" themeColor="textSecondary">
                      Date
                    </ThemedText>
                    <ThemedText type="smallBold">
                      {detailItem.date ? format(new Date(detailItem.date), 'dd MMM yyyy') : 'TBD'}
                    </ThemedText>
                  </View>
                  <View style={[styles.infoBox, { backgroundColor: theme.backgroundElement }]}>
                    <ThemedText type="small" themeColor="textSecondary">
                      Location
                    </ThemedText>
                    <ThemedText type="smallBold" numberOfLines={1}>
                      {detailItem.location || '—'}
                    </ThemedText>
                  </View>
                </View>

                <View style={[styles.paymentBox, { backgroundColor: theme.backgroundElement }]}>
                  <View style={styles.row}>
                    <ThemedText type="small" themeColor="textSecondary">
                      Payments
                    </ThemedText>
                    <ThemedText type="smallBold">
                      ₹{detailItem.paid.toLocaleString()} / ₹{detailItem.total.toLocaleString()}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <Pressable
                    style={[styles.actionPill, { backgroundColor: modeTint + '17', borderColor: modeTint + '30' }]}
                    onPress={() => setPaymentsFor(detailItem)}>
                    <Receipt size={16} color={modeTint} />
                    <ThemedText type="smallBold" style={[styles.actionLabel, { color: modeTint }]}>
                      Payments
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    style={[styles.actionPill, { backgroundColor: theme.accent + '17', borderColor: theme.accent + '30' }]}
                    disabled={pdfLoading}
                    onPress={() => handleAgreementPdf(detailItem)}>
                    {pdfLoading ? (
                      <ActivityIndicator size="small" color={theme.accent} />
                    ) : (
                      <FileText size={16} color={theme.accent} />
                    )}
                    <ThemedText type="smallBold" style={[styles.actionLabel, { color: theme.accent }]}>
                      PDF
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    style={[styles.actionPill, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
                    onPress={() => handleEdit(detailItem)}>
                    <Edit2 size={16} color={theme.text} />
                    <ThemedText type="smallBold" style={[styles.actionLabel, { color: theme.text }]}>
                      Edit
                    </ThemedText>
                  </Pressable>
                </View>

                {detailItem.status !== 'Completed' && (
                  <Pressable
                    style={[
                      styles.actionPill,
                      styles.completeButton,
                      { backgroundColor: theme.success + '17', borderColor: theme.success + '30' },
                    ]}
                    onPress={() => handleComplete(detailItem)}>
                    <CheckCircle size={16} color={theme.success} />
                    <ThemedText type="smallBold" style={[styles.actionLabel, { color: theme.success }]}>
                      Mark Complete
                    </ThemedText>
                  </Pressable>
                )}
              </View>
            </SafeAreaView>
          </ThemedView>
        )}
      </Modal>

      {paymentsFor && (
        <PaymentsModal
          visible={!!paymentsFor}
          onClose={() => setPaymentsFor(null)}
          parentId={paymentsFor.id}
          parentType={viewMode === 'assignments' ? 'assignment' : 'freelance'}
          title={paymentsFor.title}
          totalAmount={paymentsFor.total}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: Spacing.two },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  statValue: { color: '#fff', fontSize: 24, fontWeight: '800', lineHeight: 30 },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  controls: { padding: Spacing.three, gap: Spacing.two },
  tabBar: { flexDirection: 'row', gap: Spacing.two },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  list: { paddingHorizontal: Spacing.three, paddingBottom: 120 },
  sectionHeader: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  card: { borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, marginBottom: Spacing.three },
  cardInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three },
  cardIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  metaRow: { flexDirection: 'row', gap: Spacing.three, marginVertical: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.two },
  empty: { alignItems: 'center', paddingVertical: Spacing.six, gap: 4 },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBody: { padding: Spacing.four, gap: Spacing.three },
  detailTitle: { fontSize: 20, lineHeight: 26 },
  infoGrid: { flexDirection: 'row', gap: Spacing.two },
  infoBox: { flex: 1, padding: Spacing.two, borderRadius: Radius, gap: 2 },
  paymentBox: { padding: Spacing.two, borderRadius: Radius },
  actionsRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },
  actionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: Radius,
    minHeight: 44,
  },
  actionLabel: { fontSize: 12.5 },
  completeButton: { flex: undefined, alignSelf: 'flex-end', paddingHorizontal: Spacing.four, marginTop: Spacing.two },
});
