import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Camera,
  Share2,
  Layers,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";

const COVER_URL =
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2070";

export default function PublicPhotographerPage() {
  const { id } = useParams(); // may be a username or a raw Convex ID
  const photographer = useQuery(api.photographers.getBySlug, id ? { slug: id } : "skip");
  const packages = useQuery(
    api.packages.listByPhotographer,
    photographer?._id ? { photographerId: photographer._id } : "skip"
  ) || [];

  // SEO Updates
  React.useEffect(() => {
    if (photographer) {
      document.title = `${photographer.name} | Professional Photographer | ShutterSync`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", photographer.bio || `View ${photographer.name}'s professional photography portfolio and packages on ShutterSync.`);
      }
    }
    return () => {
      document.title = "ShutterSync";
    };
  }, [photographer]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Profile link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link.");
    });
  };

  const socials = [
    { platform: "Instagram", icon: Instagram, url: photographer?.instagram ? `https://instagram.com/${photographer.instagram.replace('@', '')}` : null },
    { platform: "Facebook", icon: Facebook, url: photographer?.facebook ? `https://facebook.com/${photographer.facebook}` : null },
    { platform: "Twitter", icon: Twitter, url: photographer?.twitter ? `https://twitter.com/${photographer.twitter.replace('@', '')}` : null },
  ].filter(s => s.url);

  if (!id)
    return <div className="min-h-screen flex items-center justify-center">Invalid photographer ID</div>;
  if (photographer === undefined) return <LoadingSpinner />;
  if (!photographer)
    return <div className="min-h-screen flex items-center justify-center">Photographer not found</div>;

  const galleryPhotos = photographer.photos || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={COVER_URL}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar / Profile Card */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="glass-card rounded-3xl p-6 text-center premium-shadow">
              <div className="relative inline-block mb-4">
                <img
                  src={photographer.avatarUrl || "/static/icons/logo.png"}
                  alt={photographer.name}
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-background shadow-xl mx-auto"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg">
                  <Camera size={16} />
                </div>
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight mb-1">{photographer.name}</h1>
              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">
                {photographer.roleName || "Professional Photographer"}
              </p>

              <div className="space-y-4 text-left border-t border-white/10 pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-muted-foreground" />
                  <span className="truncate">{photographer.email}</span>
                </div>
                {photographer.contact && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>{photographer.contact}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span>Available Globally</span>
                </div>
              </div>

              {/* Socials */}
              {socials.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Contact Socially</h4>
                  <div className="flex justify-center gap-3">
                    {socials.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-accent/10 hover:bg-accent hover:text-white transition-all duration-300"
                        title={social.platform}
                      >
                        <social.icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-8">
                <Button className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[11px] shadow-xl hover-lift">
                  Inquire Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="rounded-2xl h-12 w-12 border-primary/20 hover:border-primary transition-all"
                  title="Share Profile"
                >
                  <Share2 size={18} />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-12">
            {/* Bio */}
            {photographer.bio && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">The Storyteller</h3>
                <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground italic">
                  "{photographer.bio}"
                </p>
              </section>
            )}

            {/* Gallery */}
            {galleryPhotos.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Visual Portfolio</h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                    Scroll for more <ExternalLink size={10} />
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryPhotos.map((url, idx) => (
                    <div key={idx} className="relative overflow-hidden rounded-2xl group aspect-[4/5] shadow-xl">
                      <img
                        src={url}
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                          <Camera size={24} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Photographer Service Packages */}
        {packages.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-2.5 mb-8 ml-1">
              <Layers size={14} className="text-primary" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">
                Photographer Service Packages
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className={`glass-card p-8 rounded-3xl flex flex-col h-full hover-lift border-2 ${
                    pkg.popular
                      ? "border-primary/50 ring-2 ring-primary/10"
                      : "border-white/5"
                  }`}
                >
                  {pkg.popular && (
                    <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-full self-start mb-4">
                      Most Popular
                    </span>
                  )}
                  <h4 className="text-xl font-black uppercase leading-none mb-1">
                    {pkg.name}
                  </h4>
                  {pkg.price && (
                    <div className="text-3xl font-black mb-4">
                      <span className="text-sm align-top mr-1">₹</span>
                      {pkg.price}
                    </div>
                  )}
                  {pkg.description && (
                    <p className="text-sm text-muted-foreground mb-6 flex-grow">
                      {pkg.description}
                    </p>
                  )}
                  {pkg.services?.length > 0 && (
                    <ul className="space-y-3 mt-auto">
                      {pkg.services.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-xs font-bold text-muted-foreground"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-primary shrink-0 mt-0.5"
                          />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

