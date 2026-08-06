import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  Layers,
  X,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";
import { Skeleton } from "./ui/skeleton";
import { usePackages } from "../hooks/usePackages";
import { toast } from "react-toastify";

// ─── Empty form state ─────────────────────────────────────────────────────────

const EMPTY = {
  name: "",
  description: "",
  price: "",
  services: [],
  popular: false,
};

// ─── Package Card ─────────────────────────────────────────────────────────────

function PackageCard({ pkg, onEdit, onDelete, onToggleVisibility, visibilitySaving }) {
  const isVisible = pkg.visible !== false;

  return (
    <div
      className={cn(
        "relative group bg-card rounded-2xl border overflow-hidden shadow-sm",
        "hover:shadow-md hover:-translate-y-0.5 transition-[transform,box-shadow,opacity] duration-200 ease-out motion-reduce:transform-none flex flex-col",
        !isVisible && "opacity-70",
        pkg.popular
          ? "border-primary/40 ring-1 ring-primary/15"
          : "border-border"
      )}
    >
      {/* Accent bar */}
      <div className={cn("h-1 w-full shrink-0", pkg.popular ? "bg-primary" : "bg-muted")} />

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between gap-2">
          {pkg.popular ? (
            <Badge className="self-start bg-primary/10 text-primary border-primary/20 text-[10px] font-bold px-2 py-0.5 gap-1">
              <Star size={9} /> Most Popular
            </Badge>
          ) : <span />}
          <span className={cn(
            "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
            isVisible
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-muted text-muted-foreground",
          )}>
            {isVisible ? <Eye size={10} /> : <EyeOff size={10} />}
            {isVisible ? "Shown" : "Hidden"}
          </span>
        </div>

        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-black text-foreground text-sm leading-tight">
            {pkg.name}
          </h3>
          {pkg.price && (
            <span className="text-base font-black text-foreground shrink-0">
              ₹{pkg.price}
            </span>
          )}
        </div>

        {pkg.description && (
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {pkg.description}
          </p>
        )}

        {/* Services */}
        {pkg.services?.length > 0 && (
          <ul className="space-y-1 mt-1">
            {pkg.services.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-[11px] text-muted-foreground"
              >
                <CheckCircle2
                  size={11}
                  className="text-primary shrink-0 mt-0.5"
                />
                {s}
              </li>
            ))}
          </ul>
        )}

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
          <Button
            onClick={onToggleVisibility}
            disabled={visibilitySaving}
            size="sm"
            variant="outline"
            className="h-7 rounded-lg text-[11px] font-semibold px-2.5"
            aria-pressed={isVisible}
            title={isVisible ? "Hide from public profile" : "Show on public profile"}
          >
            {visibilitySaving ? (
              <Loader2 size={11} className="animate-spin" />
            ) : isVisible ? (
              <EyeOff size={11} />
            ) : (
              <Eye size={11} />
            )}
            {isVisible ? "Hide" : "Show"}
          </Button>
          <Button
            onClick={onEdit}
            size="sm"
            variant="outline"
            className="flex-1 h-7 rounded-lg text-[11px] font-semibold"
          >
            <Edit2 size={11} className="mr-1" /> Edit
          </Button>
          <Button
            onClick={onDelete}
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0 rounded-lg text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <Trash2 size={11} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Manager ──────────────────────────────────────────────────────────────────

