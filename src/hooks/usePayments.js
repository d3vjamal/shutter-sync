import { useQuery, useMutation } from "convex/react";
import { toast } from "react-toastify";
import { api } from "../../convex/_generated/api";

export function usePayments(parentId) {
    const _raw = useQuery(
        api.payments.listByParent,
        parentId ? { parentId } : "skip"
    );
    const isLoading = _raw === undefined;
    const payments = _raw || [];

    const createMutation = useMutation(api.payments.create);
    const removeMutation = useMutation(api.payments.remove);

    const addPayment = async (data) => {
        try {
            await createMutation(data);
            toast.success("Payment recorded! 💰");
            return true;
        } catch {
            toast.error("Failed to save payment.");
            return false;
        }
    };

    const removePayment = async (id) => {
        try {
            await removeMutation({ id });
            toast.success("Payment entry deleted.");
            return true;
        } catch {
            toast.error("Failed to delete payment entry.");
            return false;
        }
    };

    return { payments, isLoading, addPayment, removePayment };
}
