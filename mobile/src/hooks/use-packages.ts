import { useMutation, useQuery } from 'convex/react';

import { api } from '@convex/_generated/api';

export function usePackages() {
  const raw = useQuery(api.packages.listMine);
  const isLoading = raw === undefined;
  const packages = raw ?? [];

  const createPackage = useMutation(api.packages.create);
  const updatePackage = useMutation(api.packages.update);
  const removePackage = useMutation(api.packages.remove);

  return { packages, isLoading, createPackage, updatePackage, removePackage };
}
