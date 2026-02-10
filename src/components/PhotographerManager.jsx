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
  Plus,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Users size={28} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">
              Artist Collective
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Strategic partner management and oversight
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAdd(!showAdd)}
          variant={showAdd ? "outline" : "default"}
          className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] gap-2 shadow-lg"
        >
          {showAdd ? (
            "Cancel Onboarding"
          ) : (
            <>
              <UserPlus size={16} />
              Onboard Artist
            </>
          )}
        </Button>
      </div>

      {showAdd && (
        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl animate-in slide-in-from-top-4 duration-500 overflow-hidden">
          <CardHeader className="bg-primary/[0.03] border-b border-primary/5 pb-6">
            <CardTitle className="text-base font-black uppercase tracking-wider">
              New Artist Onboarding
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Initialize a new secure account for a collective partner.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6"
            >
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
                  Artist Full Name
                </Label>
                <div className="relative">
                  <Input
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10 h-12"
                    required
                  />
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
                  Email Identity
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="artist@shuttersync.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-12"
                    required
                  />
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
                  Contact Access
                </Label>
                <div className="relative">
                  <Input
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    className="pl-10 h-12"
                    required
                  />
                  <Phone
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
                  UPI Handle
                </Label>
                <div className="relative">
                  <Input
                    placeholder="artist@upi"
                    value={formData.upiId}
                    onChange={(e) =>
                      setFormData({ ...formData, upiId: e.target.value })
                    }
                    className="pl-10 h-12"
                    required
                  />
                  <Wallet
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
                  Access Password
                </Label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 h-12"
                    required
                  />
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 shadow-lg"
                >
                  <Plus size={16} />
                  Initialize Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photographers.map((artist) => (
          <Card
            key={artist._id}
            className="border-none shadow-lg bg-card/40 backdrop-blur-sm hover:shadow-2xl hover:bg-card/60 transition-all duration-300 group overflow-hidden"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-primary-foreground shadow-lg shadow-primary/20">
                    {artist.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-black tracking-tight">
                      {artist.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={artist.active ? "default" : "destructive"}
                        className="rounded-lg px-2 py-0 text-[9px] font-black uppercase tracking-wider"
                      >
                        {artist.active ? "Active Partner" : "Suspended"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      onUpdate(artist._id, { active: !artist.active })
                    }
                    className="h-8 w-8 rounded-lg hover:text-primary hover:bg-primary/10"
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Permanently remove ${artist.name} from the collective?`,
                        )
                      ) {
                        onDelete(artist._id);
                      }
                    }}
                    className="h-8 w-8 rounded-lg hover:text-secondary hover:bg-secondary/10"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/5">
                  <Mail size={14} className="text-primary/70" />
                  <span className="truncate">{artist.email}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/5">
                  <Phone size={14} className="text-primary/70" />
                  <span>{artist.contact}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/5">
                  <Wallet size={14} className="text-primary/70" />
                  <span className="font-mono">{artist.upiId}</span>
                </div>
              </div>
            </CardContent>

            <div className="absolute -bottom-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110 pointer-events-none">
              <Users size={80} className="text-primary" />
            </div>
          </Card>
        ))}

        {photographers.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-muted rounded-3xl bg-muted/10">
            <div className="inline-block p-6 bg-muted/20 rounded-full mb-6 text-muted-foreground/30">
              <Users size={64} />
            </div>
            <h3 className="text-xl font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Exclusive Network Vacant
            </h3>
            <p className="text-xs font-semibold text-muted-foreground/40 max-w-[250px] mx-auto uppercase tracking-tighter">
              Initiate the onboarding process to expand your collective partner
              network.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
