import { useQuery, useMutation } from "convex/react";
import { toast } from "react-toastify";
import { api } from "../../convex/_generated/api";
import { downloadICS } from "../lib/calendarUtils";

export function useFreelanceAssignments(user) {
    const _raw = useQuery(
        api.freelanceAssignments.listByPhotographer,
        user ? { photographerId: user._id } : "skip"
    );
    const isLoading = _raw === undefined;
    const freelanceJobs = _raw || [];

    const createMutation    = useMutation(api.freelanceAssignments.create);
    const updateMutation    = useMutation(api.freelanceAssignments.update);
    const updateStatusMutation = useMutation(api.freelanceAssignments.updateStatus);
    const removeMutation    = useMutation(api.freelanceAssignments.remove);

    const createJob = async (data) => {
        if (!user) return false;
        try {
            await createMutation({ ...data, photographerId: user._id, status: "Ongoing" });
            toast.success("Freelance job created!");
            // Auto-download calendar event if dates were set
            downloadICS({
                photographerDays: data.dates,
                title: `${data.studioName} – Freelance`,
                clientName: data.studioOwnerName,
                venue:    data.venue,
                location: data.location,
            });

            return true;
        } catch {
            toast.error("Failed to create job. Please try again.");
            return false;
        }
    };

    const updateJob = async (id, data) => {
        const {
            _creationTime, _id, photographerId, status, ...fields
        } = data;
        try {
            await updateMutation({ id, ...fields });
            toast.success("Job updated!");
            return true;
        } catch {
            toast.error("Failed to update job.");
            return false;
        }
    };

    const updateJobStatus = async (id, status) => {
        try {
            await updateStatusMutation({ id, status });
            return true;
        } catch {
            toast.error("Failed to update status.");
            return false;
        }
    };

    const deleteJob = async (id) => {
        try {
            await removeMutation({ id });
            toast.success("Job deleted.");
            return true;
        } catch {
            toast.error("Failed to delete job.");
            return false;
        }
    };

    return { freelanceJobs, isLoading, createJob, updateJob, updateJobStatus, deleteJob };
}
