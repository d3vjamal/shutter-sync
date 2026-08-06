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
import { Activity, Briefcase, Camera, ChevronDown, IndianRupee, TrendingUp } from "lucide-react";
import { format, startOfMonth, subMonths } from "date-fns";

const compactCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

function BusinessOverview({ assignments, freelanceJobs, payments, loading }) {
  const [showMobileInsights, setShowMobileInsights] = useState(false);
  const chartData = React.useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = startOfMonth(subMonths(new Date(), 5 - index));
      return {
        key: format(date, "yyyy-MM"),
        label: format(date, "MMM"),
        amount: 0,
      };
    });

    for (const payment of payments) {
      const date = new Date(payment.date || payment._creationTime);
      if (Number.isNaN(date.getTime())) continue;
      const month = months.find((item) => item.key === format(date, "yyyy-MM"));
      if (month) month.amount += Number(payment.amount || 0);
    }

    return months;
  }, [payments]);

  const totalCollected = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0,
  );
  const activeAssignments = assignments.filter((item) => item.status !== "Completed").length;
  const activeJobs = freelanceJobs.filter((item) => item.status !== "Completed").length;
  const maxAmount = Math.max(...chartData.map((item) => item.amount), 1);

  const metrics = [
    { label: "Active work", value: activeAssignments + activeJobs, icon: Activity, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    { label: "Assignments", value: assignments.length, icon: Camera, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
    { label: "Freelance jobs", value: freelanceJobs.length, icon: Briefcase, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  if (loading) {
    return <div className="max-w-5xl mx-auto mb-4 md:mb-6 h-24 md:h-64 rounded-3xl skeleton" />;
  }

  return (
    <section className="max-w-5xl mx-auto mb-4 md:mb-6 rounded-2xl md:rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 md:py-5">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <TrendingUp size={15} />
            <span className="text-[10px] font-black uppercase tracking-[0.16em]">Business overview</span>
          </div>
          <h1 className="hidden md:block text-lg font-black tracking-tight text-foreground">Work and earnings at a glance</h1>
          <p className="md:hidden text-[10px] text-muted-foreground">
            {activeAssignments + activeJobs} active · {assignments.length} assignments · {freelanceJobs.length} jobs
          </p>
        </div>
        <div className="flex items-center gap-2 text-right shrink-0">
          <span className="hidden sm:grid place-items-center h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <IndianRupee size={17} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total collected</p>
            <p className="text-lg font-black text-foreground">{compactCurrency.format(totalCollected)}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowMobileInsights((value) => !value)}
        className="md:hidden w-full flex items-center justify-center gap-2 border-t border-border px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring transition-colors duration-200"
        aria-expanded={showMobileInsights}
        aria-controls="mobile-business-insights"
      >
        {showMobileInsights ? "Hide earnings" : "View earnings"}
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-200 motion-reduce:transition-none", showMobileInsights && "rotate-180")}
        />
      </button>

      <div
        id="mobile-business-insights"
        className={cn(
          "md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] border-t border-border",
          showMobileInsights ? "grid" : "hidden",
        )}
      >
        <dl className="grid grid-cols-3 md:grid-cols-1 border-b md:border-b-0 md:border-r border-border">
          {metrics.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-2.5 px-3 sm:px-5 py-4 border-r last:border-r-0 md:border-r-0 md:border-b md:last:border-b-0 border-border">
              <span className={cn("grid place-items-center h-8 w-8 rounded-lg shrink-0", bg, color)}>
                <Icon size={15} />
              </span>
              <div>
                <dt className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</dt>
                <dd className="text-lg font-black text-foreground">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="px-4 sm:px-6 py-5 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-sm font-black text-foreground">Earnings trend</h2>
              <p className="text-[10px] text-muted-foreground">Payments received in the last six months</p>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">6 months</span>
          </div>

          <div className="h-32 flex items-end gap-2 sm:gap-3" role="img" aria-label="Six month earnings bar chart">
            {chartData.map((month) => {
              const height = month.amount > 0
                ? Math.max(8, Math.round((month.amount / maxAmount) * 100))
                : 3;
              return (
                <div key={month.key} className="group flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
                  <div className="relative w-full flex-1 flex items-end justify-center">
                    <div
                      className="w-full max-w-10 rounded-t-lg bg-primary/80 group-hover:bg-primary transition-colors duration-200 motion-reduce:transition-none"
                      style={{ height: `${height}%` }}
                      title={`${month.label}: ${compactCurrency.format(month.amount)}`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-foreground truncate">{month.amount ? compactCurrency.format(month.amount) : "₹0"}</p>
                    <p className="text-[9px] font-bold uppercase text-muted-foreground">{month.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

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

  const paymentsResult = useQuery(api.payments.listMine);
  const payments = paymentsResult || [];

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

      <BusinessOverview
        assignments={assignments}
        freelanceJobs={freelanceJobs}
        payments={payments}
        loading={isLoadingAssignments || isLoadingFreelance || paymentsResult === undefined}
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
