import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function usePhotographers() {
    const photographers = useQuery(api.photographers.list) || [];
    const createPhotographer = useMutation(api.photographers.create);
    const updatePhotographer = useMutation(api.photographers.update);
    const deletePhotographer = useMutation(api.photographers.remove);

    return {
        photographers,
        createPhotographer,
        updatePhotographer,
        deletePhotographer,
    };
}
