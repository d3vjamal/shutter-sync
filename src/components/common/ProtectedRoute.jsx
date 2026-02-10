import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, user, requiredRole }) {
    // Still loading
    if (user === undefined) {
        return null;
    }

    // Not authenticated
    if (user === null) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requiredRole) {
        const userRole = user.roleCode || user.role || "photographer";
        const isAdmin = userRole === "admin" || user.email === "admin@shuttersync.com";

        if (requiredRole === "admin" && !isAdmin) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
}
