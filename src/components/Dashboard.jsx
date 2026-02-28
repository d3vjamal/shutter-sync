import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlayCircle,
  CheckCircle,
  Calendar,
  Edit2,
  ExternalLink,
  IndianRupee,
  MapPin,
  Building2,
  Briefcase,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { isFuture, isSameMonth, format } from "date-fns";
import AssignmentPDFDialog from "./AssignmentPDFDialog";

// ─── Assignment Card ──────────────────────────────────────────────────────────

const ACCENT = {
  amber:   { bar: "bg-amber-500",   progress: "bg-amber-500"   },
  primary: { bar: "bg-primary",     progress: "bg-primary"     },
  emerald: { bar: "bg-emerald-500", progress: "bg-emerald-500" },
  secondary:{ bar: "bg-secondary",  progress: "bg-secondary"   },
};

const AssignmentCard = ({
  assignment,
  isCompleted,
  accentColor = "secondary",
  onUpdateStatus,
  onUpdateAssignment,
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentInput, setPaymentInput] = useState("");

  const paid  = Number(assignment.paidAmount || 0);
  const total = Number(assignment.amount || 0);
  const pct       = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  const remaining = total - paid;

  const dateStr      = assignment.eventStartDate || assignment.captureDate;
  const formattedDate = dateStr
    ? format(new Date(dateStr), "dd MMM yyyy")
    : "Date TBD";

  const accent = ACCENT[isCompleted ? "emerald" : accentColor] || ACCENT.secondary;

  const handleEdit  = () => navigate("/create-assignment", { state: { assignment } });

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/client/${assignment._id}`;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      } else {
        window.open(url, "_blank");
      }
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleConfirmComplete = async () => {
    setShowConfirm(false);
    await onUpdateStatus(assignment._id, "Completed");
  };

  const handleOpenPayment = () => {
    setPaymentInput(assignment.paidAmount || "0");
    setShowPayment(true);
  };

  const handleSavePayment = async () => {
    await onUpdateAssignment(assignment._id, { paidAmount: paymentInput });
    setShowPayment(false);
  };

  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full">
      {/* Top accent bar */}
      <div className={cn("h-1 w-full shrink-0", accent.bar)} />

      <div className="p-4 flex flex-col flex-1 gap-3">

        {/* Header: title + amount/status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-sm leading-snug truncate group-hover:text-primary transition-colors duration-200">
              {assignment.title || assignment.packageName || "Photography Session"}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {assignment.clientName || "—"}
            </p>
          </div>
          <div className="shrink-0 text-right">
            {isCompleted ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-bold tracking-wide">
                DONE
              </Badge>
            ) : (
              <span className="text-base font-black text-foreground">
                ₹{total.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">
            <Calendar size={9} />
            {formattedDate}
          </span>
          {assignment.venue && (
            <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full max-w-[130px]">
              <Building2 size={9} className="shrink-0" />
              <span className="truncate">{assignment.venue}</span>
            </span>
          )}
          {assignment.location && (
            <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full max-w-[130px]">
              <MapPin size={9} className="shrink-0" />
              <span className="truncate">{assignment.location}</span>
            </span>
          )}
        </div>

        {/* Payment progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Payment
            </span>
            <span className="text-[10px] font-bold text-foreground">
              ₹{paid.toLocaleString()}
              <span className="font-normal text-muted-foreground"> / ₹{total.toLocaleString()}</span>
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", accent.progress)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">{pct}% paid</span>
            {remaining > 0 && (
              <span className="text-[10px] text-muted-foreground">
                ₹{remaining.toLocaleString()} due
              </span>
            )}
          </div>
        </div>

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center justify-around pt-3 border-t border-border/50 -mx-1">
          <ActionBtn onClick={handleEdit} icon={<Edit2 size={14} />} label="Edit" />
          {!isCompleted && (
            <ActionBtn
              onClick={() => setShowConfirm(true)}
              icon={<CheckCircle size={14} />}
              label="Done"
              className="text-secondary hover:bg-secondary/10 hover:text-secondary"
            />
          )}
          <ActionBtn
            onClick={handleOpenPayment}
            icon={<IndianRupee size={14} />}
            label="Pay"
            className="hover:text-primary hover:bg-primary/10"
          />
          <AssignmentPDFDialog assignment={assignment} />
          <ActionBtn onClick={handleShare} icon={<ExternalLink size={14} />} label="Share" />
        </div>
      </div>

      {/* Complete Confirm Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-xs rounded-2xl">
          <DialogHeader>
            <DialogTitle>Mark as Complete?</DialogTitle>
            <DialogDescription>
              "{assignment.title || assignment.packageName || "This assignment"}" will be moved to completed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmComplete}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <CheckCircle size={13} className="mr-1.5" /> Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-xs rounded-2xl">
          <DialogHeader>
            <DialogTitle>Update Payment</DialogTitle>
            <DialogDescription>
              Total:{" "}
              <span className="font-bold text-foreground">
                ₹{total.toLocaleString()}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-1 space-y-3">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", accent.progress)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Amount Received (₹)
              </label>
              <Input
                type="number"
                min="0"
                value={paymentInput}
                onChange={(e) => setPaymentInput(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPayment(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSavePayment}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <IndianRupee size={13} className="mr-1" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Small icon-button used in card actions
const ActionBtn = ({ onClick, icon, label, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl",
      "text-muted-foreground hover:bg-muted transition-colors duration-150",
      className
    )}
  >
    {icon}
    <span className="text-[10px] font-semibold">{label}</span>
  </button>
);

// ─── Skeleton card (shown while loading) ─────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col">
    <Skeleton className="h-1 w-full rounded-none" />
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
        <Skeleton className="h-5 w-14 shrink-0" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-4 w-24 rounded-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
      <div className="flex justify-around pt-3 border-t border-border/50">
        {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-8 w-10 rounded-xl" />)}
      </div>
    </div>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, from, iconColor }) => (
  <div
    className={cn(
      "relative rounded-2xl p-4 overflow-hidden border border-border/40 shadow-sm",
      "bg-gradient-to-br",
      from
    )}
  >
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-xl font-black text-foreground leading-tight">{value}</p>
    <div className={cn("absolute right-3 bottom-2 opacity-10", iconColor)}>
      <Icon size={38} />
    </div>
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────

const SECTION_CFG = {
  ongoing:  { iconBg: "bg-amber-500/10",   iconColor: "text-amber-500",   card: "amber"   },
  upcoming: { iconBg: "bg-primary/10",     iconColor: "text-primary",     card: "primary" },
  past:     { iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500", card: "emerald" },
};

const DashboardSection = ({ title, assignments, icon: Icon, sectionKey, ...handlers }) => {
  const cfg = SECTION_CFG[sectionKey] || SECTION_CFG.ongoing;

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className={cn("p-1.5 rounded-xl", cfg.iconBg)}>
          <Icon size={15} className={cfg.iconColor} />
        </div>
        <h2 className="text-sm font-bold text-foreground tracking-tight">{title}</h2>
        <span className="ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
          {assignments.length}
        </span>
      </div>

      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
          {assignments.map((a) => (
            <AssignmentCard
              key={a._id}
              assignment={a}
              isCompleted={a.status === "Completed"}
              accentColor={cfg.card}
              {...handlers}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center justify-center border border-dashed rounded-2xl bg-muted/20 gap-2">
          <Icon size={26} className={cn("opacity-25", cfg.iconColor)} />
          <p className="text-xs text-muted-foreground">No {title.toLowerCase()}</p>
        </div>
      )}
    </section>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = ({
  assignments = [],
  loading = false,
  onViewChange,
  onUpdateStatus,
  onUpdateCaptureDate,
  onUpdateAssignment,
}) => {
  /* ── Stats ── */
  const totalCollected = assignments.reduce(
    (s, a) => s + Number(a.paidAmount || 0),
    0
  );
  const totalPending = assignments
    .filter((a) => a.status !== "Completed")
    .reduce((s, a) => s + Math.max(0, Number(a.amount || 0) - Number(a.paidAmount || 0)), 0);
  const totalCount = assignments.length;

  /* ── Group ── */
  const now = new Date();
  const ongoing = [], upcoming = [], past = [];

  assignments.forEach((a) => {
    if (a.status === "Completed") {
      past.push(a);
    } else {
      const d = a.eventStartDate || a.captureDate;
      if (d && isFuture(new Date(d)) && !isSameMonth(new Date(d), now)) {
        upcoming.push(a);
      } else {
        ongoing.push(a);
      }
    }
  });

  const byDate = (a, b) =>
    new Date(a.eventStartDate || a.captureDate) -
    new Date(b.eventStartDate || b.captureDate);
  ongoing.sort(byDate);
  upcoming.sort(byDate);
  past.sort((a, b) => b._creationTime - a._creationTime);

  const handlers = { onUpdateStatus, onUpdateCaptureDate, onUpdateAssignment };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-load">
        {/* Stat strip skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
        {/* Section skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-36 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-28 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1,2].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-load">

      {/* ── Stat strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
        <StatCard
          label="Collected"
          value={`₹${totalCollected.toLocaleString()}`}
          icon={IndianRupee}
          from="from-secondary/20 to-secondary/5"
          iconColor="text-secondary"
        />
        <StatCard
          label="Pending"
          value={`₹${totalPending.toLocaleString()}`}
          icon={Wallet}
          from="from-primary/10 to-primary/5"
          iconColor="text-primary"
        />
        <StatCard
          label="Total Jobs"
          value={totalCount}
          icon={Briefcase}
          from="from-primary/15 to-primary/5"
          iconColor="text-primary"
        />
        <StatCard
          label="Completed"
          value={past.length}
          icon={CheckCircle}
          from="from-emerald-500/15 to-emerald-500/5"
          iconColor="text-emerald-500"
        />
      </div>

      {/* ── Sections ── */}
      <DashboardSection
        title="In Progress"
        sectionKey="ongoing"
        assignments={ongoing}
        icon={PlayCircle}
        {...handlers}
      />
      <DashboardSection
        title="Upcoming"
        sectionKey="upcoming"
        assignments={upcoming}
        icon={Calendar}
        {...handlers}
      />
      <DashboardSection
        title="Past Assignments"
        sectionKey="past"
        assignments={past}
        icon={CheckCircle}
        {...handlers}
      />
    </div>
  );
};

export default Dashboard;
