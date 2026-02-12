import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useAgreements() {
    const agreements = useQuery(api.agreements.get) || [];
    const createAgreement = useMutation(api.agreements.create);
    const updateAgreement = useMutation(api.agreements.update);
    const deleteAgreement = useMutation(api.agreements.remove);

    return {
        agreements,
        createAgreement,
        updateAgreement,
        deleteAgreement,
    };
}
