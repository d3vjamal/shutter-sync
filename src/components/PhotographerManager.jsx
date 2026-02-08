import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Wallet,
  Edit2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  User,
  Lock,
} from "lucide-react";
import { GlassCard, Button, Input } from "./UI";

export default function PhotographerManager({
  photographers = [],
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    upiId: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: "", email: "", contact: "", upiId: "", password: "" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <Users size={24} style={{ color: "var(--primary-color)" }} />
          </div>
          <div>
            <h2
              className="text-2xl font-black uppercase tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Artist Collective
            </h2>
            <p
              className="text-[10px] font-bold uppercase tracking-widest opacity-60"
              style={{ color: "var(--text-secondary)" }}
            >
              Manage photographer accounts
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="shadow-xl">
          <UserPlus size={18} />
          <span>Onboard Artist</span>
        </Button>
      </header>

      {showAdd && (
        <GlassCard className="p-8 animate-in slide-in-from-top-4 duration-500">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="space-y-2">
              <label
                className="text-[10px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Artist Name
              </label>
              <Input
                icon={User}
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-white/5"
                textOnly
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-[10px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Email Identity
              </label>
              <Input
                type="email"
                icon={Mail}
                placeholder="artist@shuttersync.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-white/5"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-[10px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Contact Access
              </label>
              <Input
                icon={Phone}
                placeholder="+91 XXXXX XXXXX"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="bg-white/5"
                phoneOnly
                maxLength={15}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-[10px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                UPI Handle
              </label>
              <Input
                icon={Wallet}
                placeholder="artist@upi"
                value={formData.upiId}
                onChange={(e) =>
                  setFormData({ ...formData, upiId: e.target.value })
                }
                className="bg-white/5"
                alphanumericOnly
                maxLength={255}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-[10px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Secure Password
              </label>
              <Input
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="bg-white/5"
                required
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs"
              >
                Initialize Account
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photographers.map((artist) => (
          <GlassCard
            key={artist._id}
            className="p-6 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                  style={{
                    background: "var(--primary-color)",
                    color: "var(--bg-main)",
                  }}
                >
                  {artist.name.charAt(0)}
                </div>
                <div>
                  <h3
                    className="font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {artist.name}
                  </h3>
                  <p
                    className="text-xs font-bold uppercase tracking-tight flex items-center gap-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {artist.active ? (
                      <ShieldCheck size={12} style={{ color: "#10b981" }} />
                    ) : (
                      <ShieldAlert size={12} style={{ color: "#ef4444" }} />
                    )}
                    {artist.active ? "Active Partner" : "Suspended"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onUpdate(artist._id, { active: !artist.active })
                  }
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    color: "var(--text-secondary)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--card-bg)";
                    e.currentTarget.style.color = "var(--primary-color)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete photographer ${artist.name}?`)) {
                      onDelete(artist._id);
                    }
                  }}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    color: "var(--text-secondary)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                    e.currentTarget.style.color = "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div
              className="space-y-4 pt-4"
              style={{ borderTop: "1px solid var(--card-border)" }}
            >
              <div
                className="flex items-center gap-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <Mail size={14} />
                <span>{artist.email}</span>
              </div>
              <div
                className="flex items-center gap-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <Phone size={14} />
                <span>{artist.contact}</span>
              </div>
              <div
                className="flex items-center gap-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <Wallet size={14} />
                <span>{artist.upiId}</span>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={64} style={{ color: "var(--primary-color)" }} />
            </div>
          </GlassCard>
        ))}

        {photographers.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Users
              size={48}
              className="mx-auto mb-4"
              style={{ color: "var(--card-border)" }}
            />
            <p
              className="font-bold uppercase tracking-[0.3em]"
              style={{ color: "var(--text-secondary)", opacity: 0.3 }}
            >
              No artists onboarded yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
