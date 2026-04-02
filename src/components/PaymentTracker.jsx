import React, { useState } from "react";
import {
  IndianRupee,
  Plus,
  Trash2,
  Calendar,
  FileText,
  Receipt,
  X,
  Loader2,
  StickyNote,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { usePayments } from "../hooks/usePayments";
import { useAuth } from "../hooks/useAuth";
import PaymentReceiptDialog from "./PaymentReceiptDialog";

// ─── Payment Tracker Dialog ──────────────────────────────────────────────────

export default function PaymentTracker({
  parentId,
  parentType, // "assignment" | "freelance"
  title,
  clientName,
  totalAmount,
  open,
  onOpenChange,
}) {
  const { user } = useAuth();
  const { payments, isLoading, addPayment, removePayment } = usePayments(parentId);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const total = Number(totalAmount || 0);
  const balance = Math.max(0, total - totalPaid);
  const pct = total > 0 ? Math.min(100, Math.round((totalPaid / total) * 100)) : 0;

  const handleAdd = async () => {
    if (!amount || Number(amount) <= 0) return;
    setSaving(true);
    await addPayment({
      parentId,
      parentType,
      photographerId: user._id,
      amount,
      date,
      note: note.trim() || undefined,
    });
    setAmount("");
    setNote("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await removePayment(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md w-full rounded-2xl p-0 gap-0 overflow-hidden border border-border [&>button:last-child]:hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10">
                <Receipt size={16} className="text-primary" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold leading-tight">
                  Payments
                </DialogTitle>
                <DialogDescription className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[200px]">
                  {title}
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1" style={{ maxHeight: "calc(90vh - 160px)" }}>
          {/* Summary strip */}
          <div className="px-5 py-3 bg-muted/30 border-b border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Payment Progress
              </span>
              <span className="text-xs font-bold text-foreground">
                {pct}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                ₹{totalPaid.toLocaleString()} paid
              </span>
              {balance > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  ₹{balance.toLocaleString()} due
                </span>
              )}
              <span className="text-muted-foreground font-semibold">
                of ₹{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Add Payment Form */}
          <div className="px-5 py-4 border-b border-border/50">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Add Payment
            </p>
            <div className="grid grid-cols-2 gap-2.5 mb-2.5">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">
                  Amount (₹)
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">
                  Date
                </label>
                <Input
                  type="date"
                  max={format(new Date(), "yyyy-MM-dd")}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">
                Note
              </label>
              <Input
                placeholder="Phonepe, Gpay, Cash, UPI..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <Button
              onClick={handleAdd}
              disabled={saving || !amount || Number(amount) <= 0}
              className="w-full h-9 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saving ? (
                <><Loader2 size={13} className="mr-1.5 animate-spin" />Saving…</>
              ) : (
                <><Plus size={13} className="mr-1" />Add Payment</>
              )}
            </Button>
          </div>

          {/* Payment History */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Payment History
              </p>
              {payments.length > 0 && (
                <PaymentReceiptDialog
                  payments={payments}
                  title={title}
                  clientName={clientName}
                  totalAmount={total}
                  totalPaid={totalPaid}
                  balance={balance}
                />
              )}
            </div>

            {isLoading ? (
              <div className="py-8 flex items-center justify-center">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              </div>
            ) : payments.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center border border-dashed rounded-2xl bg-muted/20 gap-2">
                <IndianRupee size={24} className="opacity-20 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">No payments recorded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {payments.map((p, idx) => (
                  <div
                    key={p._id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 group hover:border-border transition-colors"
                  >
                    {/* Index badge */}
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-black text-primary">
                        {payments.length - idx}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-foreground">
                          ₹{Number(p.amount).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar size={9} />
                          {format(new Date(p.date), "dd MMM yyyy")}
                        </span>
                      </div>
                      {p.note && (
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          <StickyNote size={9} className="shrink-0" />
                          <span className="truncate">{p.note}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                      title="Delete this entry"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
