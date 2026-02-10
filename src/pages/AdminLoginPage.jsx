import React from "react";
import AuthLayout from "../components/layouts/AuthLayout";
import AdminLogin from "../components/AdminLogin";
import { useAuth } from "../hooks/useAuth";

export default function AdminLoginPage() {
    const { handleAdminLogin } = useAuth();

    return (
        <AuthLayout>
            <AdminLogin onLogin={handleAdminLogin} />
        </AuthLayout>
    );
}
