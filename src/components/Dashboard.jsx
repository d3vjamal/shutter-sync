import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlayCircle,
  CheckCircle,
  Calendar,
  Edit2,
  ExternalLink,
  MapPin,
  Trash2,
  X,
  Receipt,
  Aperture,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
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
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { isFuture, isSameMonth, format } from "date-fns";
import AssignmentPDFDialog from "./AssignmentPDFDialog";
import PaymentTracker from "./PaymentTracker";

// ─── Assignment Card ──────────────────────────────────────────────────────────

const ACCENT = {
  amber: {
    bar: "bg-amber-500",
    progress: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-400 text-amber-950 border-amber-300 shadow-amber-500/20",
  },
  primary: {
    bar: "bg-primary",
    progress: "bg-primary",
    text: "text-primary",
    badge: "bg-violet-600 text-violet-50 border-violet-500 shadow-violet-600/25",
  },
  emerald: {
    bar: "bg-emerald-500",
    progress: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-600 text-emerald-50 border-emerald-500 shadow-emerald-600/20",
  },
  secondary: {
    bar: "bg-secondary",
    progress: "bg-secondary",
    text: "text-secondary",
    badge: "bg-secondary text-secondary-foreground border-secondary/80 shadow-secondary/20",
  },
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
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

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    await onDeleteAssignment(assignment._id);
  };

  return (
    <div
      className={cn(
        "group relative w-full rounded-2xl cursor-pointer [perspective:1000px] transition-[transform,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none",
        !isExpanded && "hover:-translate-y-0.5 hover:shadow-md",
        isExpanded ? "h-[340px] sm:h-[300px] col-span-full md:col-span-2" : "h-[92px] sm:h-[96px]"
      )}
      onClick={() => !isExpanded && setIsExpanded(true)}
      onDoubleClick={() => isExpanded && setIsExpanded(false)}
      onKeyDown={(event) => {
        if (!isExpanded && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          setIsExpanded(true);
        }
      }}
      role={!isExpanded ? "button" : undefined}
      tabIndex={!isExpanded ? 0 : -1}
      aria-expanded={isExpanded}
      aria-label={!isExpanded ? `View ${assignment.clientName || assignment.title || "assignment"} details` : undefined}
    >
      <div
        className={cn(
          "w-full h-full grid transition-transform duration-300 ease-out [transform-style:preserve-3d] motion-reduce:transition-none",
          isExpanded ? "[transform:rotateY(180deg)]" : ""
        )}
      >
        {/* ── Front Side ── */}
        <div className={cn(
          "[grid-area:1/1] [backface-visibility:hidden] bg-card rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden relative",
          isExpanded ? "z-0 pointer-events-none" : "z-20 pointer-events-auto"
        )}>
          <div className={cn("h-1 w-full shrink-0 z-10", accent.bar)} />
          <div className="px-3 flex items-center gap-2.5 flex-1 z-10 min-w-0">
            <div className={cn(
              "relative h-10 w-10 rounded-xl shrink-0 grid place-items-center border",
              "shadow-md transition-transform duration-200 group-hover:rotate-3 group-hover:scale-105 motion-reduce:transform-none",
              accent.badge,
            )}>
              <Aperture size={19} strokeWidth={2.2} className="relative" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-extrabold text-foreground text-[12px] sm:text-[13px] leading-tight truncate">
                  {assignment.clientName || assignment.title || "Client Session"}
                </h3>
                <span className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black tracking-wide",
                  pct === 100
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground",
                )}>
                  {pct === 100 ? "PAID" : `${pct}%`}
                </span>
              </div>
              <p className={cn("mt-0.5 text-[9px] font-black uppercase tracking-[0.14em] truncate", accent.text)}>
                {assignment.title || assignment.packageName || "Photography Session"}
              </p>
              <div className="flex items-center gap-2.5 mt-1">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar size={10} className="shrink-0" />
                    <span className="truncate">{formattedDate}</span>
                  </p>
                  {assignment.location && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin size={10} className="shrink-0" />
                      <span className="truncate">{assignment.location}</span>
                    </p>
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

          <div className="px-3 pt-3 flex items-center justify-between border-b border-border/50 pb-2 bg-muted/30">
            <div className="flex items-center gap-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1.5 py-0.5 bg-background rounded-sm border border-border/50">
                Details
              </h4>
              <div className="flex items-center">
                <AssignmentPDFDialog assignment={assignment} />
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={(e) => { e.stopPropagation(); setShowPayments(true); }}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                title="Payments"
              >
                <Receipt size={14} />
              </button>
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-600 transition-colors"
                title="Edit"
              >
                <Edit2 size={14} />
              </button>
              {!isCompleted && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                  className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-600 transition-colors"
                  title="Mark Complete"
                >
                  <CheckCircle size={14} />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors ml-1"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="p-3.5 flex flex-col flex-1 gap-3.5 overflow-y-auto">
            {/* Header info */}
            <div>
              <h3 className="font-extrabold text-foreground text-[18px] leading-tight mb-0.5">
                {assignment.clientName || "Unnamed Client"}
              </h3>
              <p className={cn("text-[11px] font-bold uppercase tracking-[0.2em] opacity-90", accent.text)}>
                {assignment.title || assignment.packageName || "Photography Session"}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 dark:bg-muted/10 p-2.5 rounded-xl border border-border/20">
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5 opacity-80">
                  <Calendar size={10} className="text-primary/60" /> Date
                </p>
                <p className="text-[12px] font-bold text-foreground">{formattedDate}</p>
                {assignment.captureTime && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{assignment.captureTime}</p>
                )}
              </div>
              <div className="bg-muted/30 dark:bg-muted/10 p-2.5 rounded-xl border border-border/20">
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5 opacity-80">
                  <MapPin size={10} className="text-primary/60" /> Location
                </p>
                <p className="text-[12px] font-bold text-foreground truncate">{assignment.location || "—"}</p>
                {assignment.venue && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium truncate">{assignment.venue}</p>
                )}
              </div>
            </div>

            {/* Additional Details row */}
            <div className="space-y-3">
              {assignment.contactNumber && (
                <div className="flex items-center justify-between p-2.5 bg-background rounded-xl border border-border/20 shadow-sm">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Contact</span>
                  <span className="text-[12px] font-mono font-bold text-primary">{assignment.contactNumber}</span>
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className="space-y-2.5 pt-1 border-t border-border/10">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground">Payments</span>
                <span className="text-[14px] font-black text-foreground">
                  ₹{paid.toLocaleString()} <span className="text-[11px] font-bold text-muted-foreground">/ ₹{total.toLocaleString()}</span>
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner flex items-center p-[2px]">
                  <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", accent.progress, "shadow-[0_0_8px_rgba(0,0,0,0.1)]")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", pct === 100 ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground")}>
                    {pct === 100 ? "FULLY SETTLED" : `${pct}% COLLECTED`}
                  </span>
                  {remaining > 0 && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded-full">
                      ₹{remaining.toLocaleString()} DUE
                    </span>
                  )}
                </div>
              </div>
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

      {/* Payments Tracker Dialog */}
      {showPayments && (
        <PaymentTracker
          parentId={assignment._id}
          parentType="assignment"
          title={assignment.title || assignment.packageName || "Photography Session"}
          clientName={assignment.clientName}
          totalAmount={total}
          open={showPayments}
          onOpenChange={setShowPayments}
        />
      )}
    </div>
  );
};


