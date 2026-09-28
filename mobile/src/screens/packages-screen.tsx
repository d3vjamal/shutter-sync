import { useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { RefreshIndicator } from '@/components/ui/refresh-indicator';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Segmented } from '@/components/ui/segmented';
import { Spacing } from '@/constants/theme';
import { useGradients } from '@/hooks/use-theme';
import { usePullRefresh } from '@/hooks/use-pull-refresh';
import { AgreementsBody } from '@/screens/agreements-screen';
import { PackagesBody } from '@/screens/packages-body';

type CatalogView = 'packages' | 'agreements';

const TITLES: Record<CatalogView, { eyebrow: string; title: string }> = {
  packages: { eyebrow: 'Your services', title: 'Packages' },
  agreements: { eyebrow: 'Terms & conditions', title: 'Agreements' },
};

/** What you offer clients: service packages and the reusable contract terms attached to them. */
export function PackagesScreen() {
  const gradients = useGradients();
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<CatalogView>('packages');
  const colors = view === 'packages' ? gradients.primary : gradients.accent;
  const { refreshing, onRefresh } = usePullRefresh();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <ScreenHeader
          eyebrow={TITLES[view].eyebrow}
          title={TITLES[view].title}
          colors={colors}
          right={<RefreshIndicator active={refreshing} />}
          paddingTop={insets.top + Spacing.two}>
          <Segmented
            options={[
              { key: 'packages', label: 'Packages' },
              { key: 'agreements', label: 'Agreements' },
            ]}
            value={view}
            onChange={setView}
            colors={colors}
          />
        </ScreenHeader>

        {view === 'packages' ? (
          <PackagesBody refreshing={refreshing} onRefresh={onRefresh} />
        ) : (
          <AgreementsBody refreshing={refreshing} onRefresh={onRefresh} />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
