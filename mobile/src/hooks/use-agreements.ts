import { useMutation, useQuery } from 'convex/react';

import { api } from '@convex/_generated/api';

export function useAgreements() {
  const raw = useQuery(api.agreements.get);
  const isLoading = raw === undefined;
  const agreements = raw ?? [];
  const createAgreement = useMutation(api.agreements.create);
  const updateAgreement = useMutation(api.agreements.update);
  const deleteAgreement = useMutation(api.agreements.remove);

  return { agreements, isLoading, createAgreement, updateAgreement, deleteAgreement };
}
