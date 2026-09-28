import { useMutation, useQuery } from 'convex/react';
import Toast from 'react-native-toast-message';

import { api } from '@convex/_generated/api';
import type { Doc, Id } from '@convex/_generated/dataModel';

export function useFreelanceAssignments(user: Doc<'users'> | null | undefined) {
  const raw = useQuery(
    api.freelanceAssignments.listByPhotographer,
    user ? { photographerId: user._id } : 'skip',
  );
  const isLoading = raw === undefined;
  const freelanceJobs = raw ?? [];

  const createMutation = useMutation(api.freelanceAssignments.create);
  const updateMutation = useMutation(api.freelanceAssignments.update);
  const updateStatusMutation = useMutation(api.freelanceAssignments.updateStatus);
  const removeMutation = useMutation(api.freelanceAssignments.remove);

  const createJob = async (data: Record<string, unknown>) => {
    if (!user) return false;
    try {
      await createMutation({ ...data, photographerId: user._id, status: 'Ongoing' } as any);
      Toast.show({ type: 'success', text1: 'Freelance job created!' });
      return true;
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to create job. Please try again.' });
      return false;
    }
  };

  const updateJob = async (id: Id<'freelanceAssignments'>, data: Record<string, unknown>) => {
    const fields: Record<string, unknown> = { ...data };
    for (const key of ['_creationTime', '_id', 'photographerId', 'status']) {
      delete fields[key];
    }
    try {
      await updateMutation({ id, ...fields });
      Toast.show({ type: 'success', text1: 'Job updated!' });
      return true;
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to update job.' });
      return false;
    }
  };

  const updateJobStatus = async (id: Id<'freelanceAssignments'>, status: string) => {
    try {
      await updateStatusMutation({ id, status });
      return true;
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to update status.' });
      return false;
    }
  };

  const deleteJob = async (id: Id<'freelanceAssignments'>) => {
    try {
      await removeMutation({ id });
      Toast.show({ type: 'success', text1: 'Job deleted.' });
      return true;
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to delete job.' });
      return false;
    }
  };

  return { freelanceJobs, isLoading, createJob, updateJob, updateJobStatus, deleteJob };
}
