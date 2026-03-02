import React, { useState, useEffect, useRef, useDeferredValue } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import { toast } from "react-toastify";
import AppLayout from "../components/layouts/AppLayout";
import Header from "../components/Header";
import {
  Camera,
  Instagram,
  Facebook,
  Twitter,
  User,
  Phone,
  Wallet,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  Share2,
  Briefcase,
} from "lucide-react";

export default function ProfilePage() {
  const { user, handleLogout } = useAuth();
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    upiId: "",
    bio: "",
    instagram: "",
    facebook: "",
    twitter: "",
    username: "",
  });
  const [usernameInput, setUsernameInput] = useState(""); // raw value before debounce
  const deferredUsername = useDeferredValue(usernameInput);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [brandLogoUrl, setBrandLogoUrl] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("identity"); // identity, socials, portfolio, brand

  // Live username availability — only fires when deferredUsername is valid
  const usernameValid = /^[a-z0-9_]{3,20}$/.test(deferredUsername);
  const usernameCheck = useQuery(
    api.users.checkUsername,
    usernameValid ? { username: deferredUsername } : "skip"
  );
  // Determine status for UI
  const usernameStatus = !usernameInput
    ? "empty"
    : !/^[a-z0-9_]{3,20}$/.test(usernameInput)
      ? "invalid"
      : deferredUsername !== usernameInput
        ? "checking"
        : usernameCheck === undefined
          ? "checking"
          : usernameCheck.available
            ? "available"
            : "taken";

  const avatarInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const brandLogoInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        contact: user.contact || "",
        upiId: user.upiId || "",
        bio: user.bio || "",
        instagram: user.instagram || "",
        facebook: user.facebook || "",
        twitter: user.twitter || "",
        username: user.username || "",
      });
      setUsernameInput(user.username || "");
      setAvatarUrl(user.avatarUrl || "");
      setBrandLogoUrl(user.brandLogoUrl || "");
      setPhotos(user.photos || []);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "username") {
      const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
      setUsernameInput(sanitized);
      setFormData(prev => ({ ...prev, username: sanitized }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const shareProfile = () => {
    if (!user?._id) return;
    const slug = user.username || user._id;
    const url = `${window.location.origin}/photographer/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Public profile link copied!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      if (type === "avatar") {
        await updateUserProfile({ avatarUrl: storageId });
        toast.success("Profile photo updated");
      } else if (type === "brandLogo") {
        await updateUserProfile({ brandLogoUrl: storageId });
        toast.success("Brand logo updated");
      } else {
        const currentPhotos = user.photos || [];
        const updatedPhotos = [...currentPhotos, storageId].slice(0, 6);
        await updateUserProfile({ photos: updatedPhotos });
        toast.success("Gallery photo added");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async (index) => {
    const currentPhotos = user.photos || [];
    const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
    try {
      await updateUserProfile({ photos: updatedPhotos });
      toast.info("Photo removed");
    } catch (err) {
      toast.error("Failed to remove photo");
    }
  };

  const handleSaveAll = async () => {
    // Guard: if username is non-empty, it must pass validation and be available
    if (formData.username) {
      if (!/^[a-z0-9_]{3,20}$/.test(formData.username)) {
        toast.error("Username must be 3–20 characters: letters, numbers, underscores only.");
        return;
      }
      if (usernameStatus === "taken") {
        toast.error("That username is already taken. Choose another.");
        return;
      }
      if (usernameStatus === "checking") {
        toast.error("Still checking username availability — please wait a moment.");
        return;
      }
    }
    try {
      await updateUserProfile(formData);
      toast.success("All profile details updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <AppLayout
      user={user}
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
    >
      <Header
        user={user}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-1/4 space-y-2">
            {[
              { id: "identity", label: "Identity", icon: User },
              { id: "brand", label: "Brand", icon: Briefcase },
              { id: "socials", label: "Social Presence", icon: Instagram },
              { id: "portfolio", label: "Portfolio", icon: ImageIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-accent/10"
                  }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
            <div className="pt-8 px-2 space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Account Health</p>
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-bold">Public Profile Verified</span>
                </div>
              </div>

              <Button
                onClick={shareProfile}
                variant="outline"
                className="w-full h-10 rounded-xl border-primary/20 hover:border-primary text-[10px] font-black uppercase tracking-widest gap-2"
              >
                <Share2 size={14} />
                Share Public Page
              </Button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <Card className="glass-card border-none shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                {activeTab === "identity" && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex flex-col items-center gap-6 pb-8 border-b border-white/10">
                      <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current.click()}>
                        <img
                          src={avatarUrl || "/static/icons/logo.png"}
                          alt="Avatar"
                          className="w-32 h-32 rounded-3xl object-cover border-4 border-background shadow-xl hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/40 backdrop-blur-md p-2 rounded-xl text-white">
                            <Upload size={20} />
                          </div>
                        </div>
                        <input
                          type="file"
                          ref={avatarInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "avatar")}
                        />
                      </div>
                      <div className="text-center">
                        <h2 className="text-xl font-black uppercase tracking-tight">{formData.name}</h2>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Public Identity</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Full Name</Label>
                        <Input id="name" value={formData.name} onChange={handleInputChange} className="h-12 rounded-xl bg-background/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Contact Number</Label>
                        <Input id="contact" value={formData.contact} onChange={handleInputChange} className="h-12 rounded-xl bg-background/50" />
                      </div>
                      {/* Username */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
                          Public Username
                        </Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground select-none">@</span>
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="h-12 pl-9 pr-28 rounded-xl bg-background/50 font-mono"
                            placeholder="yourname"
                            maxLength={20}
                          />
                          {/* Status badge */}
                          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            usernameStatus === "available"
                              ? "bg-green-500/15 text-green-600"
                              : usernameStatus === "taken"
                                ? "bg-red-500/15 text-red-500"
                                : usernameStatus === "checking"
                                  ? "bg-yellow-500/15 text-yellow-600"
                                  : usernameStatus === "invalid"
                                    ? "bg-red-500/10 text-red-400"
                                    : "hidden"
                          }`}>
                            {usernameStatus === "available" && "✓ Available"}
                            {usernameStatus === "taken" && "✗ Taken"}
                            {usernameStatus === "checking" && "Checking…"}
                            {usernameStatus === "invalid" && "Invalid"}
                          </span>
                        </div>
                        {/* URL preview */}
                        {formData.username && usernameStatus === "available" && (
                          <p className="text-[10px] text-muted-foreground ml-1 font-mono">
                            {window.location.origin}/photographer/<span className="text-primary font-bold">{formData.username}</span>
                          </p>
                        )}
                        {!formData.username && user?.username && (
                          <p className="text-[10px] text-muted-foreground ml-1 font-mono">
                            Current: {window.location.origin}/photographer/<span className="text-primary font-bold">{user.username}</span>
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground/60 ml-1">
                          3–20 chars · letters, numbers and _ only · no spaces
                        </p>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="upiId" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">UPI ID for Payments</Label>
                        <Input id="upiId" value={formData.upiId} onChange={handleInputChange} className="h-12 rounded-xl bg-background/50 font-mono" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">About the Storyteller</Label>
                        <Textarea id="bio" value={formData.bio} onChange={handleInputChange} className="min-h-[120px] rounded-xl bg-background/50 py-3" placeholder="Describe your style and passion..." />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "brand" && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight mb-1">Brand Identity</h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        Your brand logo appears on the top-left of every Service Agreement PDF.
                      </p>
                    </div>

                    {/* Brand Logo Upload */}
                    <div className="flex flex-col items-center gap-6">
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => brandLogoInputRef.current.click()}
                      >
                        {brandLogoUrl ? (
                          <img
                            src={brandLogoUrl}
                            alt="Brand Logo"
                            className="w-40 h-40 rounded-2xl object-contain border-4 border-background shadow-xl bg-white hover:opacity-80 transition-opacity p-2"
                          />
                        ) : (
                          <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-3 hover:border-primary/60 hover:bg-primary/10 transition-all">
                            <Briefcase size={32} className="text-primary/40" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              Upload Logo
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/40 backdrop-blur-md p-2 rounded-xl text-white">
                            <Upload size={20} />
                          </div>
                        </div>
                        <input
                          type="file"
                          ref={brandLogoInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "brandLogo")}
                        />
                      </div>

                      <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-foreground">
                          {formData.name || "Your Studio"}
                        </p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                          Brand / Studio Logo
                        </p>
                        {brandLogoUrl && (
                          <button
                            onClick={async () => {
                              try {
                                await updateUserProfile({ brandLogoUrl: "" });
                                setBrandLogoUrl("");
                                toast.info("Brand logo removed");
                              } catch {
                                toast.error("Failed to remove logo");
                              }
                            }}
                            className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase tracking-widest mt-2 block mx-auto"
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Preview card */}
                    <div className="rounded-2xl border border-white/10 bg-background/40 p-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                        Agreement Header Preview
                      </p>
                      <div className="bg-white rounded-xl p-4 flex items-center justify-between gap-4">
                        {/* Left: brand logo */}
                        <div className="flex items-center gap-3 flex-1">
                          {brandLogoUrl ? (
                            <img
                              src={brandLogoUrl}
                              alt="Brand"
                              className="w-10 h-10 rounded-lg object-contain"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                              <Briefcase size={16} className="text-slate-400" />
                            </div>
                          )}
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {formData.name || "Your Brand"}
                          </span>
                        </div>
                        {/* Center: title */}
                        <div className="text-center flex-1">
                          <div className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-700">
                            Service Agreement
                          </div>
                        </div>
                        {/* Right: app logo */}
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <img
                            src="/static/icons/logo.png"
                            alt="ShutterSync"
                            className="w-8 h-8 rounded-lg object-cover"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          <span className="text-[10px] font-bold text-slate-700">ShutterSync</span>
                        </div>
                      </div>
                    </div>

                    {isUploading && (
                      <div className="flex items-center gap-2 justify-center text-muted-foreground text-xs">
                        <Loader2 size={14} className="animate-spin" />
                        Uploading…
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "socials" && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="pb-4">
                      <h3 className="text-lg font-black uppercase tracking-tight mb-1">Social Ecosystem</h3>
                      <p className="text-xs text-muted-foreground font-medium">Connect your platforms to build credibility.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="instagram" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Instagram Handle</Label>
                        <div className="relative">
                          <Input id="instagram" value={formData.instagram} onChange={handleInputChange} className="h-12 pl-12 rounded-xl bg-background/50" placeholder="@handle" />
                          <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={20} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Facebook Page</Label>
                        <div className="relative">
                          <Input id="facebook" value={formData.facebook} onChange={handleInputChange} className="h-12 pl-12 rounded-xl bg-background/50" placeholder="Studio Name" />
                          <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={20} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Twitter Account</Label>
                        <div className="relative">
                          <Input id="twitter" value={formData.twitter} onChange={handleInputChange} className="h-12 pl-12 rounded-xl bg-background/50" placeholder="@handle" />
                          <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "portfolio" && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight mb-1">Visual Portfolio</h3>
                        <p className="text-xs text-muted-foreground font-medium">Upload up to 6 of your best shots.</p>
                      </div>
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                        {photos.length}/6 Slots
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photos.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-primary transition-all">
                          <img src={url} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <button
                            onClick={() => removePhoto(idx)}
                            className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      {photos.length < 6 && (
                        <button
                          onClick={() => galleryInputRef.current.click()}
                          className="aspect-square rounded-2xl border-2 border-dashed border-primary/20 hover:border-primary/50 flex flex-col items-center justify-center gap-2 bg-primary/5 transition-all text-muted-foreground hover:text-primary animate-pulse-subtle"
                        >
                          {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
                          <span className="text-[10px] font-black uppercase tracking-widest">Add Work</span>
                        </button>
                      )}
                      <input
                        type="file"
                        ref={galleryInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "gallery")}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Last Sync: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <Button onClick={handleSaveAll} className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover-lift">
                    Preserve Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Plus({ size }) {
  return <Upload size={size} />;
}

