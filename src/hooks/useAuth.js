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

    const handleAdminLogin = async (email, password) => {
        try {
            await signIn("password", { email, password, flow: "signIn" });
            navigate("/dashboard");
        } catch (err) {
            console.error("Admin login error:", err);
            throw err;
        }
    };

    return {
        user,
        signOut,
        signIn,
        handleLogout,
        handleAdminLogin,
    };
}
