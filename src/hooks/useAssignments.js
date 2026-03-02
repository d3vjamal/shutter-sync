import { useQuery, useMutation } from "convex/react";
import { toast } from "react-toastify";
import { api } from "../../convex/_generated/api";

export function useAssignments(user) {
    const _raw = useQuery(
        api.assignments.listByPhotographer,
        user ? { photographerId: user._id } : "skip"
    );
    const isLoading = _raw === undefined;
    const assignments = _raw || [];

    const createAssignmentMutation = useMutation(api.assignments.create);
    const updateAssignment = useMutation(api.assignments.update);
    const updateAssignStatus = useMutation(api.assignments.updateStatus);
    const updateAssignCaptureDate = useMutation(api.assignments.updateCaptureDate);

    const createAssignment = async (assignmentData) => {
        if (!user) return;
        try {
            await createAssignmentMutation({
                ...assignmentData,
                photographerId: user._id,
                status: "Ongoing",
            });
            toast.success("Assignment created successfully! 📸");
            return true;
        } catch (err) {
            toast.error("Failed to create assignment. Please try again.");
            return false;
        }
    };

    const handleUpdateStatus = async (id, status) => {
        await updateAssignStatus({ id, status });
    };

    const handleUpdateCaptureDate = async (id, date) => {
        await updateAssignCaptureDate({ id, captureDate: date });
    };

    const handleUpdateAssignment = async (id, data) => {
        // Strip Convex system fields and read-only fields before sending to the validator
        const {
            _creationTime,
            _id,
            photographerId,
            status,
            captureDate,
            ...updateFields
        } = data;
        try {
            await updateAssignment({ id, ...updateFields });
            toast.success("Assignment updated successfully!");
            return true;
        } catch (err) {
            toast.error("Failed to update assignment. Please try again.");
            return false;
        }
    };

    return {
        assignments,
        isLoading,
        createAssignment,
        updateAssignment: handleUpdateAssignment,
        updateAssignStatus: handleUpdateStatus,
        updateAssignCaptureDate: handleUpdateCaptureDate,
    };
}
