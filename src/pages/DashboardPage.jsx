import React from "react";
import AppLayout from "../components/layouts/AppLayout";
import Dashboard from "../components/Dashboard";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useAssignments } from "../hooks/useAssignments";

export default function DashboardPage() {
    const { user, handleLogout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { assignments, updateAssignStatus, updateAssignCaptureDate, updateAssignment } = useAssignments(user);

    return (
        <AppLayout user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme}>
            <Dashboard
                assignments={assignments}
                onUpdateStatus={updateAssignStatus}
                onUpdateCaptureDate={updateAssignCaptureDate}
                onUpdateAssignment={updateAssignment}
            />
        </AppLayout>
    );
}