export default function PackagesManager() {
  const { packages, isLoading, createPackage, updatePackage, removePackage } =
    usePackages();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [serviceInput, setServiceInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [visibilitySavingId, setVisibilitySavingId] = useState(null);

  // ── Open add/edit ──
  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setServiceInput("");
    setDialogOpen(true);
  };

  const openEdit = (pkg) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      description: pkg.description || "",
      price: pkg.price || "",
      services: pkg.services || [],
      popular: pkg.popular || false,
    });
    setServiceInput("");
    setDialogOpen(true);
  };

  // ── Service tag helpers ──
  const addService = () => {
    const s = serviceInput.trim();
    if (s && !form.services.includes(s)) {
      setForm((f) => ({ ...f, services: [...f.services, s] }));
    }
    setServiceInput("");
  };

  const removeServiceAt = (idx) => {
    setForm((f) => ({ ...f, services: f.services.filter((_, i) => i !== idx) }));
  };

  // ── Save ──
  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: form.price.trim() || undefined,
        services: form.services,
        popular: form.popular || undefined,
      };
      if (editing) {
        await updatePackage({ id: editing._id, ...payload });
      } else {
        await createPackage(payload);
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await removePackage({ id });
    setDeleteId(null);
  };

  const handleToggleVisibility = async (pkg) => {
    setVisibilitySavingId(pkg._id);
    const nextVisible = pkg.visible === false;
    try {
      await updatePackage({ id: pkg._id, visible: nextVisible });
      toast.success(nextVisible ? "Package shown on public profile" : "Package hidden from public profile");
    } catch {
      toast.error("Could not update package visibility");
    } finally {
      setVisibilitySavingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-foreground tracking-tight">
            Service Packages
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Packages displayed on your public photographer profile.
          </p>
        </div>
        <Button
          onClick={openAdd}
          size="sm"
          className="h-9 px-4 rounded-xl text-xs font-bold"
        >
          <Plus size={13} className="mr-1.5" /> Add Package
        </Button>
      </div>

      {/* Skeleton while loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-load">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <Skeleton className="h-1 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <div className="flex justify-between gap-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <div className="space-y-1.5 pt-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-4/6" />
                </div>
                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <Skeleton className="h-7 flex-1 rounded-lg" />
                  <Skeleton className="h-7 w-7 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      {!isLoading && packages.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 border border-dashed rounded-2xl bg-muted/20">
          <Layers size={30} className="text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No packages yet</p>
          <Button
            onClick={openAdd}
            size="sm"
            variant="outline"
            className="rounded-xl text-xs"
          >
            Create your first package
          </Button>
        </div>
      ) : !isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg._id}
              pkg={pkg}
              onEdit={() => openEdit(pkg)}
              onDelete={() => setDeleteId(pkg._id)}
              onToggleVisibility={() => handleToggleVisibility(pkg)}
              visibilitySaving={visibilitySavingId === pkg._id}
            />
          ))}
        </div>
      )}

      {/* ── Add / Edit dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg w-full p-0 gap-0 rounded-2xl border border-border [&>button:last-child]:hidden"
        >
          <DialogHeader className="flex flex-row items-center gap-2 px-5 py-3.5 border-b border-border shrink-0">
            <Layers size={14} className="text-primary shrink-0" />
            <DialogTitle className="text-sm font-bold flex-1 min-w-0">
              {editing ? "Edit Package" : "New Service Package"}
            </DialogTitle>
            <DialogClose asChild>
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
                <X size={15} />
              </button>
            </DialogClose>
          </DialogHeader>

          <div className="px-5 py-4 space-y-4 overflow-y-auto max-h-[72vh]">
            {/* Name */}
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">
                Package Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Wedding Standard"
                className="rounded-xl"
              />
            </div>

            {/* Price */}
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">
                Price (₹)
              </Label>
              <Input
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                placeholder="e.g. 45,000"
                className="rounded-xl"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Short description of this package..."
                className="rounded-xl resize-none"
                rows={2}
              />
            </div>

            {/* Services */}
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">
                Services / Features Included
              </Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addService();
                    }
                  }}
                  placeholder="e.g. 6 Hours Coverage — press Enter"
                  className="rounded-xl flex-1"
                />
                <Button
                  type="button"
                  onClick={addService}
                  size="sm"
                  variant="outline"
                  className="rounded-xl px-3 shrink-0"
                >
                  Add
                </Button>
              </div>
              {form.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.services.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    >
                      {s}
                      <button
                        onClick={() => removeServiceAt(i)}
                        className="hover:text-destructive transition-colors ml-0.5"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Popular toggle */}
            <div className="flex items-center gap-2.5 pt-1">
              <Checkbox
                id="pkg-popular"
                checked={form.popular}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, popular: v === true }))
                }
                className="rounded-md"
              />
              <Label
                htmlFor="pkg-popular"
                className="text-xs font-semibold cursor-pointer"
              >
                Mark as "Most Popular"
              </Label>
            </div>
          </div>

          <DialogFooter className="px-5 py-3.5 border-t border-border gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="rounded-xl"
            >
              {saving ? (
                <>
                  <Loader2 size={13} className="mr-1.5 animate-spin" />
                  Saving…
                </>
              ) : editing ? (
                "Save Changes"
              ) : (
                "Create Package"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ── */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-xs rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Package?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground px-1 pb-2">
            This package will be removed from your public profile.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteId)}
              className="rounded-xl"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
