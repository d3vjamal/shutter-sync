import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "react-toastify";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@convex/_generated/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "../lib/utils";

const PLATFORMS = [
  { value: "all", label: "Web + Mobile" },
  { value: "web", label: "Web only" },
  { value: "mobile", label: "Mobile only" },
];

const EMPTY_FORM = { title: "", subtitle: "", linkUrl: "", platform: "all" };

export default function BannersManager() {
  const banners = useQuery(api.banners.listAll);
  const generateUploadUrl = useMutation(api.banners.generateUploadUrl);
  const createBanner = useMutation(api.banners.create);
  const updateBanner = useMutation(api.banners.update);
  const removeBanner = useMutation(api.banners.remove);

  const [editing, setEditing] = useState(null); // null = closed, "new" = create, banner doc = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const openNew = () => { setForm(EMPTY_FORM); setFile(null); setEditing("new"); };
  const openEdit = (b) => {
    setForm({ title: b.title, subtitle: b.subtitle || "", linkUrl: b.linkUrl || "", platform: b.platform });
    setFile(null);
    setEditing(b);
  };

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (f.size > 8 * 1024 * 1024) return toast.error("Image must be smaller than 8 MB");
    setFile(f);
  };

  const uploadFile = async () => {
    const res = await fetch(await generateUploadUrl(), { method: "POST", headers: { "Content-Type": file.type }, body: file });
    if (!res.ok) throw new Error("Upload failed");
    return (await res.json()).storageId;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isNew = editing === "new";
    if (!form.title.trim()) return toast.error("Title is required");
    if (isNew && !file) return toast.error("Please choose a banner image");
    if (form.linkUrl && !/^https?:\/\//i.test(form.linkUrl)) return toast.error("Link must start with http:// or https://");

    setSaving(true);
    try {
      const imageId = file ? await uploadFile() : undefined;
      const fields = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || undefined,
        linkUrl: form.linkUrl.trim() || undefined,
        platform: form.platform,
      };
      if (isNew) await createBanner({ ...fields, imageId });
      else await updateBanner({ id: editing._id, ...fields, ...(imageId && { imageId }) });
      toast.success(isNew ? "Banner created" : "Banner updated");
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = (b) =>
    updateBanner({ id: b._id, visible: !b.visible }).catch(() => toast.error("Failed to update banner"));

  const move = async (index, dir) => {
    const a = banners[index];
    const b = banners[index + dir];
    if (!a || !b) return;
    try {
      await Promise.all([
        updateBanner({ id: a._id, order: b.order }),
        updateBanner({ id: b._id, order: a.order }),
      ]);
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const handleDelete = async (b) => {
    if (confirmId !== b._id) {
      setConfirmId(b._id);
      setTimeout(() => setConfirmId((c) => (c === b._id ? null : c)), 3000);
      return;
    }
    try {
      await removeBanner({ id: b._id });
      toast.success("Banner deleted");
    } catch {
      toast.error("Failed to delete banner");
    }
    setConfirmId(null);
  };

  const previewUrl = file ? URL.createObjectURL(file) : editing && editing !== "new" ? editing.imageUrl : null;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Banners</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visible banners rotate automatically at the top of the web and mobile dashboards.
          </p>
        </div>
        <Button onClick={openNew}><Plus size={16} className="mr-1.5" /> New banner</Button>
      </div>

      {banners === undefined ? (
        <div className="h-32 rounded-2xl skeleton" />
      ) : banners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No banners yet. Create one to show it in the apps.
        </div>
      ) : (
        <ul className="space-y-3">
          {banners.map((b, i) => (
            <li key={b._id} className={cn("flex flex-col sm:flex-row gap-4 rounded-2xl border border-border bg-card p-3", !b.visible && "opacity-60")}>
              <div className="sm:w-56 aspect-[16/6] shrink-0 overflow-hidden rounded-xl bg-muted">
                {b.imageUrl && <img src={b.imageUrl} alt={b.title} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-foreground truncate">{b.title}</p>
                {b.subtitle && <p className="text-xs text-muted-foreground truncate">{b.subtitle}</p>}
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mt-1">
                  {PLATFORMS.find((p) => p.value === b.platform)?.label} · {b.visible ? "Visible" : "Hidden"}
                </p>
                {b.linkUrl && <p className="text-[11px] text-muted-foreground truncate mt-1">{b.linkUrl}</p>}
              </div>
              <div className="flex sm:flex-col items-center justify-end gap-1.5">
                <div className="flex gap-1.5">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30"><ArrowUp size={14} /></button>
                  <button onClick={() => move(i, 1)} disabled={i === banners.length - 1} aria-label="Move down" className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30"><ArrowDown size={14} /></button>
                  <button onClick={() => toggleVisible(b)} aria-label={b.visible ? "Hide banner" : "Show banner"} title={b.visible ? "Hide" : "Show"} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted">
                    {b.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(b)} aria-label="Edit banner" className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"><Pencil size={14} /></button>
                </div>
                <button
                  onClick={() => handleDelete(b)}
                  className={cn("text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all",
                    confirmId === b._id ? "border-rose-500 bg-rose-500 text-white" : "border-rose-500/30 text-rose-500 hover:bg-rose-500/10")}
                >
                  <Trash2 size={11} className="inline mr-1" />{confirmId === b._id ? "Confirm" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing === "new" ? "New banner" : "Edit banner"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="banner-image">Image (16:6 works best)</Label>
              <label htmlFor="banner-image" className="mt-1.5 flex aspect-[16/6] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted text-muted-foreground hover:border-primary">
                {previewUrl ? <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" /> : <span className="flex items-center gap-2 text-xs"><ImagePlus size={16} /> Choose image</span>}
              </label>
              <input id="banner-image" type="file" accept="image/*" className="sr-only" onChange={pickFile} />
            </div>
            <div><Label htmlFor="banner-title">Title</Label><Input id="banner-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={80} /></div>
            <div><Label htmlFor="banner-sub">Subtitle (optional)</Label><Input id="banner-sub" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} maxLength={140} /></div>
            <div><Label htmlFor="banner-link">Link (optional)</Label><Input id="banner-link" type="url" placeholder="https://" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} /></div>
            <div>
              <Label htmlFor="banner-platform">Show on</Label>
              <select id="banner-platform" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                {PLATFORMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
