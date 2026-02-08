import React, { useState } from 'react';
import { Users, PlayCircle, CheckCircle, Calendar, Clock, Edit2, TrendingUp, DollarSign, ChevronRight } from 'lucide-react';
import { GlassCard, Button, Input, Badge } from './UI';
import EditAssignmentModal from './EditAssignmentModal';

const AssignmentCard = ({ assignment, isCompleted, onUpdateStatus, onUpdateCaptureDate, onEdit }) => {
    return (
        <GlassCard className="p-5 mb-4 group hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-purple-500 transition-colors">
                            {assignment.title || assignment.packageName || 'Photography Session'}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">
                            {assignment.clientName}
                        </p>
                    </div>
                    {isCompleted ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none">COMPLETED</Badge>
                    ) : (
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xl font-bold text-[var(--text-primary)]">
                                ₹{assignment.amount || assignment.totalAmount || 0}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-bold text-[var(--text-secondary)] opacity-80">
                    <div className="flex items-center gap-1 bg-[var(--card-bg)] px-2 py-1 rounded-md">
                        <Calendar size={12} className="text-purple-500" />
                        <span>{assignment.captureDate ? new Date(assignment.captureDate).toLocaleDateString() : 'Date TBD'}</span>
                    </div>
                    {assignment.captureDate && (
                        <div className="flex items-center gap-1 bg-[var(--card-bg)] px-2 py-1 rounded-md">
                            <Clock size={12} className="text-purple-500" />
                            <span>{new Date(assignment.captureDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    )}
                </div>

                {!isCompleted && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-4 border-t border-[var(--card-border)]">
                        <Button
                            onClick={onEdit}
                            className="w-full py-2 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-xs border border-[var(--card-border)] flex items-center justify-center gap-2"
                        >
                            <Edit2 size={14} /> Edit Details
                        </Button>
                        <Button
                            onClick={() => onUpdateStatus(assignment._id, 'Completed')}
                            className="w-full py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={14} /> Mark Complete
                        </Button>
                    </div>
                )}
            </div>
        </GlassCard>
    );
};

const DashboardSection = ({ title, assignments, icon: Icon, color, ...handlers }) => (
    <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 px-1">
            <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
                <Icon size={18} className={color} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
            <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-[var(--card-bg)] text-[var(--text-secondary)]">
                {assignments.length}
            </span>
        </div>
        {assignments.length > 0 ? (
            <div className="space-y-1">
                {assignments.map(a => (
                    <AssignmentCard
                        key={a._id}
                        assignment={a}
                        isCompleted={title === 'Completed History'}
                        {...handlers}
                        onEdit={() => handlers.onEdit(a)}
                    />
                ))}
            </div>
        ) : (
            <div className="p-8 text-center border border-dashed border-[var(--card-border)] rounded-2xl opacity-50">
                <p className="text-sm text-[var(--text-secondary)]">No {title.toLowerCase()}</p>
            </div>
        )}
    </div>
);

const Dashboard = ({ assignments = [], onViewChange, onUpdateStatus, onUpdateCaptureDate, onUpdateAssignment }) => {
    const [editingAssignment, setEditingAssignment] = useState(null);

    // 1. Calculate Stats
    const totalRevenue = assignments.reduce((sum, a) => sum + Number(a.totalAmount || a.amount || 0), 0);
    const totalCount = assignments.length;

    // 2. Group Assignments
    const now = new Date();
    const upcoming = [];
    const ongoing = [];
    const completed = [];

    assignments.forEach(a => {
        if (a.status === 'Completed') {
            completed.push(a);
        } else if (a.captureDate && new Date(a.captureDate) > now) {
            upcoming.push(a);
        } else {
            ongoing.push(a); // Ongoing or Unscheduled
        }
    });

    // Sort upcoming by date (soonest first)
    upcoming.sort((a, b) => new Date(a.captureDate) - new Date(b.captureDate));
    // Sort completed by recent
    completed.sort((a, b) => b._creationTime - a._creationTime);

    return (
        <div className="max-w-3xl mx-auto pb-20">
            {/* Header Stats */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                <GlassCard className="p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Total Revenue</p>
                        <h2 className="text-3xl font-black gradient-text">₹{totalRevenue.toLocaleString()}</h2>
                    </div>
                    <div className="absolute right-0 bottom-0 p-4 opacity-10">
                        <DollarSign size={48} />
                    </div>
                </GlassCard>
                <GlassCard className="p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Total Jobs</p>
                        <h2 className="text-3xl font-black text-[var(--text-primary)]">{totalCount}</h2>
                    </div>
                    <div className="absolute right-0 bottom-0 p-4 opacity-10">
                        <Users size={48} />
                    </div>
                </GlassCard>
            </div>

            {/* Timeline Sections */}
            <DashboardSection
                title="Upcoming assignments"
                assignments={upcoming}
                icon={Calendar}
                color="text-purple-400"
                onUpdateStatus={onUpdateStatus}
                onUpdateCaptureDate={onUpdateCaptureDate}
                onEdit={setEditingAssignment}
            />

            <DashboardSection
                title="Ongoing assignments"
                assignments={ongoing}
                icon={PlayCircle}
                color="text-blue-400"
                onUpdateStatus={onUpdateStatus}
                onUpdateCaptureDate={onUpdateCaptureDate}
                onEdit={setEditingAssignment}
            />

            <DashboardSection
                title="Past assignments"
                assignments={completed}
                icon={CheckCircle}
                color="text-emerald-400"
                onUpdateStatus={onUpdateStatus}
                onUpdateCaptureDate={onUpdateCaptureDate}
                onEdit={setEditingAssignment}
            />

            {/* Edit Modal */}
            {editingAssignment && (
                <EditAssignmentModal
                    assignment={editingAssignment}
                    onClose={() => setEditingAssignment(null)}
                    onSave={(id, data) => {
                        onUpdateAssignment(id, data);
                        setEditingAssignment(null);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
