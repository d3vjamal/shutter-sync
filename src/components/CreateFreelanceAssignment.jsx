import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Briefcase,
  Plus,
  Trash2,
  IndianRupee,
  User,
  Phone,
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  Circle,
  FileText,
  Mail,
  Video,
  Camera,
  Cpu,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";
import { format } from "date-fns";

// ─── Field wrapper ────────────────────────────────────────────────────────────

const Field = ({ label, required, icon: Icon, children, className }) => (
  <div className={cn("space-y-1.5", className)}>
    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
      {label}
      {required && <span className="text-secondary">*</span>}
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

// ─── Section header ───────────────────────────────────────────────────────────

const Section = ({
  icon: Icon,
  title,
  color = "text-primary",
  bg = "bg-primary/10",
  children,
}) => (
  <div className="space-y-5">
    <div className="flex items-center gap-2.5">
      <div className={cn("p-1.5 rounded-lg", bg)}>
        <Icon size={14} className={color} />
      </div>
      <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

// ─── Amount due display ───────────────────────────────────────────────────────

const AmountDue = ({ total, received }) => {
  const t = Number(total || 0);
  const r = Number(received || 0);
  const due = Math.max(0, t - r);
  const pct = t > 0 ? Math.min(100, Math.round((r / t) * 100)) : 0;
  if (t === 0) return null;
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-semibold">Amount Due</span>
        <span
          className={cn(
            "font-black",
            due === 0 ? "text-emerald-500" : "text-foreground",
          )}
        >
          ₹{due.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            pct === 100 ? "bg-emerald-500" : "bg-secondary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">{pct}% received</p>
    </div>
  );
};

// ─── Footage chips ────────────────────────────────────────────────────────────

const PHOTO_PRESETS = ["Raw", "Reels", "Cinematic", "Album", "Portraits"];
const VIDEO_PRESETS = [
  "Video",
  "Raw",
  "Reels",
  "Drone",
  "Cinematic",
  "Short Film",
];

const FootageChips = ({
  presets,
  selected,
  onToggle,
  footageInput,
  setFootageInput,
  onAddCustom,
  accentClass,
}) => (
  <div className="space-y-2.5">
    <div className="flex flex-wrap gap-2">
      {presets.map((type) => {
        const active = selected.includes(type);
        return (
          <button
            key={type}
            type="button"
            onClick={() => onToggle(type)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-150",
              active
                ? accentClass
                : "bg-muted/40 border-border text-muted-foreground hover:border-muted-foreground/40",
            )}
          >
            {type}
          </button>
        );
      })}
    </div>
    <div className="flex gap-2">
      <Input
        className="h-8 flex-1 text-xs"
        placeholder="Custom type…"
        value={footageInput}
        onChange={(e) => setFootageInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAddCustom()}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 px-2.5 rounded-xl shrink-0"
        onClick={onAddCustom}
        disabled={!footageInput.trim()}
      >
        <Plus size={13} />
      </Button>
    </div>
    {/* Custom tags not in presets */}
    {selected.filter((t) => !presets.includes(t)).length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {selected
          .filter((t) => !presets.includes(t))
          .map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onToggle(t)}
              className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full border border-border hover:bg-muted/60 transition-colors"
            >
              {t} <Trash2 size={9} className="opacity-50" />
            </button>
          ))}
      </div>
    )}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const CreateFreelanceAssignment = ({
  onSave,
  initialJob = null,
  isEditing = false,
}) => {
  const [form, setForm] = useState(
    initialJob || {
      studioName: "",
      studioOwnerName: "",
      studioMobile: "",
      studioEmail: "",
      studioArea: "",
      // Wedding Details
      brideName: "",
      groomName: "",
      venue: "",
      location: "",
      dates: [],
      // Photography
      photographerName: "",
      photographerMobile: "",
      photographerEmail: "",
      photographyAmount: "",
      photographyReceived: "0",
      photographyFootageTypes: [],
      // Videography
      hasVideography: false,
      videographerName: "",
      videographerMobile: "",
      videographerEmail: "",
      videographyAmount: "",
      videographyReceived: "0",
      videographyFootageTypes: [],
      // Extras
      gadgets: [],
      conditions: [],
    },
  );

  const agreements = useQuery(api.agreements.get) || [];
  const [dateInput, setDateInput] = useState("");
  const [gadgetInput, setGadgetInput] = useState("");
  const [photoFootageInput, setPhotoFootageInput] = useState("");
  const [videoFootageInput, setVideoFootageInput] = useState("");

  const validate = {
    phone: (v) => /^[+]?[0-9]*$/.test(v),
    number: (v) => /^[0-9]*$/.test(v),
  };

  const set = (field, value, type = null) => {
    let val = value;
    if (type === "number") {
      val = val.replace(/[^\d]/g, "");
    }
    if (type === "phone") {
      val = val.replace(/[^\d+]/g, "");
    }
    setForm((f) => ({ ...f, [field]: val }));
  };

  // ── Dates ──
  const addDate = () => {
    if (!dateInput || form.dates.includes(dateInput)) return;
    const sorted = [...form.dates, dateInput].sort();
    setForm((f) => ({ ...f, dates: sorted }));
    setDateInput("");
  };
  const removeDate = (d) =>
    setForm((f) => ({ ...f, dates: f.dates.filter((x) => x !== d) }));

  // ── Gadgets ──
  const addGadget = () => {
    if (!gadgetInput.trim()) return;
    setForm((f) => ({
      ...f,
      gadgets: [...(f.gadgets || []), gadgetInput.trim()],
    }));
    setGadgetInput("");
  };
  const removeGadget = (i) =>
    setForm((f) => ({
      ...f,
      gadgets: (f.gadgets || []).filter((_, idx) => idx !== i),
    }));

  // ── Footage helpers ──
  const toggleFootage = (field, type) => {
    const current = form[field] || [];
    setForm((f) => ({
      ...f,
      [field]: current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type],
    }));
  };

  const addCustomFootage = (field, inputVal, setInput) => {
    const val = inputVal.trim();
    if (!val || (form[field] || []).includes(val)) return;
    setForm((f) => ({ ...f, [field]: [...(f[field] || []), val] }));
    setInput("");
  };

  // ── Conditions ──
  const toggleCondition = (text) => {
    const current = form.conditions || [];
    setForm((f) => ({
      ...f,
      conditions: current.includes(text)
        ? current.filter((c) => c !== text)
        : [...current, text],
    }));
  };

  const handleSave = () => {
    if (isValid) onSave(form);
  };

  const isValid =
    form.studioName &&
    form.studioOwnerName &&
    form.studioMobile &&
    form.venue &&
    form.photographerName;

  return (
    <div className="max-w-3xl mx-auto pb-10">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-secondary/10">
            <Briefcase size={26} className="text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              {isEditing ? "Edit Freelance Job" : "New Freelance Job"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing
                ? "Update the job details below"
                : "Log a job you're doing for a studio"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-0">
        {/* ══ BLOCK 1: Studio Details ══ */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <Section
            icon={Building2}
            title="Studio Details"
            color="text-primary"
            bg="bg-primary/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Studio Name"
                required
                icon={Building2}
                className="sm:col-span-2"
              >
                <Input
                  className="pl-9 h-11"
                  placeholder="XYZ Photography Studio"
                  value={form.studioName}
                  onChange={(e) => set("studioName", e.target.value)}
                />
              </Field>
              <Field label="Owner Name" required icon={User}>
                <Input
                  className="pl-9 h-11"
                  placeholder="Ravi Sharma"
                  value={form.studioOwnerName}
                  onChange={(e) => set("studioOwnerName", e.target.value)}
                />
              </Field>
              <Field label="Owner Mobile" required icon={Phone}>
                <Input
                  className="pl-9 h-11"
                  placeholder="+91 98765 43210"
                  value={form.studioMobile}
                  onChange={(e) => set("studioMobile", e.target.value, "phone")}
                />
              </Field>
              <Field label="Owner Gmail" icon={Mail}>
                <Input
                  className="pl-9 h-11"
                  placeholder="studio@gmail.com"
                  type="email"
                  value={form.studioEmail}
                  onChange={(e) => set("studioEmail", e.target.value)}
                />
              </Field>
              <Field label="Studio Area" icon={MapPin}>
                <Input
                  className="pl-9 h-11"
                  placeholder="Koramangala, Bangalore"
                  value={form.studioArea}
                  onChange={(e) => set("studioArea", e.target.value)}
                />
              </Field>
            </div>
          </Section>
        </div>

        <div className="h-3" />

        {/* ══ BLOCK 2: Work Details ══ */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <Section
            icon={Calendar}
            title="Work Details"
            color="text-amber-500"
            bg="bg-amber-500/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Venue"
                required
                icon={Building2}
                className="sm:col-span-2"
              >
                <Input
                  className="pl-9 h-11"
                  placeholder="The Grand Palace Banquet"
                  value={form.venue}
                  onChange={(e) => set("venue", e.target.value)}
                />
              </Field>
              <Field label="Bride Name (Optional)" icon={User}>
                <Input
                  className="pl-9 h-11"
                  placeholder="Priya"
                  value={form.brideName}
                  onChange={(e) => set("brideName", e.target.value)}
                />
              </Field>
              <Field label="Groom Name (Optional)" icon={User}>
                <Input
                  className="pl-9 h-11"
                  placeholder="Rahul"
                  value={form.groomName}
                  onChange={(e) => set("groomName", e.target.value)}
                />
              </Field>
              <Field label="Add Date" icon={Calendar}>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="pl-9 h-11 flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-11 w-11 rounded-xl shrink-0"
                    onClick={addDate}
                    disabled={!dateInput}
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              </Field>
              <Field label="Total Days">
                <div className="h-11 flex items-center px-4 bg-muted/40 border border-border rounded-xl text-sm font-bold text-foreground">
                  {form.dates.length} Day{form.dates.length !== 1 ? "s" : ""}
                </div>
              </Field>
              <Field
                label="City / Location"
                icon={MapPin}
                className="sm:col-span-2"
              >
                <Input
                  className="pl-9 h-11"
                  placeholder="Mumbai, Maharashtra"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </Field>
            </div>

            {form.dates.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
                  Event Dates
                </p>
                <div className="flex flex-wrap gap-2">
                  {form.dates.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => removeDate(d)}
                      className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-colors"
                    >
                      <Calendar size={10} />
                      {format(new Date(d), "dd MMM yyyy")}
                      <Trash2 size={10} className="ml-0.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Section>
        </div>

        <div className="h-3" />

        {/* ══ BLOCK 3: Photography ══ */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <Section
            icon={Camera}
            title="Photography"
            color="text-emerald-500"
            bg="bg-emerald-500/10"
          >
            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Photographer Name" required icon={User}>
                <Input
                  className="pl-9 h-11"
                  placeholder="Arjun Mehta"
                  value={form.photographerName}
                  onChange={(e) => set("photographerName", e.target.value)}
                />
              </Field>
              <Field label="Mobile" icon={Phone}>
                <Input
                  className="pl-9 h-11"
                  placeholder="+91 98765 43210"
                  value={form.photographerMobile}
                  onChange={(e) =>
                    set("photographerMobile", e.target.value, "phone")
                  }
                />
              </Field>
              <Field label="Gmail" icon={Mail}>
                <Input
                  className="pl-9 h-11"
                  placeholder="arjun@gmail.com"
                  type="email"
                  value={form.photographerEmail}
                  onChange={(e) => set("photographerEmail", e.target.value)}
                />
              </Field>
            </div>

            <div className="border-t border-dashed border-border/50" />

            {/* Output footage */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
                Output Footage Type
              </p>
              <FootageChips
                presets={PHOTO_PRESETS}
                selected={form.photographyFootageTypes}
                onToggle={(t) => toggleFootage("photographyFootageTypes", t)}
                footageInput={photoFootageInput}
                setFootageInput={setPhotoFootageInput}
                onAddCustom={() =>
                  addCustomFootage(
                    "photographyFootageTypes",
                    photoFootageInput,
                    setPhotoFootageInput,
                  )
                }
                accentClass="bg-emerald-500 border-emerald-500 text-white shadow-sm"
              />
            </div>

            <div className="border-t border-dashed border-border/50" />

            {/* Payment */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Payment
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Total Amount" icon={IndianRupee}>
                  <Input
                    className="pl-9 h-11"
                    placeholder="30000"
                    value={form.photographyAmount}
                    onChange={(e) =>
                      set("photographyAmount", e.target.value, "number")
                    }
                  />
                </Field>
                <Field label="Amount Received" icon={IndianRupee}>
                  <Input
                    className="pl-9 h-11"
                    placeholder="0"
                    value={form.photographyReceived}
                    onChange={(e) =>
                      set("photographyReceived", e.target.value, "number")
                    }
                  />
                </Field>
              </div>
              <div className="mt-3">
                <AmountDue
                  total={form.photographyAmount}
                  received={form.photographyReceived}
                />
              </div>
            </div>
          </Section>
        </div>

        <div className="h-3" />

        {/* ══ BLOCK 4: Videography ══ */}
        {!form.hasVideography ? (
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, hasVideography: true }))}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
          >
            <Plus size={16} />
            <span className="text-sm font-bold">Add Videography</span>
          </button>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
            <Section
              icon={Video}
              title="Videography"
              color="text-primary"
              bg="bg-primary/10"
            >
              {/* Remove button */}
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      hasVideography: false,
                      videographerName: "",
                      videographerMobile: "",
                      videographerEmail: "",
                      videographyAmount: "",
                      videographyReceived: "0",
                      videographyFootageTypes: [],
                    }))
                  }
                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} /> Remove Videography
                </button>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Videographer Name" icon={User}>
                  <Input
                    className="pl-9 h-11"
                    placeholder="Kiran Rao"
                    value={form.videographerName}
                    onChange={(e) => set("videographerName", e.target.value)}
                  />
                </Field>
                <Field label="Mobile" icon={Phone}>
                  <Input
                    className="pl-9 h-11"
                    placeholder="+91 91234 56789"
                    value={form.videographerMobile}
                    onChange={(e) =>
                      set("videographerMobile", e.target.value, "phone")
                    }
                  />
                </Field>
                <Field label="Gmail" icon={Mail}>
                  <Input
                    className="pl-9 h-11"
                    placeholder="kiran@gmail.com"
                    type="email"
                    value={form.videographerEmail}
                    onChange={(e) => set("videographerEmail", e.target.value)}
                  />
                </Field>
              </div>

              <div className="border-t border-dashed border-border/50" />

              {/* Output footage */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
                  Output Footage Type
                </p>
                <FootageChips
                  presets={VIDEO_PRESETS}
                  selected={form.videographyFootageTypes}
                  onToggle={(t) => toggleFootage("videographyFootageTypes", t)}
                  footageInput={videoFootageInput}
                  setFootageInput={setVideoFootageInput}
                  onAddCustom={() =>
                    addCustomFootage(
                      "videographyFootageTypes",
                      videoFootageInput,
                      setVideoFootageInput,
                    )
                  }
                  accentClass="bg-primary border-primary text-primary-foreground shadow-sm"
                />
              </div>

              <div className="border-t border-dashed border-border/50" />

              {/* Payment */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Payment
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Total Amount" icon={IndianRupee}>
                    <Input
                      className="pl-9 h-11"
                      placeholder="20000"
                      value={form.videographyAmount}
                      onChange={(e) =>
                        set("videographyAmount", e.target.value, "number")
                      }
                    />
                  </Field>
                  <Field label="Amount Received" icon={IndianRupee}>
                    <Input
                      className="pl-9 h-11"
                      placeholder="0"
                      value={form.videographyReceived}
                      onChange={(e) =>
                        set("videographyReceived", e.target.value, "number")
                      }
                    />
                  </Field>
                </div>
                <div className="mt-3">
                  <AmountDue
                    total={form.videographyAmount}
                    received={form.videographyReceived}
                  />
                </div>
              </div>
            </Section>
          </div>
        )}

        <div className="h-3" />

        {/* ══ BLOCK 5: Gadgets ══ */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <Section
            icon={Cpu}
            title="Gadgets & Equipment"
            color="text-amber-500"
            bg="bg-amber-500/10"
          >
            <div className="flex gap-2">
              <Input
                className="h-11 flex-1"
                placeholder="e.g. Sony A7IV, DJI Mavic 3"
                value={gadgetInput}
                onChange={(e) => setGadgetInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGadget()}
              />
              <Button
                type="button"
                onClick={addGadget}
                disabled={!gadgetInput.trim()}
                className="h-11 px-4 rounded-xl shrink-0 bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Plus size={16} className="mr-1" /> Add
              </Button>
            </div>
            {(form.gadgets || []).length > 0 ? (
              <ul className="space-y-2">
                {(form.gadgets || []).map((g, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 bg-muted/40 rounded-xl border border-border group"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-foreground">{g}</span>
                    <button
                      type="button"
                      onClick={() => removeGadget(i)}
                      className="text-muted-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground/50 italic py-1">
                No equipment added yet.
              </p>
            )}
          </Section>
        </div>

        <div className="h-3" />

        {/* ══ BLOCK 6: Terms & Conditions ══ */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <Section
            icon={FileText}
            title="Terms & Conditions"
            color="text-primary"
            bg="bg-primary/10"
          >
            {agreements.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2 text-center border border-dashed rounded-xl">
                <FileText size={24} className="text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No agreement templates found.
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Add them in the{" "}
                  <span className="font-semibold">Agreements</span> section.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {agreements.map((ag) => {
                  const selected = (form.conditions || []).includes(
                    ag.description,
                  );
                  return (
                    <button
                      key={ag._id}
                      type="button"
                      onClick={() => toggleCondition(ag.description)}
                      className={cn(
                        "w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150",
                        selected
                          ? "bg-primary/5 border-primary/30 shadow-sm"
                          : "bg-muted/30 border-transparent hover:border-border hover:bg-muted/50",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 shrink-0 transition-colors",
                          selected
                            ? "text-primary"
                            : "text-muted-foreground/30",
                        )}
                      >
                        {selected ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Circle size={18} />
                        )}
                      </span>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          selected
                            ? "text-foreground font-medium"
                            : "text-muted-foreground",
                        )}
                      >
                        {ag.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
            {(form.conditions || []).length > 0 && (
              <p className="text-[11px] text-primary font-semibold">
                {form.conditions.length} condition
                {form.conditions.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </Section>
        </div>

        <div className="h-6" />

        {/* ── Save button ── */}
        <Button
          size="lg"
          onClick={handleSave}
          disabled={!isValid}
          className={cn(
            "w-full h-14 text-base font-bold rounded-2xl transition-all duration-200",
            "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            isValid && "hover:scale-[1.005] active:scale-[0.997]",
          )}
        >
          {isEditing ? "Update Freelance Job" : "Create Freelance Job"}
        </Button>

        {!isValid && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Studio name, owner name, mobile, venue and photographer name are
            required
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateFreelanceAssignment;
