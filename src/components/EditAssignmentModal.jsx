import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { cn } from "../lib/utils";

const EditAssignmentModal = ({ assignment, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: assignment.title || assignment.packageName || "",
    clientName: assignment.clientName || "",
    clientContact: assignment.clientContact || "",
    amount: assignment.amount || assignment.totalAmount || "",
    paidAmount: assignment.paidAmount || "0",
  });
  const [selectedDate, setSelectedDate] = useState(
    assignment.captureDate ? new Date(assignment.captureDate) : null,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (selectedDate) payload.captureDate = selectedDate.toISOString();
    else payload.captureDate = null;
    onSave(assignment._id, payload);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight">
            Edit Assignment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Assignment Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Wedding Shoot"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="clientName"
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Client Name
              </Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Client Name"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="clientContact"
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Contact Information
              </Label>
              <Input
                id="clientContact"
                name="clientContact"
                value={formData.clientContact}
                onChange={handleChange}
                placeholder="Phone or Email"
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="amount"
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Total Amount (₹)
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="paidAmount"
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Paid Amount (₹)
                </Label>
                <Input
                  id="paidAmount"
                  name="paidAmount"
                  type="number"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  placeholder="0"
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="captureDate"
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
            >
              Capture Date
            </Label>
            <div className="p-3 bg-card/80 rounded-lg border border-border/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 text-sm font-medium text-foreground">
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "No date selected"}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                    className="text-[10px]"
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="rounded-md">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="react-day-picker bg-card p-2 rounded-lg"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 flex gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 sm:flex-none font-bold uppercase text-[10px] tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 sm:flex-none font-bold uppercase text-[10px] tracking-widest gap-2"
            >
              <Save size={14} className="icon-contrast" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssignmentModal;
