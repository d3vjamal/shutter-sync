import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export function useAuth() {
    const { signOut, signIn } = useAuthActions();
    const user = useQuery(api.users.viewer);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/login");
    };

    // Authenticates only — caller must verify roleCode === 0 before navigating
    const handleAdminLogin = async (email, password) => {
        await signIn("password", { email, password, flow: "signIn" });
    };

    return {
        user,
        signOut,
        signIn,
        handleLogout,
        handleAdminLogin,
    };
}
