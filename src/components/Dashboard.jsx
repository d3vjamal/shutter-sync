import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  PlayCircle,
  CheckCircle,
  Calendar,
  Clock,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { cn } from "../lib/utils";
import { isFuture, isSameMonth } from "date-fns";

const AssignmentCard = ({
  assignment,
  isCompleted,
  onUpdateStatus,
  onUpdateCaptureDate,
  onEdit,
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEdit = () => {
    navigate("/create-assignment", { state: { assignment } });
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/client/${assignment._id}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Public link copied to clipboard");
      } else {
        // fallback open in new tab
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("Share failed", err);
      toast.error("Failed to copy link");
    }
  };

  const handleConfirmComplete = async () => {
    setShowConfirm(false);
    await onUpdateStatus(assignment._id, "Completed");
  };

  return (
    <Card className="mb-4 group hover:border-primary/50 transition-all duration-300 relative overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm rounded-2xl h-full">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {assignment.title ||
                  assignment.packageName ||
                  "Photography Session"}
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-1 truncate">
                Client: {assignment.clientName || "—"}
              </p>
              <p className="text-xs text-muted-foreground font-medium mt-1 truncate">
                Photographer:{" "}
                {assignment.photographerName || "Assigned Photographer"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {isCompleted ? (
                <Badge
                  variant="secondary"
                  className="bg-secondary/10 text-secondary border-secondary/20"
                >
                  COMPLETED
                </Badge>
              ) : (
                <span className="text-xl font-bold text-foreground">
                  ₹{assignment.amount || assignment.totalAmount || 0}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground">
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
              <Calendar size={12} className="icon-contrast" />
              <span>
                {assignment.eventStartDate || assignment.captureDate
                  ? new Date(
                      assignment.eventStartDate || assignment.captureDate,
                    ).toLocaleString()
                  : "Date TBD"}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
              <span className="text-[11px] font-bold">Venue:</span>
              <span>{assignment.venue || "—"}</span>
            </div>
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
              <span className="text-[11px] font-bold">Location:</span>
              <span>{assignment.location || "—"}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="w-full flex  items-center justify-center gap-2 h-8 text-sm"
            >
              <Edit2 size={14} className="icon-contrast" /> Edit
            </Button>
            {!isCompleted && (
              <Button
                size="sm"
                onClick={() => setShowConfirm(true)}
                className="w-full hover:bg-primary/90 text-white   bg-secondary font-bold flex items-center justify-center gap-2 h-8 text-sm shadow-secondary/20"
              >
                <CheckCircle size={14} className="icon-contrast" /> Complete
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 h-8 text-sm"
            >
              <ExternalLink size={14} /> Share
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark as Complete?</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark "
              {assignment.title || assignment.packageName || "this assignment"}"
              as completed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmComplete}
              className="bg-secondary hover:bg-secondary/90"
            >
              Yes, Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const DashboardSection = ({
  title,
  assignments,
  icon: Icon,
  color,
  ...handlers
}) => (
  <div className="mb-8 mt-5">
    <div className="flex items-center gap-3 mb-4 px-1">
      <div className={cn("p-2 rounded-lg bg-primary/10", color)}>
        <Icon size={18} className="icon-contrast" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-muted text-muted-foreground">
        {assignments.length}
      </span>
    </div>
    {assignments.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((a) => (
          <AssignmentCard
            key={a._id}
            assignment={a}
            isCompleted={a.status === "Completed"}
            {...handlers}
          />
        ))}
      </div>
    ) : (
      <div className="p-8 text-center border border-dashed rounded-2xl opacity-50 bg-muted/20">
        <p className="text-sm text-muted-foreground">
          No {title.toLowerCase()}
        </p>
      </div>
    )}
  </div>
);

const Dashboard = ({
  assignments = [],
  onViewChange,
  onUpdateStatus,
  onUpdateCaptureDate,
  onUpdateAssignment,
}) => {
  // 1. Calculate Stats
  const totalRevenue = assignments
    .filter((a) => a.status === "Completed")
    .reduce((sum, a) => sum + Number(a.totalAmount || a.amount || 0), 0);
  const totalCount = assignments.length;

  // 2. Group Assignments
  const now = new Date();
  const upcoming = [];
  const ongoing = [];
  const past = [];

  assignments.forEach((a) => {
    if (a.status === "Completed") {
      past.push(a);
    } else {
      const eventDateStr = a.eventStartDate || a.captureDate;
      if (eventDateStr) {
        const eventDate = new Date(eventDateStr);
        if (isFuture(eventDate) && !isSameMonth(eventDate, now)) {
          upcoming.push(a);
        } else {
          ongoing.push(a);
        }
      } else {
        ongoing.push(a); // Unscheduled are ongoing
      }
    }
  });

  // Sort groups
  const sortFn = (a, b) =>
    new Date(a.eventStartDate || a.captureDate) -
    new Date(b.eventStartDate || b.captureDate);
  ongoing.sort(sortFn);
  upcoming.sort(sortFn);
  past.sort((a, b) => b._creationTime - a._creationTime);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <Card className="relative overflow-hidden shadow-sm border-none bg-secondary text-primary-foreground">
          <CardContent className="p-6 relative z-10">
            <p className="text-sm font-medium opacity-80 mb-1">Total Revenue</p>
            <h2 className="text-3xl font-black">
              ₹{totalRevenue.toLocaleString()}
            </h2>
            <div className="absolute right-0 bottom-0 p-4 opacity-20">
              &#8377;
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 relative z-10">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Jobs
            </p>
            <h2 className="text-3xl font-black text-foreground">
              {totalCount}
            </h2>
            <div className="absolute right-0 bottom-0 p-4 opacity-10">
              <Users size={48} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Sections */}
      <DashboardSection
        title="Ongoing assignments"
        assignments={ongoing}
        icon={PlayCircle}
        color="text-yellow-500"
        onUpdateStatus={onUpdateStatus}
        onUpdateCaptureDate={onUpdateCaptureDate}
      />
      <DashboardSection
        title="Upcoming assignments"
        assignments={upcoming}
        icon={Calendar}
        color="text-red-500"
        onUpdateStatus={onUpdateStatus}
        onUpdateCaptureDate={onUpdateCaptureDate}
      />
      <DashboardSection
        title="Past assignments"
        assignments={past}
        icon={CheckCircle}
        color="text-green-500"
        onUpdateStatus={onUpdateStatus}
        onUpdateCaptureDate={onUpdateCaptureDate}
      />
    </div>
  );
};
export default Dashboard;
