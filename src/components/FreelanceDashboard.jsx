import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
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
  X,
  Receipt,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-toastify";
import { format, isSameMonth, isBefore, startOfMonth } from "date-fns";
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
import FreelancePDFDialog from "./FreelancePDFDialog";
import PaymentTracker from "./PaymentTracker";
import { cn } from "../lib/utils";

// ─── Accent colours (same keys as Dashboard) ─────────────────────────────────

const ACCENT = {
  amber:    { bar: "bg-amber-500",   progress: "bg-amber-500",   text: "text-amber-600 dark:text-amber-400" },
  primary:  { bar: "bg-primary",     progress: "bg-primary",     text: "text-primary" },
  emerald:  { bar: "bg-emerald-500", progress: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  secondary:{ bar: "bg-secondary",   progress: "bg-secondary",   text: "text-secondary" },
};


// ─── Freelance Job Card ───────────────────────────────────────────────────────

const FreelanceJobCard = ({
  job,
  isCompleted,
  accentColor = "secondary",
  onUpdateStatus,
  onDeleteJob,
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm]           = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPayments, setShowPayments]           = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const accent = ACCENT[isCompleted ? "emerald" : accentColor] || ACCENT.secondary;

  const firstDate   = job.dates?.[0];
  const formattedDate = firstDate
    ? format(new Date(firstDate + "T00:00:00"), "dd MMM yyyy")
    : "Date TBD";

  const photoTotal    = Number(job.photographyAmount || 0);
  const photoReceived = Number(job.photographyReceived || 0);
  const photoDue      = Math.max(0, photoTotal - photoReceived);
  const videoTotal    = Number(job.videographyAmount || 0);
  const videoReceived = Number(job.videographyReceived || 0);
  const videoDue      = Math.max(0, videoTotal - videoReceived);
  const total = photoTotal + videoTotal;

  return (
    <div
      className={cn(
        "group relative w-full rounded-2xl cursor-pointer [perspective:1000px] transition-all duration-300",
        isExpanded ? "h-[360px] sm:h-[320px] col-span-full md:col-span-2" : "h-[74px] sm:h-[82px]"
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
          <Briefcase size={94} className="absolute -bottom-4 -right-4 text-foreground/10 z-0 pointer-events-none -rotate-12" />
          <div className={cn("h-1 w-full shrink-0 z-10", accent.bar)} />
          <div className="absolute top-3.5 right-3.5 z-30">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-highlight text-primary-foreground rounded-full text-[12px] font-black tracking-tight shadow-lg shadow-highlight/20 border border-primary/20">
              ₹{jobReceived(job).toLocaleString()}
            </div>
          </div>
          <div className="px-2.5 sm:px-3 flex flex-col justify-center flex-1 z-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-2">
              <div className="flex-1 min-w-0 w-full">
                <h3 className="font-bold text-foreground text-[12px] sm:text-[13px] leading-tight truncate transition-colors duration-200">
                  {job.studioName || "Unnamed Studio"}
                </h3>
                <div className="flex items-center gap-2.5 mt-[1px]">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar size={10} className="shrink-0" />
                    <span className="truncate">{formattedDate}</span>
                  </p>
                  {job.location && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin size={10} className="shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </p>
                  )}
                </div>
              </div>
              {isCompleted && (
                <div className="shrink-0 sm:text-right mt-1 sm:mt-0">
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-bold tracking-wide">
                    DONE
                  </Badge>
                </div>
              )}
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
                <FreelancePDFDialog job={job} />
              </div>
            </div>
              <div className="flex items-center gap-0.5">
                {!isCompleted && (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate("/create-freelance-assignment", { state: { job } }); }}
                    className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-600 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setShowPayments(true); }}
                  className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-600 transition-colors"
                  title="Payments"
                >
                  <Receipt size={14} />
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
                {job.studioName || "Unnamed Studio"}
              </h3>
              <p className={cn("text-[11px] font-bold uppercase tracking-[0.2em] opacity-90", accent.text)}>
                {job.studioOwnerName ? `Owner: ${job.studioOwnerName}` : "Freelance Assignment"}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 dark:bg-muted/10 p-2.5 rounded-xl border border-border/20">
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5 opacity-80">
                  <Calendar size={10} className="text-primary/60" /> Schedule
                </p>
                <p className="text-[12px] font-bold text-foreground">{formattedDate}</p>
                {job.dates?.length > 1 && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{job.dates.length} Days booked</p>
                )}
              </div>
              <div className="bg-muted/30 dark:bg-muted/10 p-2.5 rounded-xl border border-border/20">
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5 opacity-80">
                  <MapPin size={10} className="text-primary/60" /> Venue
                </p>
                <p className="text-[12px] font-bold text-foreground truncate">{job.location || "—"}</p>
                {job.venue && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium truncate">{job.venue}</p>
                )}
              </div>
            </div>

            {/* Service Specifics */}
            <div className="space-y-2.5">
              {photoTotal > 0 && (
                <div className="p-3 bg-background rounded-xl border border-border/20 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                      <Camera size={12} className="text-amber-500" /> Photography
                    </span>
                    <span className="text-[12px] font-bold text-foreground">₹{photoReceived.toLocaleString()} <span className="text-[10px] font-medium text-muted-foreground">/ ₹{photoTotal.toLocaleString()}</span></span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-700", accent.progress)} 
                      style={{ width: `${photoTotal > 0 ? Math.min(100, Math.round((photoReceived / photoTotal) * 100)) : 0}%` }} 
                    />
                  </div>
                  {(job.photographyFootageTypes || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.photographyFootageTypes.map(t => (
                        <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 bg-muted text-muted-foreground rounded uppercase tracking-tighter">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {job.hasVideography && videoTotal > 0 && (
                <div className="p-3 bg-background rounded-xl border border-border/20 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                      <Video size={12} className="text-primary" /> Videography
                    </span>
                    <span className="text-[12px] font-bold text-foreground">₹{videoReceived.toLocaleString()} <span className="text-[10px] font-medium text-muted-foreground">/ ₹{videoTotal.toLocaleString()}</span></span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-700" 
                      style={{ width: `${videoTotal > 0 ? Math.min(100, Math.round((videoReceived / videoTotal) * 100)) : 0}%` }} 
                    />
                  </div>
                  {(job.videographyFootageTypes || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.videographyFootageTypes.map(t => (
                        <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 bg-muted text-muted-foreground rounded uppercase tracking-tighter">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Summary Footer */}
            <div className="mt-auto pt-2 flex items-center justify-between border-t border-border/30 px-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase">Total Collected</span>
              <span className="text-[14px] font-black text-foreground">₹{(photoReceived + videoReceived).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mark Done confirm */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-xs rounded-2xl" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Mark as Complete?</DialogTitle>
            <DialogDescription>
              "{job.studioName}" will be moved to completed. You won't be able to edit it afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button
              onClick={() => { setShowConfirm(false); onUpdateStatus(job._id, "Completed"); }}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <CheckCircle size={13} className="mr-1.5" /> Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-xs rounded-2xl" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete this job?</DialogTitle>
            <DialogDescription>
              "{job.studioName}" will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => { setShowDeleteConfirm(false); onDeleteJob(job._id); }}
            >
              <Trash2 size={13} className="mr-1.5" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payments Tracker Dialog */}
      {showPayments && (
        <PaymentTracker
          parentId={job._id}
          parentType="freelance"
          title={job.studioName || "Freelance Job"}
          clientName={job.studioOwnerName || job.studioName}
          totalAmount={total}
          open={showPayments}
          onOpenChange={setShowPayments}
        />
      )}
    </div>
  );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="h-[74px] sm:h-[82px] bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col">
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

// ─── Stat card (matches Dashboard.jsx) ───────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, from, iconColor }) => (
  <div
    className={cn(
      "relative rounded-2xl p-5 overflow-hidden border border-border/40 shadow-sm",
      "bg-gradient-to-br", from
    )}
  >
    <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-2xl font-black text-foreground leading-tight">{value}</p>
    <div className={cn("absolute right-3 bottom-2 opacity-10", iconColor)}>
      <Icon size={42} />
    </div>
  </div>
);

// ─── Section config (same keys as Dashboard) ─────────────────────────────────

const SECTION_CFG = {
  ongoing:  { iconBg: "bg-amber-500/10",   iconColor: "text-amber-500",   card: "amber"   },
  upcoming: { iconBg: "bg-primary/10",     iconColor: "text-primary",     card: "primary" },
  past:     { iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500", card: "emerald" },
};

// ─── Section component ────────────────────────────────────────────────────────

const FreelanceSection = ({ 
  title, 
  monthGroups, 
  icon: Icon, 
  sectionKey, 
  onUpdateStatus, 
  onDeleteJob,
  onSync,
  isSyncing
}) => {
  const cfg = SECTION_CFG[sectionKey] || SECTION_CFG.ongoing;
  const monthKeys = Object.keys(monthGroups);
  const totalCount = monthKeys.reduce((acc, k) => acc + monthGroups[k].length, 0);

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4 group/section">
        <div className={cn("p-1.5 rounded-xl", cfg.iconBg)}>
          <Icon size={15} className={cfg.iconColor} />
        </div>
        <h2 className="text-sm font-bold text-foreground tracking-tight">{title}</h2>
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
                {items.map((job) => (
                  <FreelanceJobCard
                    key={job._id}
                    job={job}
                    isCompleted={job.status === "Completed"}
                    accentColor={cfg.card}
                    onUpdateStatus={onUpdateStatus}
                    onDeleteJob={onDeleteJob}
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
          <p className="text-xs text-muted-foreground">No {title.toLowerCase()}</p>
        </div>
      )}
    </section>
  );
};

// ─── Section Filter Tab Bar ───────────────────────────────────────────────────

const TABS = [
  { key: "ongoing",  label: "Ongoing",   icon: PlayCircle,  activeClass: "bg-amber-500 text-white",   countClass: "bg-amber-400/30 text-white" },
  { key: "upcoming", label: "Upcoming",  icon: Clock,       activeClass: "bg-primary text-primary-foreground",  countClass: "bg-primary-foreground/20 text-primary-foreground" },
  { key: "past",     label: "Completed", icon: CheckCircle, activeClass: "bg-emerald-500 text-white", countClass: "bg-emerald-400/30 text-white" },
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

// ─── Dashboard Component ─────────────────────────────────────────────────────

const FreelanceDashboard = ({ freelanceJobs = [], loading = false, onUpdateStatus, onDeleteJob }) => {
  const migratePayments = useMutation(api.payments.migrateLegacyPayments);
  const [isMigrating, setIsMigrating] = useState(false);
  const [activeSection, setActiveSection] = useState("ongoing");

  const handleRepair = async () => {
    setIsMigrating(true);
    try {
      const res = await migratePayments();
      toast.success(`Success! Sync complete.`);
    } catch (err) {
      console.error(err);
      toast.error("Sync failed");
    } finally {
      setIsMigrating(false);
    }
  };

  // ── Group by Status & Month (order & logic unchanged) ────────────────────────
  const categorized = { ongoing: {}, upcoming: {}, past: {} };
  const now = new Date();
  const currentMonthStart = startOfMonth(now);

  const sortedJobs = [...freelanceJobs].sort((a, b) => {
    const dA = new Date((a.dates?.[0] || "") + "T00:00:00");
    const dB = new Date((b.dates?.[0] || "") + "T00:00:00");
    const timeA = a.dates?.length ? dA.getTime() : a._creationTime;
    const timeB = b.dates?.length ? dB.getTime() : b._creationTime;
    return timeB - timeA;
  });

  sortedJobs.forEach((job) => {
    const first = job.dates?.[0];
    const monthDate = first ? new Date(first + "T00:00:00") : null;
    const monthKey = monthDate ? format(monthDate, "MMMM yyyy") : "Date TBD";
    
    let sectionKey = "ongoing";
    if (job.status === "Completed") {
      sectionKey = "past";
    } else if (monthDate) {
      if (isSameMonth(monthDate, now)) {
        sectionKey = "ongoing";
      } else if (isBefore(monthDate, currentMonthStart)) {
        sectionKey = "ongoing";
      } else {
        sectionKey = "upcoming";
      }
    }

    if (!categorized[sectionKey][monthKey]) {
      categorized[sectionKey][monthKey] = [];
    }
    categorized[sectionKey][monthKey].push(job);
  });

  const sectionCounts = {
    ongoing:  Object.values(categorized.ongoing).flat().length,
    upcoming: Object.values(categorized.upcoming).flat().length,
    past:     Object.values(categorized.past).flat().length,
  };

  const pastCount = sectionCounts.past;

  // ── Stats ───────────────────────────────────────────────────────────────────
  const jobTotal = (j) =>
    Number(j.photographyAmount || j.photographerAmount || 0) + 
    Number(j.videographyAmount || j.videographerAmount || 0);
    
  const jobReceived = (j) =>
    Number(j.photographyReceived || 0) + 
    Number(j.videographyReceived || 0);

  const totalEarnings   = freelanceJobs.reduce((s, j) => s + jobTotal(j), 0);
  const pendingEarnings = freelanceJobs
    .filter((j) => j.status !== "Completed")
    .reduce((s, j) => s + Math.max(0, jobTotal(j) - jobReceived(j)), 0);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-load">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-22 rounded-2xl" />)}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="flex-1 h-10 rounded-xl" />)}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-36 rounded-xl" />
          <div className="grid grid-cols-2 gap-2">
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const SECTION_ICON  = { ongoing: PlayCircle, upcoming: Clock, past: CheckCircle };
  const SECTION_TITLE = { ongoing: "Ongoing",  upcoming: "Upcoming", past: "Past & Completed" };

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-4 animate-load">
      {/* ── Stat strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
        <StatCard
          label="Total Earnings"
          value={`₹${totalEarnings.toLocaleString()}`}
          icon={IndianRupee}
          from="from-secondary/20 to-secondary/5"
          iconColor="text-secondary"
        />
        <StatCard
          label="Pending"
          value={`₹${pendingEarnings.toLocaleString()}`}
          icon={Wallet}
          from="from-primary/10 to-primary/5"
          iconColor="text-primary"
        />
        <StatCard
          label="Total Jobs"
          value={freelanceJobs.length}
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

      {/* ── Sticky Filter Tab Bar ── */}
      <SectionTabBar
        activeTab={activeSection}
        counts={sectionCounts}
        onChange={setActiveSection}
      />

      {/* ── Active Section Content ── */}
      <FreelanceSection
        key={activeSection}
        title={SECTION_TITLE[activeSection]}
        sectionKey={activeSection}
        monthGroups={categorized[activeSection]}
        icon={SECTION_ICON[activeSection]}
        onUpdateStatus={onUpdateStatus}
        onDeleteJob={onDeleteJob}
        onSync={activeSection !== "past" ? handleRepair : undefined}
        isSyncing={isMigrating}
      />
    </div>
  );
};

export default FreelanceDashboard;
