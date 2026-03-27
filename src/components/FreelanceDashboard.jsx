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
} from "lucide-react";
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
import { cn } from "../lib/utils";

// ─── Accent colours (same keys as Dashboard) ─────────────────────────────────

const ACCENT = {
  amber:    { bar: "bg-amber-500",   progress: "bg-amber-500"   },
  primary:  { bar: "bg-primary",     progress: "bg-primary"     },
  emerald:  { bar: "bg-emerald-500", progress: "bg-emerald-500" },
  secondary:{ bar: "bg-secondary",   progress: "bg-secondary"   },
};

// ─── Small icon-button (shared with Dashboard) ────────────────────────────────

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
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full">
      {/* Top accent bar */}
      <div className={cn("h-1 w-full shrink-0", accent.bar)} />

      <div className="p-4 flex flex-col flex-1 gap-3">

        {/* Header: studio name + amount/status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-sm leading-snug truncate group-hover:text-primary transition-colors duration-200">
              {job.studioName}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {job.studioOwnerName}
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
          {job.venue && (
            <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full max-w-[130px]">
              <Building2 size={9} className="shrink-0" />
              <span className="truncate">{job.venue}</span>
            </span>
          )}
          {job.location && (
            <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full max-w-[130px]">
              <MapPin size={9} className="shrink-0" />
              <span className="truncate">{job.location}</span>
            </span>
          )}
          {job.photographerName && (
            <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full max-w-[130px]">
              <Camera size={9} className="shrink-0" />
              <span className="truncate">{job.photographerName}</span>
            </span>
          )}
        </div>

        {/* Photography payment row */}
        {photoTotal > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                <Camera size={9} /> Photo
              </span>
              <span className="text-[10px] font-bold text-foreground">
                ₹{photoReceived.toLocaleString()}
                <span className="font-normal text-muted-foreground"> / ₹{photoTotal.toLocaleString()}</span>
                {photoDue > 0 && <span className="text-amber-500 ml-1">· ₹{photoDue.toLocaleString()} due</span>}
              </span>
            </div>
            {(job.photographyFootageTypes || []).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {job.photographyFootageTypes.map((t) => (
                  <span key={t} className="bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Videography payment row */}
        {job.hasVideography && videoTotal > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                <Video size={9} /> Video
              </span>
              <span className="text-[10px] font-bold text-foreground">
                ₹{videoReceived.toLocaleString()}
                <span className="font-normal text-muted-foreground"> / ₹{videoTotal.toLocaleString()}</span>
                {videoDue > 0 && <span className="text-amber-500 ml-1">· ₹{videoDue.toLocaleString()} due</span>}
              </span>
            </div>
            {(job.videographyFootageTypes || []).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {job.videographyFootageTypes.map((t) => (
                  <span key={t} className="bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center justify-around pt-3 border-t border-border/50 -mx-1">
          {isCompleted ? (
            /* Completed: PDF only — no edit, no delete */
            <FreelancePDFDialog job={job} />
          ) : (
            <>
              <ActionBtn
                onClick={() => navigate("/create-freelance-assignment", { state: { job } })}
                icon={<Edit2 size={14} />}
                label="Edit"
              />
              <ActionBtn
                onClick={() => setShowConfirm(true)}
                icon={<CheckCircle size={14} />}
                label="Done"
                className="text-secondary hover:bg-secondary/10 hover:text-secondary"
              />
              <FreelancePDFDialog job={job} />
              <ActionBtn
                onClick={() => setShowDeleteConfirm(true)}
                icon={<Trash2 size={14} />}
                label="Delete"
                className="hover:text-destructive hover:bg-destructive/10"
              />
            </>
          )}
        </div>
      </div>

      {/* Mark Done confirm */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-xs rounded-2xl">
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
        <DialogContent className="max-w-xs rounded-2xl">
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
    </div>
  );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

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
      </div>
      <div className="flex justify-around pt-3 border-t border-border/50">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-8 w-10 rounded-xl" />)}
      </div>
    </div>
  </div>
);

// ─── Stat card (matches Dashboard.jsx) ───────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, from, iconColor }) => (
  <div
    className={cn(
      "relative rounded-2xl p-4 overflow-hidden border border-border/40 shadow-sm",
      "bg-gradient-to-br", from
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

// ─── Section config (same keys as Dashboard) ─────────────────────────────────

const SECTION_CFG = {
  ongoing:  { iconBg: "bg-amber-500/10",   iconColor: "text-amber-500",   card: "amber"   },
  upcoming: { iconBg: "bg-primary/10",     iconColor: "text-primary",     card: "primary" },
  past:     { iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500", card: "emerald" },
};

// ─── Section component ────────────────────────────────────────────────────────

const FreelanceSection = ({ title, jobs, icon: Icon, sectionKey, onUpdateStatus, onDeleteJob }) => {
  const cfg = SECTION_CFG[sectionKey] || SECTION_CFG.ongoing;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className={cn("p-1.5 rounded-xl", cfg.iconBg)}>
          <Icon size={15} className={cfg.iconColor} />
        </div>
        <h2 className="text-sm font-bold text-foreground tracking-tight">{title}</h2>
        <span className="ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
          {jobs.length}
        </span>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
          {jobs.map((job) => (
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
      ) : (
        <div className="py-10 flex flex-col items-center justify-center border border-dashed rounded-2xl bg-muted/20 gap-2">
          <Icon size={26} className={cn("opacity-25", cfg.iconColor)} />
          <p className="text-xs text-muted-foreground">No {title.toLowerCase()}</p>
        </div>
      )}
    </section>
  );
};

// ─── Dashboard Component ─────────────────────────────────────────────────────

const FreelanceDashboard = ({ freelanceJobs = [], loading = false, onUpdateStatus, onDeleteJob }) => {
  // ── Group by date + status ──────────────────────────────────────────────────
  const now               = new Date();
  const currentMonthStart = startOfMonth(now);

  const classify = (job) => {
    if (job.status === "Completed") return "past";
    if (!job.dates?.length)         return "ongoing";
    const first = new Date(job.dates[0] + "T00:00:00");
    if (isSameMonth(first, now))               return "ongoing";
    if (isBefore(first, currentMonthStart))    return "past";
    return "upcoming";
  };

  const ongoing  = freelanceJobs.filter((j) => classify(j) === "ongoing");
  const upcoming = freelanceJobs.filter((j) => classify(j) === "upcoming");
  const past     = freelanceJobs.filter((j) => classify(j) === "past");

  const byDate = (a, b) =>
    new Date((a.dates?.[0] || "") + "T00:00:00") -
    new Date((b.dates?.[0] || "") + "T00:00:00");
  ongoing.sort(byDate);
  upcoming.sort(byDate);
  past.sort((a, b) => b._creationTime - a._creationTime);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const jobTotal = (j) =>
    Number(j.photographyAmount || 0) + Number(j.videographyAmount || 0);
  const jobReceived = (j) =>
    Number(j.photographyReceived || 0) + Number(j.videographyReceived || 0);

  const totalEarnings   = freelanceJobs.reduce((s, j) => s + jobTotal(j), 0);
  const pendingEarnings = freelanceJobs
    .filter((j) => j.status !== "Completed")
    .reduce((s, j) => s + Math.max(0, jobTotal(j) - jobReceived(j)), 0);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-load">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-36 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
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
          value={past.length}
          icon={CheckCircle}
          from="from-emerald-500/15 to-emerald-500/5"
          iconColor="text-emerald-500"
        />
      </div>

      {/* ── Sections ── */}
      <FreelanceSection
        title="In Progress"
        sectionKey="ongoing"
        jobs={ongoing}
        icon={PlayCircle}
        onUpdateStatus={onUpdateStatus}
        onDeleteJob={onDeleteJob}
      />
      <FreelanceSection
        title="Upcoming"
        sectionKey="upcoming"
        jobs={upcoming}
        icon={Clock}
        onUpdateStatus={onUpdateStatus}
        onDeleteJob={onDeleteJob}
      />
      <FreelanceSection
        title="Past Jobs"
        sectionKey="past"
        jobs={past}
        icon={CheckCircle}
        onUpdateStatus={onUpdateStatus}
        onDeleteJob={onDeleteJob}
      />
    </div>
  );
};

export default FreelanceDashboard;
