import React, { useState } from "react";
import {
  Camera,
  Plus,
  Trash2,
  Tag,
  IndianRupee,
  AlignLeft,
  User,
  Mail,
  Wallet,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react";
import { GlassCard, Button, Input, TextArea } from "./UI";

const CreateAssignment = ({ onSave }) => {
  const [currentAssignment, setCurrentAssignment] = useState({
    title: "", // Was packageName/name
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
  });
  const [dateInput, setDateInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");

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
      // Validate better in real app
      console.error("Missing required fields");
    }
  };

  return (
    <GlassCard className="p-6 md:p-10 mb-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-600 opacity-5 rounded-full blur-3xl group-focus-within:opacity-10 transition-opacity"></div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl">
            <Camera size={24} className="text-purple-400 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              New Assignment
            </h2>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest opacity-60">
              Create a new job entry
            </p>
          </div>
        </div>
        <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-purple-500/20 to-transparent mx-6"></div>
      </header>

      {/* Client & Event Details Section */}
      <div className="mb-10 relative z-10 border-b border-[var(--card-border)] pb-8">
        <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Event & Client Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1">
              Client Name
            </label>
            <Input
              type="text"
              icon={User}
              placeholder="e.g. Rahul Chatterjee"
              value={currentAssignment.clientName}
              onChange={(e) =>
                setCurrentAssignment({
                  ...currentAssignment,
                  clientName: e.target.value,
                })
              }
              textOnly
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1">
              Client Contact
            </label>
            <Input
              type="text"
              icon={Phone}
              placeholder="+91 XXXXX XXXXX"
              value={currentAssignment.clientContact}
              onChange={(e) =>
                setCurrentAssignment({
                  ...currentAssignment,
                  clientContact: e.target.value,
                })
              }
              phoneOnly
              maxLength={15}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1">
              Event Dates
            </label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={addDate}
                disabled={!dateInput}
                className="px-4 bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1">
              Total Duration
            </label>
            <div className="h-12 flex items-center px-4 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] font-mono">
              {currentAssignment.photographerDays.length} Day
              {currentAssignment.photographerDays.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1">
              City / Location
            </label>
            <Input
              type="text"
              icon={MapPin}
              placeholder="e.g. Udaipur, Rajasthan"
              value={currentAssignment.location}
              onChange={(e) =>
                setCurrentAssignment({
                  ...currentAssignment,
                  location: e.target.value,
                })
              }
              textOnly
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1">
              Venue Name
            </label>
            <Input
              type="text"
              icon={MapPin}
              placeholder="e.g. The Oberoi Udaivilas"
              value={currentAssignment.venue}
              onChange={(e) =>
                setCurrentAssignment({
                  ...currentAssignment,
                  venue: e.target.value,
                })
              }
              maxLength={100}
            />
          </div>
        </div>

        {/* Selected Days Display */}
        {currentAssignment.photographerDays.length > 0 && (
          <div className="mt-6 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)]">
            <label className="block text-[11px] font-black uppercase tracking-widest text-purple-400 mb-3">
              Selected Coverage Dates
            </label>
            <div className="flex flex-wrap gap-2">
              {currentAssignment.photographerDays.map((dateStr, i) => {
                const d = new Date(dateStr);
                return (
                  <div
                    key={dateStr}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-200 text-xs font-medium group hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300 transition-all cursor-pointer"
                    onClick={() => removeDate(dateStr)}
                  >
                    <span>
                      {d.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Trash2
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 relative z-10">
        <div className="col-span-1 lg:col-span-2 space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1">
            Assignment Title
          </label>
          <Input
            type="text"
            icon={Tag}
            placeholder="e.g., Wedding - Rahul & Priya"
            value={currentAssignment.title}
            onChange={(e) =>
              setCurrentAssignment({
                ...currentAssignment,
                title: e.target.value,
              })
            }
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1">
            Total Amount (₹)
          </label>
          <Input
            type="text"
            icon={IndianRupee}
            placeholder="50000"
            value={currentAssignment.amount}
            onChange={(e) =>
              setCurrentAssignment({
                ...currentAssignment,
                amount: e.target.value,
              })
            }
            numberOnly
            maxLength={10}
          />
        </div>

        <div className="col-span-full space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1">
            Description / Notes
          </label>
          <TextArea
            icon={AlignLeft}
            placeholder="Any specific details or shot lists..."
            value={currentAssignment.description}
            onChange={(e) =>
              setCurrentAssignment({
                ...currentAssignment,
                description: e.target.value,
              })
            }
            className="h-28"
            maxLength={500}
          />
            value={currentAssignment.description}
            onChange={(e) =>
              setCurrentAssignment({
                ...currentAssignment,
                description: e.target.value,
              })
            }
            className="h-28"
          />
        </div>
      </div>

      <div className="mb-12 relative z-10">
        <label className="block text-[11px] font-black uppercase tracking-widest text-purple-400 ml-1 mb-3">
          Service Inclusions / Deliverables
        </label>
        <div className="flex gap-3 mb-6 p-1.5 bg-[var(--input-bg)] rounded-2xl border border-[var(--card-border)]">
          <Input
            type="text"
            placeholder="e.g., 200+ Edited High-Res Photos"
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addService()}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-4"
          />
          <Button
            onClick={addService}
            className="bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20 py-3 rounded-xl min-w-[120px]"
          >
            <Plus size={20} />
            <span>Add Item</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {currentAssignment.services.map((service, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors animate-in zoom-in-95 duration-300"
            >
              <span className="text-sm font-medium text-[var(--text-primary)] opacity-80">
                {service}
              </span>
              <button
                onClick={() => removeService(index)}
                className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all text-white/30"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {currentAssignment.services.length === 0 && (
            <p className="text-xs text-purple-300/30 italic ml-1">
              No items added yet...
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={handleSave}
        className="w-full py-5 text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-purple-600/40 rounded-2xl"
      >
        Create Assignment
      </Button>
    </GlassCard>
  );
};

export default CreateAssignment;
