import { useMutation, useQuery } from 'convex/react';
import Toast from 'react-native-toast-message';

import { api } from '@convex/_generated/api';
import type { Doc, Id } from '@convex/_generated/dataModel';

export function useAssignments(user: Doc<'users'> | null | undefined) {
  const raw = useQuery(
    api.assignments.listByPhotographer,
    user ? { photographerId: user._id } : 'skip',
  );
  const isLoading = raw === undefined;
  const assignments = raw ?? [];

  const createAssignmentMutation = useMutation(api.assignments.create);
  const updateAssignmentMutation = useMutation(api.assignments.update);
  const updateStatusMutation = useMutation(api.assignments.updateStatus);
  const updateCaptureDateMutation = useMutation(api.assignments.updateCaptureDate);
  const deleteAssignmentMutation = useMutation(api.assignments.remove);

  const createAssignment = async (assignmentData: Record<string, unknown>) => {
    if (!user) return false;
    try {
      await createAssignmentMutation({
        ...assignmentData,
        photographerId: user._id,
        status: 'Ongoing',
      } as any);
      Toast.show({ type: 'success', text1: 'Assignment created successfully! 📸' });
      return true;
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to create assignment. Please try again.' });
      return false;
    }
  };

  const updateAssignStatus = async (id: Id<'assignments'>, status: string) => {
    await updateStatusMutation({ id, status });
  };

  const updateAssignCaptureDate = async (id: Id<'assignments'>, date: string) => {
    await updateCaptureDateMutation({ id, captureDate: date });
  };

  const updateAssignment = async (id: Id<'assignments'>, data: Record<string, unknown>) => {
    // Strip Convex system fields and read-only fields before sending to the validator
    const updateFields: Record<string, unknown> = { ...data };
    for (const key of ['_creationTime', '_id', 'photographerId', 'status', 'captureDate']) {
      delete updateFields[key];
    }
    try {
      await updateAssignmentMutation({ id, ...updateFields });
      Toast.show({ type: 'success', text1: 'Assignment updated successfully!' });
      return true;
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to update assignment. Please try again.' });
      return false;
    }
  };

  const deleteAssignment = async (id: Id<'assignments'>) => {
    try {
      await deleteAssignmentMutation({ id });
      Toast.show({ type: 'success', text1: 'Assignment deleted.' });
      return true;
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to delete assignment.' });
      return false;
    }
  };

  return {
    assignments,
    isLoading,
    createAssignment,
    updateAssignment,
    updateAssignStatus,
    updateAssignCaptureDate,
    deleteAssignment,
  };
}
