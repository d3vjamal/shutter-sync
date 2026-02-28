import React, { useState } from "react";
import { FileText, Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { cn } from "../lib/utils";

export default function AgreementsManager({ agreements = [], onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd]           = useState(false);
  const [newText, setNewText]           = useState("");
  const [editingId, setEditingId]       = useState(null);
  const [editText, setEditText]         = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // agreement object

  /* ── Add ── */
  const handleAdd = () => {
    if (!newText.trim()) return;
    onAdd({ description: newText.trim() });
    setNewText("");
    setShowAdd(false);
  };

  /* ── Inline edit ── */
  const openEdit = (ag) => {
    setEditingId(ag._id);
    setEditText(ag.description);
  };
  const cancelEdit = () => { setEditingId(null); setEditText(""); };
  const saveEdit = () => {
    if (!editText.trim() || !editingId) return;
    onUpdate({ id: editingId, description: editText.trim() });
    cancelEdit();
  };

  /* ── Delete ── */
  const confirmDelete = () => {
    if (!deleteTarget) return;
    onDelete({ id: deleteTarget._id });
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10">
            <FileText size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Agreements
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reusable conditions you can attach to assignments
            </p>
          </div>
        </div>

        <Button
          onClick={() => { setShowAdd((v) => !v); setNewText(""); }}
          variant={showAdd ? "outline" : "default"}
          className="rounded-xl h-10 px-4 font-bold text-sm gap-2 shrink-0"
        >
          {showAdd ? (
            <><X size={15} /> Cancel</>
          ) : (
            <><Plus size={15} /> Add New</>
          )}
        </Button>
      </div>

      {/* ── Add form ── */}
      {showAdd && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4 animate-load">
          <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70">
            New Condition
          </Label>
          <Textarea
            autoFocus
            placeholder="e.g. A 50% advance is required to confirm the booking."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="min-h-[90px] resize-none bg-card"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAdd();
            }}
          />
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[10px] text-muted-foreground mr-auto hidden sm:block">
              Ctrl + Enter to save
            </span>
            <Button
              variant="outline"
              className="h-9 rounded-xl"
              onClick={() => { setShowAdd(false); setNewText(""); }}
            >
              Cancel
            </Button>
            <Button
              className="h-9 rounded-xl bg-primary hover:bg-primary/90"
              onClick={handleAdd}
              disabled={!newText.trim()}
            >
              <Check size={14} className="mr-1.5" /> Save Condition
            </Button>
          </div>
        </div>
      )}

      {/* ── Agreement list ── */}
      {agreements.length === 0 && !showAdd ? (
        <div className="py-20 flex flex-col items-center gap-3 text-center border border-dashed rounded-2xl bg-muted/20">
          <FileText size={36} className="text-muted-foreground/25" />
          <p className="text-sm font-semibold text-muted-foreground">No conditions yet</p>
          <p className="text-xs text-muted-foreground/60 max-w-xs">
            Add reusable agreement conditions that you can attach to any assignment.
          </p>
          <Button
            className="mt-2 rounded-xl h-9 px-5"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={14} className="mr-1.5" /> Add First Condition
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {agreements.map((ag, idx) => (
            <div
              key={ag._id}
              className={cn(
                "group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-150",
                editingId === ag._id ? "border-primary/40 shadow-sm" : "hover:border-border/80"
              )}
            >
              {editingId === ag._id ? (
                /* ── Inline edit mode ── */
                <div className="p-4 space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                    Edit Condition
                  </Label>
                  <Textarea
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="min-h-[80px] resize-none bg-muted/30"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" className="rounded-xl h-8" onClick={cancelEdit}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-xl h-8 bg-primary hover:bg-primary/90"
                      onClick={saveEdit}
                      disabled={!editText.trim()}
                    >
                      <Check size={13} className="mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                /* ── Read mode ── */
                <div className="flex items-start gap-4 p-4">
                  {/* Number badge */}
                  <div className="mt-0.5 w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-muted-foreground">{idx + 1}</span>
                  </div>

                  {/* Text */}
                  <p className="flex-1 text-sm text-foreground leading-relaxed py-0.5">
                    {ag.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(ag)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(ag)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {agreements.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {agreements.length} condition{agreements.length !== 1 ? "s" : ""} · hover a card to edit or delete
        </p>
      )}

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Condition?</DialogTitle>
            <DialogDescription>
              This condition will be permanently removed and unlinked from all assignments.
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="px-4 py-3 bg-muted/40 rounded-xl border border-border text-sm text-muted-foreground line-clamp-3">
              {deleteTarget.description}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={confirmDelete}
            >
              <Trash2 size={14} className="mr-1.5" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
