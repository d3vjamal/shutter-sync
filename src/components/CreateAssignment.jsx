import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";

import { cn } from "../lib/utils";

const CreateAssignment = ({
  onSave,
  initialAssignment = null,
  isEditing = false,
}) => {
  const [currentAssignment, setCurrentAssignment] = useState(
    initialAssignment || {
      title: "",
      description: "",
      services: [],
      amount: "",
      clientName: "",
      clientContact: "",
      eventStartDate: "",
      eventDuration: 0,
      location: "",
      venue: "",
      photographerDays: [],
      paidAmount: "0",
    },
  );
  const [dateInput, setDateInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");

  const validationRules = {
    textOnly: (value) => /^[a-zA-Z\s]*$/.test(value),
    numberOnly: (value) => /^[0-9]*$/.test(value),
    phone: (value) => /^[+]*[0-9]*$/.test(value),
  };

  const addService = () => {
    if (serviceInput.trim()) {
      setCurrentAssignment({
        ...currentAssignment,
        services: [...currentAssignment.services, serviceInput.trim()],
      });
      setServiceInput("");
    }
  };

  const removeService = (index) => {
    setCurrentAssignment({
      ...currentAssignment,
      services: currentAssignment.services.filter((_, i) => i !== index),
    });
  };

  const addDate = () => {
    if (dateInput && !currentAssignment.photographerDays.includes(dateInput)) {
      const newDays = [...currentAssignment.photographerDays, dateInput].sort();
      setCurrentAssignment({
        ...currentAssignment,
        photographerDays: newDays,
        eventDuration: newDays.length,
        eventStartDate: newDays[0] || "",
      });
      setDateInput("");
    }
  };

  const removeDate = (dateToRemove) => {
    const newDays = currentAssignment.photographerDays.filter(
      (d) => d !== dateToRemove,
    );
    setCurrentAssignment({
      ...currentAssignment,
      photographerDays: newDays,
      eventDuration: newDays.length,
      eventStartDate: newDays[0] || "",
    });
  };

  const handleSave = () => {
    if (
      currentAssignment.title &&
      currentAssignment.clientName &&
      currentAssignment.amount
    ) {
      onSave(currentAssignment);
    } else {
      console.error("Missing required fields");
    }
  };

  const handleInputChange = (field, value, type = null) => {
    if (type === "textOnly" && !validationRules.textOnly(value)) return;
    if (type === "numberOnly" && !validationRules.numberOnly(value)) return;
    if (type === "phone" && !validationRules.phone(value)) return;

    setCurrentAssignment({
      ...currentAssignment,
      [field]: value,
    });
  };

  return (
    <Card className="max-w-4xl mx-auto mb-12 shadow-lg border-none bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="p-6 md:p-10 border-b">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Camera size={38} className="text-secondary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">
              {isEditing ? "Edit Assignment" : "New Assignment"}
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
              {isEditing ? "Update job details" : "Create a new job entry"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-10 space-y-10">
        {/* Client & Event Details Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-widest text-primary">
              Event & Client Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Client Name
              </Label>
              <div className="relative">
                <Input
                  className="pl-10 h-12"
                  placeholder="Rahul Chatterjee"
                  value={currentAssignment.clientName}
                  onChange={(e) =>
                    handleInputChange("clientName", e.target.value, "textOnly")
                  }
                />
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-secondary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Client Contact
              </Label>
              <div className="relative">
                <Input
                  className="pl-10 h-12"
                  placeholder="+91 XXXXX XXXXX"
                  value={currentAssignment.clientContact}
                  onChange={(e) =>
                    handleInputChange("clientContact", e.target.value, "phone")
                  }
                />
                <Phone
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-secondary"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Event Dates
              </Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="h-12"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                  onClick={addDate}
                  disabled={!dateInput}
                >
                  <Plus size={30} className="text-primary" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Total Duration
              </Label>
              <div className="h-12 flex items-center px-4 bg-muted/30 border rounded-xl text-sm font-bold">
                {currentAssignment.photographerDays.length} Day
                {currentAssignment.photographerDays.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                City / Location
              </Label>
              <div className="relative">
                <Input
                  className="pl-10 h-12"
                  placeholder="Udaipur, Rajasthan"
                  value={currentAssignment.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value, "textOnly")
                  }
                />
                <MapPin
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-secondary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Venue Name
              </Label>
              <div className="relative">
                <Input
                  className="pl-10 h-12"
                  placeholder="The Oberoi Udaivilas"
                  value={currentAssignment.venue}
                  onChange={(e) => handleInputChange("venue", e.target.value)}
                />
                <MapPin
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-secondary"
                />
              </div>
            </div>
          </div>

          {/* Selected Days Display */}
          {currentAssignment.photographerDays.length > 0 && (
            <div className="p-4 bg-muted/20 rounded-2xl border border-dashed border-primary/20">
              <Label className="block text-[10px] font-bold uppercase tracking-tight text-primary/60 mb-3">
                Selected Coverage Dates
              </Label>
              <div className="flex flex-wrap gap-2">
                {currentAssignment.photographerDays.map((dateStr) => {
                  const d = new Date(dateStr);
                  return (
                    <Badge
                      key={dateStr}
                      variant="outline"
                      className="flex items-center gap-2 py-2 px-3  group cursor-pointer hover:bg-secondary/10 hover:text-secondary hover:border-secondary/30 transition-all font-medium"
                      onClick={() => removeDate(dateStr)}
                    >
                      <span>
                        {d.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <Trash2 size={12} className="text-secondary" />
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Assignment Title
              </Label>
              <div className="relative">
                <Input
                  className="pl-10 h-12"
                  placeholder="Wedding - Rahul & Priya"
                  value={currentAssignment.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
                <Tag
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-secondary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Total Amount
              </Label>
              <div className="relative">
                <Input
                  className="pl-10 h-12"
                  placeholder="50000"
                  value={currentAssignment.amount}
                  onChange={(e) =>
                    handleInputChange("amount", e.target.value, "numberOnly")
                  }
                />
                <IndianRupee
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-secondary"
                />
              </div>
            </div>
            <div className="col-span-full space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Description / Notes
              </Label>
              <div className="relative">
                <Textarea
                  placeholder="Any specific details or shot lists..."
                  value={currentAssignment.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="min-h-[120px] pt-10"
                />
                <AlignLeft
                  size={18}
                  className="absolute left-3.5 top-4 text-muted-foreground/50"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-6 border-t">
          <Label className="block text-xs font-black uppercase tracking-widest text-primary ml-1">
            Service Inclusions / Deliverables
          </Label>
          <div className="flex gap-3 p-1.5 bg-muted/30 rounded-2xl border">
            <Input
              placeholder="e.g. 200+ Edited High-Res Photos"
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addService()}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 h-11 px-4"
            />
            <Button
              size="sm"
              onClick={addService}
              className="rounded-xl px-6 h-11 font-bold"
            >
              <Plus size={18} className="mr-2" />
              Add Item
            </Button>
          </div>

          <div className="flex flex-wrap gap-2.5 min-h-[40px]">
            {currentAssignment.services.map((service, index) => (
              <Badge
                key={index}
                variant="primary"
                className="py-2 px-4 rounded-xl flex items-center gap-2 font-medium bg-background border shadow-sm group hover:border-secondary/30 transition-all"
              >
                <span>{service}</span>
                <button
                  onClick={() => removeService(index)}
                  className="text-muted-foreground/40 hover:text-secondary transition-colors"
                >
                  <Trash2 size={14} className="text-secondary" />
                </button>
              </Badge>
            ))}
            {currentAssignment.services.length === 0 && (
              <p className="text-xs text-muted-foreground/40 italic ml-1">
                No items added yet...
              </p>
            )}
          </div>
        </section>

        <Button
          size="lg"
          onClick={handleSave}
          className="w-full h-16 text-lg bg-secondary font-bold shadow-xl shadow-primary/20 rounded-2xl transition-all hover:scale-[1.005] active:scale-[0.995]"
        >
          {isEditing ? "Update Assignment" : "Create Assignment"}
        </Button>
      </CardContent>
    </Card>
  );
};
export default CreateAssignment;
