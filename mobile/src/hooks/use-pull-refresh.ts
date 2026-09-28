import { useCallback, useState } from 'react';

/**
 * Convex queries are already live subscriptions, so pulling to refresh has
 * nothing to re-fetch — but the gesture still needs to *feel* acknowledged.
 * This holds the spinner up for a minimum duration so it never just flickers.
 */
export function usePullRefresh(minDurationMs = 600) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing((current) => {
      if (current) return current;
      setTimeout(() => setRefreshing(false), minDurationMs);
      return true;
    });
  }, [minDurationMs]);

  return { refreshing, onRefresh };
}
