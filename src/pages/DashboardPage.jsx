import React, { useEffect, useState } from "react";
import AppLayout from "../components/layouts/AppLayout";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useAssignments } from "../hooks/useAssignments";
import { api } from "../../convex/_generated/api";

export default function DashboardPage() {
  const { user, handleLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  const {
    assignments,
    updateAssignStatus,
    updateAssignCaptureDate,
    updateAssignment,
  } = useAssignments(user);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    async function fetchTotalRevenue() {
      const revenue = await api.calculateTotalRevenue();
      setTotalRevenue(revenue);
    }
    fetchTotalRevenue();
  }, []);

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
        onUpdateStatus={updateAssignStatus}
        onUpdateCaptureDate={updateAssignCaptureDate}
        onUpdateAssignment={updateAssignment}
      />
    </AppLayout>
  );
}
