import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function usePackages() {
  const _raw = useQuery(api.packages.listMine);
  const isLoading = _raw === undefined;
  const packages = _raw || [];

  const createPackage = useMutation(api.packages.create);
  const updatePackage = useMutation(api.packages.update);
  const removePackage = useMutation(api.packages.remove);

  return {
    packages,
    isLoading,
    createPackage,
    updatePackage,
    removePackage,
  };
}
