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

    // Check role if required (roleCode: 0 = admin, 1 = photographer)
    if (requiredRole === "admin" && user.roleCode !== 0) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