// ─── Skeleton card (shown while loading) ─────────────────────────────────────

const SkeletonCard = () => (
  <div className="h-[92px] sm:h-[96px] bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col">
    <Skeleton className="h-1 w-full rounded-none" />
    <div className="px-3 flex flex-col justify-center flex-1 gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
        <Skeleton className="h-6 w-14 shrink-0 rounded-lg" />
      </div>
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
  onSync,
  isSyncing,
  ...handlers
}) => {
  const cfg = SECTION_CFG[sectionKey] || SECTION_CFG.ongoing;
  const monthKeys = Object.keys(monthGroups);
  const totalCount = monthKeys.reduce((acc, k) => acc + monthGroups[k].length, 0);

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4 group/section">
        <div className={cn("p-1.5 rounded-xl", cfg.iconBg)}>
          <Icon size={15} className={cfg.iconColor} />
        </div>
        <h2 className="text-sm font-bold text-foreground tracking-tight">
          {title}
        </h2>
        {(sectionKey === "ongoing" || sectionKey === "upcoming") && onSync && (
          <Button 
            onClick={(e) => { e.stopPropagation(); onSync(); }} 
            disabled={isSyncing}
            variant="ghost"
            size="sm"
            className="h-7 px-2 ml-1 flex items-center gap-1.5 rounded-lg border border-dashed border-primary/20 hover:border-primary hover:bg-primary/5 transition-all text-primary group"
          >
            <Loader2 className={cn("text-primary", isSyncing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500")} size={12} />
            <span className="text-[10px] font-black uppercase tracking-[0.1em]">Sync</span>
          </Button>
        )}
        <span className="ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground mr-1">
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

// ─── Section Filter Tab Bar ───────────────────────────────────────────────────

const TABS = [
  { key: "ongoing",  label: "Ongoing",   icon: PlayCircle,  activeClass: "bg-amber-500 text-white",    countClass: "bg-amber-400/30 text-white" },
  { key: "upcoming", label: "Upcoming",  icon: Calendar,    activeClass: "bg-primary text-primary-foreground",   countClass: "bg-primary-foreground/20 text-primary-foreground" },
  { key: "past",     label: "Completed", icon: CheckCircle, activeClass: "bg-emerald-500 text-white",  countClass: "bg-emerald-400/30 text-white" },
];

const SectionTabBar = ({ activeTab, counts, onChange }) => (
  <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl pt-1 pb-2 -mx-4 px-4">
    <div className="flex gap-2">
      {TABS.map(({ key, label, icon: Icon, activeClass, countClass }) => {
        const isActive = activeTab === key;
        const count = counts[key] ?? 0;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200",
              isActive
                ? activeClass + " shadow-md"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon size={12} />
            <span className="hidden xs:inline">{label}</span>
            <span
              className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                isActive ? countClass : "bg-background/50 text-muted-foreground"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

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
  const migratePayments = useMutation(api.payments.migrateLegacyPayments);
  const [isMigrating, setIsMigrating] = useState(false);
  const [activeSection, setActiveSection] = useState("ongoing");

  const handleRepair = async () => {
    setIsMigrating(true);
    try {
      const res = await migratePayments();
      const assignmentLabel = res.assignments === 1 ? "assignment" : "assignments";
      const jobLabel = res.jobs === 1 ? "job" : "jobs";
      toast.success(`Reconciled ${res.assignments} ${assignmentLabel} and ${res.jobs} ${jobLabel}.`);
    } catch (err) {
      console.error(err);
      toast.error("Migration failed");
    } finally {
      setIsMigrating(false);
    }
  };

  /* ── Group by Status -> Month (order & logic unchanged) ── */
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
      } else {
        sectionKey = "ongoing";
      }
    }

    if (!categorized[sectionKey][monthKey]) {
      categorized[sectionKey][monthKey] = [];
    }
    categorized[sectionKey][monthKey].push(a);
  });

  const sectionCounts = {
    ongoing:  Object.values(categorized.ongoing).flat().length,
    upcoming: Object.values(categorized.upcoming).flat().length,
    past:     Object.values(categorized.past).flat().length,
  };

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
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="flex-1 h-10 rounded-xl" />)}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-36 rounded-xl" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const SECTION_ICON = { ongoing: PlayCircle, upcoming: Calendar, past: CheckCircle };
  const SECTION_TITLE = { ongoing: "Ongoing", upcoming: "Upcoming", past: "Past & Completed" };

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-4 animate-load">
      {/* ── Sticky Filter Tab Bar ── */}
      <SectionTabBar
        activeTab={activeSection}
        counts={sectionCounts}
        onChange={setActiveSection}
      />

      {/* ── Active Section Content ── */}
      <DashboardSection
        key={activeSection}
        title={SECTION_TITLE[activeSection]}
        sectionKey={activeSection}
        monthGroups={categorized[activeSection]}
        icon={SECTION_ICON[activeSection]}
        onSync={activeSection !== "past" ? handleRepair : undefined}
        isSyncing={isMigrating}
        {...handlers}
      />
    </div>
  );
};

export default Dashboard;
