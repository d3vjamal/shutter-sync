import { useMutation, useQuery } from 'convex/react';
import Toast from 'react-native-toast-message';

import { api } from '@convex/_generated/api';

export function usePayments(parentId: string | undefined) {
  const raw = useQuery(api.payments.listByParent, parentId ? { parentId } : 'skip');
  const isLoading = raw === undefined;
  const payments = raw ?? [];

  const createMutation = useMutation(api.payments.create);
  const removeMutation = useMutation(api.payments.remove);

  const addPayment = async (data: Record<string, unknown>) => {
    try {
      await createMutation(data as any);
      Toast.show({ type: 'success', text1: 'Payment recorded! 💰' });
      return true;
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to save payment.' });
      return false;
    }
  };

  const removePayment = async (id: string) => {
    try {
      await removeMutation({ id } as any);
      Toast.show({ type: 'success', text1: 'Payment entry deleted.' });
      return true;
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to delete payment entry.' });
      return false;
    }
  };

  return { payments, isLoading, addPayment, removePayment };
}
