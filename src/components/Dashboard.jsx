import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
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
  Trash2,
  X,
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
  amber: { bar: "bg-amber-500", progress: "bg-amber-500" },
  primary: { bar: "bg-primary", progress: "bg-primary" },
  emerald: { bar: "bg-emerald-500", progress: "bg-emerald-500" },
  secondary: { bar: "bg-secondary", progress: "bg-secondary" },
};

const AssignmentCard = ({
  assignment,
  isCompleted,
  accentColor = "secondary",
  onUpdateStatus,
  onUpdateAssignment,
  onDeleteAssignment,
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentInput, setPaymentInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const paid = Number(assignment.paidAmount || 0);
  const total = Number(assignment.amount || 0);
  const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  const remaining = total - paid;

  const dateStr = assignment.eventStartDate || assignment.captureDate;
  const formattedDate = dateStr
    ? format(new Date(dateStr), "dd MMM yyyy")
    : "Date TBD";

  const accent =
    ACCENT[isCompleted ? "emerald" : accentColor] || ACCENT.secondary;

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate("/create-assignment", { state: { assignment } });
  };

  const handleShare = async (e) => {
    e.stopPropagation();
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

  const handleOpenPayment = (e) => {
    e.stopPropagation();
    setPaymentInput(assignment.paidAmount || "0");
    setShowPayment(true);
  };

  const handleSavePayment = async () => {
    await onUpdateAssignment(assignment._id, { paidAmount: paymentInput });
    setShowPayment(false);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    await onDeleteAssignment(assignment._id);
  };

  return (
    <div
      className={cn(
        "group relative w-full rounded-2xl cursor-pointer [perspective:1000px] transition-all duration-300",
        isExpanded ? "h-[320px] sm:h-[290px] col-span-full md:col-span-2" : "h-full min-h-[90px] sm:min-h-[100px]"
      )}
      onClick={() => !isExpanded && setIsExpanded(true)}
      onDoubleClick={() => isExpanded && setIsExpanded(false)}
    >
      <div
        className={cn(
          "w-full h-full grid transition-transform duration-500 [transform-style:preserve-3d]",
          isExpanded ? "[transform:rotateY(180deg)]" : ""
        )}
      >
        {/* ── Front Side ── */}
        <div className={cn(
          "[grid-area:1/1] [backface-visibility:hidden] bg-card rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden relative",
          isExpanded ? "z-0 pointer-events-none" : "z-20 pointer-events-auto"
        )}>
          <Camera size={85} className="absolute -bottom-4 -right-4 text-foreground/10 z-0 pointer-events-none -rotate-12" />
          <div className={cn("h-1 w-full shrink-0 z-10", accent.bar)} />
          <div className="p-2.5 sm:p-3 flex flex-col justify-center flex-1 z-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-2">
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <h3 className="font-bold text-foreground text-[12px] sm:text-[13px] leading-snug truncate transition-colors duration-200">
                  {assignment.title || assignment.packageName || "Photography Session"}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-[1px] flex items-center gap-1">
                  <Calendar size={9} className="shrink-0" />
                  <span className="truncate">{formattedDate}</span>
                </p>
              </div>
              <div className="shrink-0 sm:text-right mt-1 sm:mt-0">
                {isCompleted ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-bold tracking-wide">
                    DONE
                  </Badge>
                ) : (
                  <span className="text-[13px] sm:text-sm font-black text-foreground">
                    ₹{total.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Back Side ── */}
        <div className={cn(
          "[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] bg-card rounded-2xl border border-border flex flex-col shadow-lg overflow-hidden relative",
          isExpanded ? "z-20 pointer-events-auto" : "z-0 pointer-events-none"
        )}>
          <div className={cn("h-1 w-full shrink-0 opacity-40", accent.bar)} />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors z-10"
          >
            <X size={14} strokeWidth={3} />
          </button>

          <div className="p-3 flex flex-col flex-1 gap-2.5">
            <div className="pr-6">
              <h3 className="font-bold text-foreground text-[12px] leading-snug truncate">
                {assignment.title || assignment.packageName || "Photography Session"}
              </h3>
            </div>

            <p className="text-[11px] text-foreground font-medium border-l-2 pl-2 border-primary/40">
              Client: {assignment.clientName || "—"}
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-1.5">
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
            <div className="space-y-1 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Payment
                </span>
                <span className="text-[10px] font-bold text-foreground">
                  ₹{paid.toLocaleString()}
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    / ₹{total.toLocaleString()}
                  </span>
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    accent.progress,
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {pct}% paid
                </span>
                {remaining > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    ₹{remaining.toLocaleString()} due
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-3 border-t border-border/50 -mx-1"
              onClick={(e) => e.stopPropagation()}
            >
              {!isCompleted && (
                <ActionBtn
                  onClick={handleEdit}
                  icon={<Edit2 size={14} />}
                  label="Edit"
                />
              )}
              {!isCompleted && (
                <ActionBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirm(true);
                  }}
                  icon={<CheckCircle size={14} />}
                  label="Done"
                  className="text-secondary hover:bg-secondary/10 hover:text-secondary"
                />
              )}
              {!isCompleted && (
                <ActionBtn
                  onClick={handleOpenPayment}
                  icon={<IndianRupee size={14} />}
                  label="Pay"
                  className="hover:text-primary hover:bg-primary/10"
                />
              )}
              <div onClick={(e) => e.stopPropagation()}>
                <AssignmentPDFDialog assignment={assignment} />
              </div>
              <ActionBtn
                onClick={handleShare}
                icon={<ExternalLink size={14} />}
                label="Share"
              />
              <ActionBtn
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                icon={<Trash2 size={14} />}
                label="Delete"
                className="hover:text-destructive hover:bg-destructive/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Complete Confirm Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-xs rounded-2xl" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Mark as Complete?</DialogTitle>
            <DialogDescription>
              "{assignment.title || assignment.packageName || "This assignment"}
              " will be moved to completed.
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
        <DialogContent className="max-w-xs rounded-2xl" onClick={(e) => e.stopPropagation()}>
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
                className={cn(
                  "h-full rounded-full transition-all",
                  accent.progress,
                )}
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
      {/* Delete Confirm Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-xs rounded-2xl" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete Assignment?</DialogTitle>
            <DialogDescription>
              "{assignment.title || assignment.packageName || "This assignment"}
              " will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              <Trash2 size={13} className="mr-1.5" /> Delete
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
      className,
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
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-10 rounded-xl" />
        ))}
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
      from,
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
  ongoing: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    card: "amber",
  },
  upcoming: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    card: "primary",
  },
  past: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    card: "emerald",
  },
};

const DashboardSection = ({
  title,
  monthGroups,
  icon: Icon,
  sectionKey,
  ...handlers
}) => {
  const cfg = SECTION_CFG[sectionKey] || SECTION_CFG.ongoing;
  const monthKeys = Object.keys(monthGroups);
  const totalCount = monthKeys.reduce((acc, k) => acc + monthGroups[k].length, 0);

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className={cn("p-1.5 rounded-xl", cfg.iconBg)}>
          <Icon size={15} className={cfg.iconColor} />
        </div>
        <h2 className="text-sm font-bold text-foreground tracking-tight">
          {title}
        </h2>
        <span className="ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
          {totalCount}
        </span>
      </div>

      {totalCount > 0 ? (
        <div className="space-y-6 stagger-children">
          {monthKeys.map((month) => {
            const items = monthGroups[month];
            const count = items.length;
            
            // Dynamic grid logic based on count
            const gridClass = count === 1
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : count === 2
              ? "grid-cols-2 lg:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5";

            return (
            <div key={month} className="space-y-3">
              {month !== "Date TBD" && (
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">
                  {month}
                </h3>
              )}
              <div className={cn("grid gap-2 sm:gap-3", gridClass)}>
                {items.map((a) => (
                  <AssignmentCard
                    key={a._id}
                    assignment={a}
                    isCompleted={a.status === "Completed"}
                    accentColor={cfg.card}
                    {...handlers}
                  />
                ))}
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center justify-center border border-dashed rounded-2xl bg-muted/20 gap-2">
          <Icon size={26} className={cn("opacity-25", cfg.iconColor)} />
          <p className="text-xs text-muted-foreground">
            No {title.toLowerCase()}
          </p>
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
  onDeleteAssignment,
}) => {
  /* ── Stats ── */
  const totalCollected = assignments.reduce(
    (s, a) => s + Number(a.paidAmount || 0),
    0,
  );
  const totalPending = assignments
    .filter((a) => a.status !== "Completed")
    .reduce(
      (s, a) =>
        s + Math.max(0, Number(a.amount || 0) - Number(a.paidAmount || 0)),
      0,
    );
  const totalCount = assignments.length;

  /* ── Group ── */
  /* ── Group by Status -> Month ── */
  const categorized = { ongoing: {}, upcoming: {}, past: {} };

  const sortedAssignments = [...assignments].sort((a, b) => {
    const dA = new Date(a.eventStartDate || a.captureDate || a._creationTime);
    const dB = new Date(b.eventStartDate || b.captureDate || b._creationTime);
    return dB - dA;
  });

  sortedAssignments.forEach((a) => {
    const dStr = a.eventStartDate || a.captureDate;
    const d = dStr ? new Date(dStr) : null;
    const monthKey = d ? format(d, "MMMM yyyy") : "Date TBD";
    
    let sectionKey = "ongoing";
    if (a.status === "Completed") {
      sectionKey = "past";
    } else if (d) {
      if (isFuture(d) && !isSameMonth(d, new Date())) {
        sectionKey = "upcoming";
      } else if (d < new Date() && !isSameMonth(d, new Date())) {
        sectionKey = "past";
      }
    }

    if (!categorized[sectionKey][monthKey]) {
      categorized[sectionKey][monthKey] = [];
    }
    categorized[sectionKey][monthKey].push(a);
  });

  const pastCount = assignments.filter((a) => a.status === "Completed").length;

  const handlers = {
    onUpdateStatus,
    onUpdateCaptureDate,
    onUpdateAssignment,
    onDeleteAssignment,
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-load">
        {/* Stat strip skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
        {/* Section skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-36 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-28 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
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
          label="Assignments"
          value={totalCount}
          icon={Briefcase}
          from="from-primary/15 to-primary/5"
          iconColor="text-primary"
        />
        <StatCard
          label="Completed"
          value={pastCount}
          icon={CheckCircle}
          from="from-emerald-500/15 to-emerald-500/5"
          iconColor="text-emerald-500"
        />
      </div>

      {/* ── Sections Grouped by Status & Month ── */}
      <DashboardSection
        title="Ongoing"
        sectionKey="ongoing"
        monthGroups={categorized.ongoing}
        icon={PlayCircle}
        {...handlers}
      />
      <DashboardSection
        title="Upcoming"
        sectionKey="upcoming"
        monthGroups={categorized.upcoming}
        icon={Calendar}
        {...handlers}
      />
      <DashboardSection
        title="Past & Completed"
        sectionKey="past"
        monthGroups={categorized.past}
        icon={CheckCircle}
        {...handlers}
      />
    </div>
  );
};

export default Dashboard;
