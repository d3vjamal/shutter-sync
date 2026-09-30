import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { HeaderStats } from '@/components/ui/header-stats';
import { RefreshIndicator } from '@/components/ui/refresh-indicator';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Spacing } from '@/constants/theme';
import { useGradients } from '@/hooks/use-theme';
import { usePullRefresh } from '@/hooks/use-pull-refresh';
import { useWorkCounts } from '@/hooks/use-work-counts';
import { RevenueBody } from '@/screens/revenue-screen';

/** Revenue overview: collected/pending totals, a monthly chart, and the booking list. */
export function BusinessScreen() {
  const gradients = useGradients();
  const insets = useSafeAreaInsets();
  const { refreshing, onRefresh } = usePullRefresh();
  const counts = useWorkCounts();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <ScreenHeader
          eyebrow="Business"
          title="Revenue"
          colors={gradients.primary}
          right={<RefreshIndicator active={refreshing} />}
          paddingTop={insets.top + Spacing.two}>
          <HeaderStats
            stats={[
              { label: 'Ongoing', value: counts.ongoing },
              { label: 'Upcoming', value: counts.upcoming },
              { label: 'Done', value: counts.past },
            ]}
          />
        </ScreenHeader>
        <RevenueBody refreshing={refreshing} onRefresh={onRefresh} />
      </SafeAreaView>
    </ThemedView>
  );
}
