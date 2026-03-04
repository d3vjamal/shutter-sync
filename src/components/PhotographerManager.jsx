import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Wallet,
  Trash2,
  Share2,
  Pencil,
  Plus,
  User,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { cn } from "../lib/utils";

// ─── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none",
        checked ? "bg-emerald-500" : "bg-muted-foreground/25"
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, icon: Icon, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none z-10"
          />
        )}
        {children}
      </div>
    </div>
  );
}

// ─── Photographer Manager ─────────────────────────────────────────────────────

export default function PhotographerManager({
  photographers = [],
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "", email: "", contact: "", upiId: "", password: "",
  });

  const [confirmId, setConfirmId] = useState(null);

  // Edit modal
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm]     = useState({ name: "", contact: "", upiId: "" });
  const [saving, setSaving]         = useState(false);

  // ── Handlers ──

  const handleAdd = (e) => {
    e.preventDefault();
    onAdd(addForm);
    setAddForm({ name: "", email: "", contact: "", upiId: "", password: "" });
    setShowAdd(false);
    toast.success("Photographer onboarded!");
  };

  const handleToggle = (artist) => {
    const isActive = artist.active !== false;
    // Single-object arg — correct Convex mutation call
    onUpdate({ id: artist._id, active: !isActive });
  };

  const openEdit = (artist) => {
    setEditTarget(artist);
    setEditForm({
      name:    artist.name    || "",
      contact: artist.contact || "",
      upiId:   artist.upiId   || "",
    });
  };

  const handleSave = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await onUpdate({
        id:      editTarget._id,
        name:    editForm.name    || undefined,
        contact: editForm.contact || undefined,
        upiId:   editForm.upiId   || undefined,
      });
      toast.success("Photographer updated.");
      setEditTarget(null);
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (artist) => {
    if (confirmId === artist._id) {
      // Single-object arg — correct Convex mutation call
      onDelete({ id: artist._id });
      setConfirmId(null);
      toast.success(`${artist.name || "Photographer"} removed.`);
    } else {
      setConfirmId(artist._id);
      setTimeout(
        () => setConfirmId((c) => (c === artist._id ? null : c)),
        3000
      );
    }
  };

  const copyLink = (artist) => {
    const url = `${window.location.origin}/photographer/${artist.username || artist._id}`;
    navigator.clipboard.writeText(url).then(() =>
      toast.success(`Link for ${artist.name || "photographer"} copied!`)
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Users size={26} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
              Artist Collective
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Partner management & oversight
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAdd(!showAdd)}
          variant={showAdd ? "outline" : "default"}
          className="rounded-xl h-11 px-5 font-bold uppercase tracking-widest text-[10px] gap-2"
        >
          {showAdd ? (
            "Cancel"
          ) : (
            <>
              <UserPlus size={15} /> Onboard Artist
            </>
          )}
        </Button>
      </div>

      {/* ── Onboard form ── */}
      {showAdd && (
        <div className="rounded-2xl border border-border bg-card p-6 animate-in slide-in-from-top-3 duration-300">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-5">
            New Artist Onboarding
          </p>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <Field label="Full Name" icon={User}>
              <Input
                placeholder="Rahul Sharma"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className="pl-9 h-11"
                required
              />
            </Field>
            <Field label="Email" icon={Mail}>
              <Input
                type="email"
                placeholder="artist@studio.com"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                className="pl-9 h-11"
                required
              />
            </Field>
            <Field label="Contact" icon={Phone}>
              <Input
                placeholder="+91 98765 43210"
                value={addForm.contact}
                onChange={(e) => setAddForm({ ...addForm, contact: e.target.value })}
                className="pl-9 h-11"
                required
              />
            </Field>
            <Field label="UPI Handle" icon={Wallet}>
              <Input
                placeholder="artist@upi"
                value={addForm.upiId}
                onChange={(e) => setAddForm({ ...addForm, upiId: e.target.value })}
                className="pl-9 h-11"
                required
              />
            </Field>
            <Field label="Password" icon={Lock}>
              <Input
                type="password"
                placeholder="••••••••"
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                className="pl-9 h-11"
                required
              />
            </Field>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2"
              >
                <Plus size={15} /> Create Account
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── Card grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {photographers.map((artist) => {
          const isActive  = artist.active !== false; // undefined treated as active
          const isConfirm = confirmId === artist._id;

          return (
            <div
              key={artist._id}
              className="relative rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* ── Card header ── */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-lg shrink-0">
                    {(artist.name || artist.email || "?")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-foreground leading-none truncate">
                      {artist.name || "—"}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] font-bold mt-0.5",
                        isActive ? "text-emerald-500" : "text-rose-500"
                      )}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                {/* Active toggle */}
                <Toggle checked={isActive} onChange={() => handleToggle(artist)} />
              </div>

              {/* ── Contact details ── */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
                  <Mail size={12} className="shrink-0 text-primary/50" />
                  <span className="truncate">{artist.email}</span>
                </div>
                {artist.contact && (
                  <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
                    <Phone size={12} className="shrink-0 text-primary/50" />
                    <span>{artist.contact}</span>
                  </div>
                )}
                {artist.upiId && (
                  <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
                    <Wallet size={12} className="shrink-0 text-primary/50" />
                    <span className="font-mono">{artist.upiId}</span>
                  </div>
                )}
              </div>

              {/* ── Actions ── */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <button
                  onClick={() => copyLink(artist)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  <Share2 size={11} /> Share Link
                </button>

                <div className="flex items-center gap-1.5">
                  {/* Edit */}
                  <button
                    onClick={() => openEdit(artist)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={13} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(artist)}
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all",
                      isConfirm
                        ? "border-rose-500 bg-rose-500 text-white scale-105"
                        : "border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                    )}
                  >
                    {isConfirm ? "Confirm?" : <Trash2 size={12} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {photographers.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-muted rounded-3xl">
            <Users size={48} className="mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              No photographers yet
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              Use "Onboard Artist" to add your first photographer.
            </p>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-md [&>button:last-child]:hidden">
          <DialogHeader>
            <DialogTitle className="text-sm font-black uppercase tracking-widest">
              Edit Photographer
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Field label="Full Name" icon={User}>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
                className="pl-9 h-11"
              />
            </Field>
            <Field label="Contact" icon={Phone}>
              <Input
                value={editForm.contact}
                onChange={(e) => setEditForm((f) => ({ ...f, contact: e.target.value }))}
                placeholder="+91 98765 43210"
                className="pl-9 h-11"
              />
            </Field>
            <Field label="UPI ID" icon={Wallet}>
              <Input
                value={editForm.upiId}
                onChange={(e) => setEditForm((f) => ({ ...f, upiId: e.target.value }))}
                placeholder="name@upi"
                className="pl-9 h-11"
              />
            </Field>
            <Field label="Email (read-only)" icon={Mail}>
              <Input
                value={editTarget?.email || ""}
                disabled
                className="pl-9 h-11 opacity-50"
              />
            </Field>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
