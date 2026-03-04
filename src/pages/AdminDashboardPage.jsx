import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  ShieldCheck, Users, UserCheck, UserX, ArrowRight,
  PlayCircle, Calendar, CheckCircle2, Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";
import { isFuture, isSameMonth } from "date-fns";
import AppLayout from "../components/layouts/AppLayout";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

function StatCard({ label, value, icon: Icon, colorClass, bg }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-4">
      <div className={cn("p-3 rounded-xl", bg)}>
        <Icon size={22} className={colorClass} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-3xl font-black text-foreground leading-none mt-1">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user, handleLogout } = useAuth();
  const { theme, setTheme }    = useTheme();
  const photographers = useQuery(api.photographers.list)  ?? [];
  const assignments   = useQuery(api.assignments.listAll) ?? [];

  // Photographer stats
  const total    = photographers.length;
  const active   = photographers.filter((p) => p.active !== false).length;
  const inactive = photographers.filter((p) => p.active === false).length;

  // Assignment stats — same categorisation as photographer dashboard
  const now = new Date();
  let ongoing = 0, upcoming = 0, completed = 0;
  assignments.forEach((a) => {
    if (a.status === "Completed") {
      completed++;
    } else {
      const d = a.eventStartDate || a.captureDate;
      if (d && isFuture(new Date(d)) && !isSameMonth(new Date(d), now)) {
        upcoming++;
      } else {
        ongoing++;
      }
    }
  });

  return (
    <AppLayout user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme}>
      <div className="space-y-8 pb-10">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10">
            <ShieldCheck size={26} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Overview of your photographer network
            </p>
          </div>
        </div>

        {/* Photographer stats */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
            Photographers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total"    value={total}    icon={Users}     colorClass="text-primary"     bg="bg-primary/10"     />
            <StatCard label="Active"   value={active}   icon={UserCheck} colorClass="text-emerald-500" bg="bg-emerald-500/10" />
            <StatCard label="Inactive" value={inactive} icon={UserX}     colorClass="text-rose-500"    bg="bg-rose-500/10"    />
          </div>
        </div>

        {/* Assignment stats */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
            Assignments
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard label="Total"     value={assignments.length} icon={Briefcase}    colorClass="text-primary"     bg="bg-primary/10"     />
            <StatCard label="Ongoing"   value={ongoing}            icon={PlayCircle}   colorClass="text-amber-500"   bg="bg-amber-500/10"   />
            <StatCard label="Upcoming"  value={upcoming}           icon={Calendar}     colorClass="text-blue-500"    bg="bg-blue-500/10"    />
            <StatCard label="Completed" value={completed}          icon={CheckCircle2} colorClass="text-emerald-500" bg="bg-emerald-500/10" />
          </div>
        </div>

        {/* Quick link to manage */}
        <Link
          to="/photographers"
          className="flex items-center justify-between p-5 rounded-2xl border border-border bg-card hover:bg-muted/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Users size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">Artist Collective</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add, edit, enable or disable photographers
              </p>
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
          />
        </Link>
      </div>
    </AppLayout>
  );
}
