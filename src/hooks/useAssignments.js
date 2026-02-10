import { useQuery, useMutation } from "convex/react";
import { toast } from "react-toastify";
import { api } from "../../convex/_generated/api";

export function useAssignments(user) {
    const assignments =
        useQuery(
            api.assignments.listByPhotographer,
            user ? { photographerId: user._id } : "skip"
        ) || [];

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
            toast.error("Failed to create assignment: " + err.message);
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
        try {
            await updateAssignment({ id, ...data });
            toast.success("Assignment updated successfully!");
            return true;
        } catch (err) {
            toast.error("Failed to update assignment: " + err.message);
            return false;
        }
    };

    return {
        assignments,
        createAssignment,
        updateAssignment: handleUpdateAssignment,
        updateAssignStatus: handleUpdateStatus,
        updateAssignCaptureDate: handleUpdateCaptureDate,
    };
}
