import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  PlayCircle,
  CheckCircle,
  Edit2,
  Trash2,
  Camera,
  Video,
  Clock,
  Wallet,
} from "lucide-react";
import { format, isSameMonth, isBefore, startOfMonth } from "date-fns";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import AppLayout from "../components/layouts/AppLayout";
import Header from "../components/Header";
import FreelancePDFDialog from "../components/FreelancePDFDialog";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useFreelanceAssignments } from "../hooks/useFreelanceAssignments";
import FreelanceDashboard from "../components/FreelanceDashboard";
import { cn } from "../lib/utils";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FreelancePage() {
  const { user, handleLogout }                       = useAuth();
  const { theme, setTheme }                          = useTheme();
  const navigate                                     = useNavigate();
  const { freelanceJobs, isLoading, updateJobStatus, deleteJob } = useFreelanceAssignments(user);

  // ── Status updates ──

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <AppLayout user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme}>
        <Header user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} />
        <FreelanceDashboard loading={true} />
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme}>
      <Header user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} />

      <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-load">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-secondary/10">
              <Briefcase size={22} className="text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">Freelance Jobs</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Jobs you're doing for studios</p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/create-freelance-assignment")}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl h-10 px-4 text-sm font-bold gap-1.5"
          >
            <Plus size={16} /> New Job
          </Button>
        </div>

        {/* ── Dashboard ── */}
        <FreelanceDashboard
          freelanceJobs={freelanceJobs}
          loading={isLoading}
          onUpdateStatus={updateJobStatus}
          onDeleteJob={deleteJob}
        />
      </div>
    </AppLayout>
  );
}
