import { usePaginatedQuery } from 'convex/react';

import { api } from '@convex/_generated/api';

const PAGE_SIZE = 20;

export function usePhotographers() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.photographers.directory,
    {},
    { initialNumItems: PAGE_SIZE },
  );

  return {
    photographers: results,
    isLoading: status === 'LoadingFirstPage',
    isLoadingMore: status === 'LoadingMore',
    canLoadMore: status === 'CanLoadMore',
    loadMore: () => loadMore(PAGE_SIZE),
  };
}
