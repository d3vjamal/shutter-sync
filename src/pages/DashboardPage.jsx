import React from "react";
import AppLayout from "../components/layouts/AppLayout";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useAssignments } from "../hooks/useAssignments";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function DashboardPage() {
  const { user, handleLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  const {
    assignments,
    isLoading,
    updateAssignStatus,
    updateAssignCaptureDate,
    updateAssignment,
    deleteAssignment,
  } = useAssignments(user);
  const totalRevenue = useQuery(api.assignments.calculateTotalRevenue) ?? 0;

  return (
    <AppLayout
      user={user}
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
    >
      <Header
        user={user}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />
      <Dashboard
        assignments={assignments}
        loading={isLoading}
        onUpdateStatus={updateAssignStatus}
        onUpdateCaptureDate={updateAssignCaptureDate}
        onUpdateAssignment={updateAssignment}
        onDeleteAssignment={deleteAssignment}
      />
    </AppLayout>
  );
}
