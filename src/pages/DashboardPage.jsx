import React, { useState } from "react";
import AppLayout from "../components/layouts/AppLayout";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import FreelanceDashboard from "../components/FreelanceDashboard";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useAssignments } from "../hooks/useAssignments";
import { useFreelanceAssignments } from "../hooks/useFreelanceAssignments";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "../lib/utils";

export default function DashboardPage() {
  const { user, handleLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("assignments");

  const {
    assignments,
    isLoading: isLoadingAssignments,
    updateAssignStatus,
    updateAssignCaptureDate,
    updateAssignment,
    deleteAssignment,
  } = useAssignments(user);

  const {
    freelanceJobs,
    isLoading: isLoadingFreelance,
    updateJobStatus,
    deleteJob,
  } = useFreelanceAssignments(user);

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
      
      {/* ── Tabs ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-0 mb-6 flex justify-center">
        <div className="flex p-1 space-x-1 bg-muted/50 rounded-2xl border border-border/50">
          <button
            onClick={() => setActiveTab("assignments")}
            className={cn(
               "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
               activeTab === "assignments" 
                 ? "bg-primary text-primary-foreground shadow-sm" 
                 : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab("freelance")}
            className={cn(
               "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
               activeTab === "freelance" 
                 ? "bg-secondary text-secondary-foreground shadow-sm" 
                 : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Freelance Jobs
          </button>
        </div>
      </div>

      {/* ── Dashboards ── */}
      {activeTab === "assignments" ? (
        <Dashboard
          assignments={assignments}
          loading={isLoadingAssignments}
          onUpdateStatus={updateAssignStatus}
          onUpdateCaptureDate={updateAssignCaptureDate}
          onUpdateAssignment={updateAssignment}
          onDeleteAssignment={deleteAssignment}
        />
      ) : (
        <FreelanceDashboard
          freelanceJobs={freelanceJobs}
          loading={isLoadingFreelance}
          onUpdateStatus={updateJobStatus}
          onDeleteJob={deleteJob}
        />
      )}
    </AppLayout>
  );
}
