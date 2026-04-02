import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Camera,
  Plus,
  Trash2,
  Tag,
  IndianRupee,
  AlignLeft,
  User,
  Phone,
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  Circle,
  Sparkles,
  FileText,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { cn } from "../lib/utils";
import { format } from "date-fns";

// ─── Reusable Field wrapper ───────────────────────────────────────────────────

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

const Section = ({ icon: Icon, title, color = "text-primary", bg = "bg-primary/10", children }) => (
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

// ─── Create Assignment ────────────────────────────────────────────────────────

const CreateAssignment = ({ onSave, initialAssignment = null, isEditing = false }) => {
  const [form, setForm] = useState(
    initialAssignment || {
      title: "",
      description: "",
      services: [],
      amount: "",
      paidAmount: "0",
      clientName: "",
      clientContact: "",
      eventStartDate: "",
      eventDuration: 0,
      location: "",
      venue: "",
      photographerDays: [],
      conditions: [],
      brideName: "",
      groomName: "",
      isBothSides: false,
      brideLocation: "",
      brideVenue: "",
      groomLocation: "",
      groomVenue: "",
    }
  );

  const agreements = useQuery(api.agreements.get) || [];
  const [dateInput, setDateInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");

  const validate = {
    textOnly: (v) => /^[a-zA-Z\s]*$/.test(v),
    numberOnly: (v) => /^[0-9]*$/.test(v),
    phone: (v) => /^[+]?[0-9]*$/.test(v),
  };

  const set = (field, value, type = null) => {
    let val = value;
    if (type === "numberOnly") {
      val = val.replace(/[^\d]/g, "");
    }
    if (type === "phone") {
      val = val.replace(/[^\d]/g, "").slice(0, 10);
    }
    if (type === "textOnly" && !validate.textOnly(val)) return;
    
    setForm((f) => ({ ...f, [field]: val }));
  };

  const addService = () => {
    if (!serviceInput.trim()) return;
    setForm((f) => ({ ...f, services: [...f.services, serviceInput.trim()] }));
    setServiceInput("");
  };

  const removeService = (i) =>
    setForm((f) => ({ ...f, services: f.services.filter((_, idx) => idx !== i) }));

  const addDate = () => {
    if (!dateInput || form.photographerDays.includes(dateInput)) return;
    const days = [...form.photographerDays, dateInput].sort();
    setForm((f) => ({
      ...f,
      photographerDays: days,
      eventDuration: days.length,
      eventStartDate: days[0] || "",
    }));
    setDateInput("");
  };

  const removeDate = (d) => {
    const days = form.photographerDays.filter((x) => x !== d);
    setForm((f) => ({
      ...f,
      photographerDays: days,
      eventDuration: days.length,
      eventStartDate: days[0] || "",
    }));
  };

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
    if (form.title && form.clientName && form.amount) {
      onSave(form);
    }
  };

  const isValid = form.title && form.clientName && form.amount;

  return (
    <div className="max-w-3xl mx-auto pb-10">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-secondary/10">
            <Camera size={26} className="text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              {isEditing ? "Edit Assignment" : "New Assignment"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing ? "Update the job details below" : "Fill in the details to create a new job"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-0">

        {/* ══ BLOCK 1: Client Details ══ */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <Section icon={User} title="Client Details" color="text-primary" bg="bg-primary/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Client Name" required icon={User}>
                <Input
                  className="pl-9 h-11"
                  placeholder="Rahul Sharma"
                  value={form.clientName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm(f => ({
                      ...f,
                      clientName: val,
                      title: f.title.includes("Wedding") || !f.title ? `Wedding - ${val}` : f.title
                    }));
                  }}
                />
              </Field>
              <Field label="Contact" required icon={Phone}>
                <Input
                  className="pl-9 h-11"
                  placeholder="+91 98765 43210"
                  value={form.clientContact}
                  onChange={(e) => set("clientContact", e.target.value, "phone")}
                />
              </Field>
            </div>
          </Section>
        </div>

        <div className="h-3" />

        {/* ══ BLOCK 2: Event Logistics ══ */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <Section icon={Calendar} title="Event Logistics" color="text-amber-500" bg="bg-amber-500/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {/* Date picker + add */}
              <Field label="Add Event Date" icon={Calendar}>
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

              {/* Duration display */}
              <Field label="Total Duration">
                <div className="h-11 flex items-center px-4 bg-muted/40 border border-border rounded-xl text-sm font-bold text-foreground">
                  {form.photographerDays.length} Day{form.photographerDays.length !== 1 ? "s" : ""}
                </div>
              </Field>
            </div>

            {/* Both Sides Toggle */}
            <div className="pt-2 flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-dashed border-border/50">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl", form.isBothSides ? "bg-secondary/10" : "bg-muted")}>
                  <Sparkles size={16} className={cn(form.isBothSides ? "text-secondary" : "text-muted-foreground")} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Both Side Coverage</h4>
                  <p className="text-[10px] text-muted-foreground">Toggle for separate Bride & Groom venues</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, isBothSides: !f.isBothSides }))}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  form.isBothSides ? "bg-secondary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    form.isBothSides ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {!form.isBothSides ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="City / Location" icon={MapPin}>
                  <Input
                    className="pl-9 h-11"
                    placeholder="Udaipur, Rajasthan"
                    value={form.location}
                    onChange={(e) => setForm(f => ({ ...f, location: e.target.value, brideLocation: e.target.value, groomLocation: e.target.value }))}
                  />
                </Field>

                <Field label="Venue Name" icon={Building2}>
                  <Input
                    className="pl-9 h-11"
                    placeholder="The Oberoi Udaivilas"
                    value={form.venue}
                    onChange={(e) => setForm(f => ({ ...f, venue: e.target.value, brideVenue: e.target.value, groomVenue: e.target.value }))}
                  />
                </Field>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="sm:col-span-2 flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-primary text-primary-foreground px-2 py-0.5 rounded">Bride Side</span>
                  </div>
                  <Field label="Bride City / Location" icon={MapPin}>
                    <Input
                      className="pl-9 h-11"
                      placeholder="Bride's Home/Venue Location"
                      value={form.brideLocation}
                      onChange={(e) => set("brideLocation", e.target.value)}
                    />
                  </Field>
                  <Field label="Bride Venue Name" icon={Building2}>
                    <Input
                      className="pl-9 h-11"
                      placeholder="Bride's Venue"
                      value={form.brideVenue}
                      onChange={(e) => set("brideVenue", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                  <div className="sm:col-span-2 flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-secondary text-secondary-foreground px-2 py-0.5 rounded">Groom Side</span>
                  </div>
                  <Field label="Groom City / Location" icon={MapPin}>
                    <Input
                      className="pl-9 h-11"
                      placeholder="Groom's Home/Venue Location"
                      value={form.groomLocation}
                      onChange={(e) => set("groomLocation", e.target.value)}
                    />
                  </Field>
                  <Field label="Groom Venue Name" icon={Building2}>
                    <Input
                      className="pl-9 h-11"
                      placeholder="Groom's Venue"
                      value={form.groomVenue}
                      onChange={(e) => set("groomVenue", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* Selected dates */}
            {form.photographerDays.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
                  Coverage Dates
                </p>
                <div className="flex flex-wrap gap-2">
                  {form.photographerDays.map((d) => (
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

        {/* ══ BLOCK 3: Assignment Info ══ */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <Section icon={Tag} title="Assignment Info" color="text-secondary" bg="bg-secondary/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Assignment Title" required icon={Tag} className="sm:col-span-2">
                <Input
                  className="pl-9 h-11"
                  placeholder="Wedding – Rahul & Priya"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </Field>

              <Field label="Total Amount" required icon={IndianRupee}>
                <Input
                  className="pl-9 h-11"
                  placeholder="50000"
                  value={form.amount}
                  onChange={(e) => set("amount", e.target.value, "numberOnly")}
                />
              </Field>

              <Field label="Amount Received" icon={IndianRupee}>
                <Input
                  className="pl-9 h-11"
                  placeholder="0"
                  value={form.paidAmount}
                  onChange={(e) => set("paidAmount", e.target.value, "numberOnly")}
                />
              </Field>

              <Field label="Notes / Shot List" icon={AlignLeft} className="sm:col-span-2">
                <Textarea
                  placeholder="Any specific requirements, shot list, or special requests..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="pl-9 pt-2.5 min-h-[100px] resize-none"
                />
              </Field>
            </div>
          </Section>
        </div>

        <div className="h-3" />

        {/* ══ BLOCK 4: Deliverables ══ */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <Section icon={Sparkles} title="Deliverables & Inclusions" color="text-emerald-500" bg="bg-emerald-500/10">

            {/* Input row */}
            <div className="flex gap-2">
              <Input
                className="h-11 flex-1"
                placeholder="e.g. 300+ edited high-res photos"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addService()}
              />
              <Button
                type="button"
                onClick={addService}
                disabled={!serviceInput.trim()}
                className="h-11 px-4 rounded-xl shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus size={16} className="mr-1" /> Add
              </Button>
            </div>

            {/* Service list */}
            {form.services.length > 0 ? (
              <ul className="space-y-2">
                {form.services.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 bg-muted/40 rounded-xl border border-border group"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-foreground">{s}</span>
                    <button
                      type="button"
                      onClick={() => removeService(i)}
                      className="text-muted-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground/50 italic py-1">
                No deliverables added yet. Add items above.
              </p>
            )}
          </Section>
        </div>

        <div className="h-3" />

        {/* ══ BLOCK 5: Terms & Conditions ══ */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <Section icon={FileText} title="Terms & Conditions" color="text-primary" bg="bg-primary/10">
            {agreements.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2 text-center border border-dashed rounded-xl">
                <FileText size={24} className="text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No agreement templates found.
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Add them in the <span className="font-semibold">Agreements</span> section.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {agreements.map((ag) => {
                  const selected = (form.conditions || []).includes(ag.description);
                  return (
                    <button
                      key={ag._id}
                      type="button"
                      onClick={() => toggleCondition(ag.description)}
                      className={cn(
                        "w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150",
                        selected
                          ? "bg-primary/5 border-primary/30 shadow-sm"
                          : "bg-muted/30 border-transparent hover:border-border hover:bg-muted/50"
                      )}
                    >
                      <span className={cn(
                        "mt-0.5 shrink-0 transition-colors",
                        selected ? "text-primary" : "text-muted-foreground/30"
                      )}>
                        {selected ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </span>
                      <p className={cn(
                        "text-sm leading-relaxed",
                        selected ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {ag.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {(form.conditions || []).length > 0 && (
              <p className="text-[11px] text-primary font-semibold">
                {form.conditions.length} condition{form.conditions.length !== 1 ? "s" : ""} selected
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
            isValid && "hover:scale-[1.005] active:scale-[0.997]"
          )}
        >
          {isEditing ? "Update Assignment" : "Create Assignment"}
        </Button>

        {
          !isValid && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              Title, client name and amount are required
            </p>
          )
        }
      </div >
    </div >
  );
};

export default CreateAssignment;
