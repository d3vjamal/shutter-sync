import React, { useEffect, useState } from "react";
import AuthLayout from "../components/layouts/AuthLayout";
import AdminLogin from "../components/AdminLogin";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
    const { user, handleAdminLogin, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [loginAttempted, setLoginAttempted] = useState(false);
    const [roleError, setRoleError] = useState("");

    useEffect(() => {
        if (!loginAttempted) return;
        if (user === undefined) return; // still loading
        if (user === null) return;      // not authenticated yet

        if (user.roleCode === 0) {
            navigate("/admin/dashboard");
        } else {
            // Authenticated but not an admin — sign out immediately
            handleLogout();
            setRoleError("This account does not have admin privileges.");
            setLoginAttempted(false);
        }
    }, [user, loginAttempted]);

    const onLogin = async (email, password) => {
        setRoleError("");
        await handleAdminLogin(email, password); // throws on bad credentials
        setLoginAttempted(true);
    };

    return (
        <AuthLayout>
            <AdminLogin onLogin={onLogin} serverError={roleError} />
        </AuthLayout>
    );
}
