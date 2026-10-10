import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { EyeToggle } from '@/components/ui/eye-toggle';
import { HeaderStats } from '@/components/ui/header-stats';
import { RefreshIndicator } from '@/components/ui/refresh-indicator';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Segmented } from '@/components/ui/segmented';
import { Spacing } from '@/constants/theme';
import { useGradients } from '@/hooks/use-theme';
import { usePullRefresh } from '@/hooks/use-pull-refresh';
import { useWorkCounts } from '@/hooks/use-work-counts';
import { AgreementsBody } from '@/screens/agreements-screen';
import { CalendarBody } from '@/screens/calendar-body';
import { InsightsBody } from '@/screens/insights-body';
import { PackagesBody } from '@/screens/packages-body';
import { RevenueBody } from '@/screens/revenue-screen';

type BusinessView = 'revenue' | 'calendar' | 'insights' | 'packages' | 'agreements';

const TITLES: Record<BusinessView, { eyebrow: string; title: string }> = {
  revenue: { eyebrow: 'Business', title: 'Revenue' },
  calendar: { eyebrow: 'Schedule', title: 'Calendar' },
  insights: { eyebrow: 'Business', title: 'Insights' },
  packages: { eyebrow: 'Your services', title: 'Packages' },
  agreements: { eyebrow: 'Terms & conditions', title: 'Agreements' },
};

/** Everything money-and-offering related: revenue, service packages, and agreement terms. */
export function BusinessScreen() {
  const gradients = useGradients();
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<BusinessView>('revenue');
  const colors = view === 'agreements' ? gradients.accent : gradients.primary;
  const { refreshing, onRefresh } = usePullRefresh();
  const counts = useWorkCounts();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <ScreenHeader
          eyebrow={TITLES[view].eyebrow}
          title={TITLES[view].title}
          colors={colors}
          right={
            <View style={styles.headerRight}>
              <RefreshIndicator active={refreshing} />
              <EyeToggle />
            </View>
          }
          paddingTop={insets.top + Spacing.two}>
          <Segmented
            options={[
              { key: 'revenue', label: 'Revenue' },
              { key: 'calendar', label: 'Calendar' },
              { key: 'insights', label: 'Insights' },
              { key: 'packages', label: 'Packages' },
              { key: 'agreements', label: 'Agreements' },
            ]}
            value={view}
            onChange={setView}
            colors={colors}
          />
          {view === 'revenue' && (
            <HeaderStats
              stats={[
                { label: 'Ongoing', value: counts.ongoing },
                { label: 'Upcoming', value: counts.upcoming },
                { label: 'Done', value: counts.past },
              ]}
            />
          )}
        </ScreenHeader>

        {view === 'revenue' && <RevenueBody refreshing={refreshing} onRefresh={onRefresh} />}
        {view === 'calendar' && <CalendarBody />}
        {view === 'insights' && <InsightsBody refreshing={refreshing} onRefresh={onRefresh} />}
        {view === 'packages' && <PackagesBody refreshing={refreshing} onRefresh={onRefresh} />}
        {view === 'agreements' && <AgreementsBody refreshing={refreshing} onRefresh={onRefresh} />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
});
