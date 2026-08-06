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
  MessageCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";

const COVER_URL =
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2070";

const setMetaContent = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

export default function PublicPhotographerPage() {
  const { id } = useParams(); // may be a username or a raw Convex ID
  const portfolioRef = React.useRef(null);
  const carouselPausedRef = React.useRef(false);
  const photographer = useQuery(api.photographers.getBySlug, id ? { slug: id } : "skip");
  const packages = useQuery(
    api.packages.listByPhotographer,
    photographer?._id ? { photographerId: photographer._id } : "skip"
  ) || [];

  // SEO Updates
  React.useEffect(() => {
    if (photographer) {
      const title = `${photographer.name} | Professional Photographer | ShutterSync`;
      const description = photographer.bio
        || `Explore ${photographer.name}'s photography portfolio, service packages, and contact details on ShutterSync.`;
      const image = photographer.coverImageUrl
        || photographer.photos?.[0]
        || photographer.avatarUrl
        || `${window.location.origin}/static/icons/web-app-manifest-512x512.png`;
      const imageAlt = `${photographer.name}'s photography portfolio`;
      const profileUrl = window.location.href.split("#")[0];

      document.title = title;
      setMetaContent("name", "description", description);
      setMetaContent("property", "og:type", "profile");
      setMetaContent("property", "og:url", profileUrl);
      setMetaContent("property", "og:title", title);
      setMetaContent("property", "og:description", description);
      setMetaContent("property", "og:image", image);
      setMetaContent("property", "og:image:secure_url", image);
      setMetaContent("property", "og:image:alt", imageAlt);
      setMetaContent("name", "twitter:card", "summary_large_image");
      setMetaContent("name", "twitter:title", title);
      setMetaContent("name", "twitter:description", description);
      setMetaContent("name", "twitter:image", image);
      setMetaContent("name", "twitter:image:alt", imageAlt);

      const canonical = document.head.querySelector('link[rel="canonical"]');
      canonical?.setAttribute("href", profileUrl);

      let structuredData = document.getElementById("photographer-structured-data");
      if (!structuredData) {
        structuredData = document.createElement("script");
        structuredData.type = "application/ld+json";
        structuredData.id = "photographer-structured-data";
        document.head.appendChild(structuredData);
      }
      structuredData.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: photographer.name,
        description,
        url: profileUrl,
        image: [image, ...(photographer.photos || []).filter((url) => url !== image)],
        telephone: photographer.contact || undefined,
      });
    }
    return () => {
      document.title = "ShutterSync";
      document.getElementById("photographer-structured-data")?.remove();
    };
  }, [photographer]);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: photographer
        ? `${photographer.name} | Professional Photographer`
        : "ShutterSync Photographer Profile",
      text: photographer
        ? `View ${photographer.name}'s photography portfolio and services.`
        : "View this photographer profile on ShutterSync.",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

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

  const galleryPhotos = photographer?.photos || [];

  React.useEffect(() => {
    const carousel = portfolioRef.current;
    if (!carousel || galleryPhotos.length < 2) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    const intervalId = window.setInterval(() => {
      if (carouselPausedRef.current || document.hidden) return;

      const slides = Array.from(carousel.children);
      if (slides.length < 2) return;

      const carouselLeft = carousel.getBoundingClientRect().left;
      const currentIndex = slides.reduce((closestIndex, slide, index) => {
        const currentDistance = Math.abs(
          slide.getBoundingClientRect().left - carouselLeft,
        );
        const closestDistance = Math.abs(
          slides[closestIndex].getBoundingClientRect().left - carouselLeft,
        );
        return currentDistance < closestDistance ? index : closestIndex;
      }, 0);
      const nextSlide = slides[(currentIndex + 1) % slides.length];
      const nextLeft =
        carousel.scrollLeft + nextSlide.getBoundingClientRect().left - carouselLeft;

      carousel.scrollTo({ left: nextLeft, behavior: "smooth" });
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [galleryPhotos.length]);

  if (!id)
    return <div className="min-h-screen flex items-center justify-center">Invalid photographer ID</div>;
  if (photographer === undefined) return <LoadingSpinner />;
  if (!photographer)
    return <div className="min-h-screen flex items-center justify-center">Photographer not found</div>;

  const contactDigits = (photographer.contact || "").replace(/\D/g, "");
  const whatsappNumber = contactDigits.length === 10
    ? `91${contactDigits}`
    : contactDigits.startsWith("0") && contactDigits.length === 11
      ? `91${contactDigits.slice(1)}`
      : contactDigits;
  const whatsappMessage = encodeURIComponent(
    `Hi ${photographer.name}, I found your photography profile on ShutterSync and would like to inquire about your services.`,
  );
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={photographer.coverImageUrl || COVER_URL}
          alt={`${photographer.name}'s profile cover`}
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
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-xl shadow-lg">
                  <Camera size={16} />
                </div>
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight mb-1">{photographer.name}</h1>
              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">
                {photographer.roleName || "Professional Photographer"}
              </p>

              <div className="space-y-4 text-left border-t border-border pt-6">
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
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Contact Socially</h4>
                  <div className="flex justify-center gap-3">
                    {socials.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-accent/10 hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        title={social.platform}
                      >
                        <social.icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-8">
                {whatsappUrl ? (
                  <Button
                    asChild
                    className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[11px] shadow-xl hover-lift"
                  >
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Inquire with ${photographer.name} on WhatsApp`}
                    >
                      <MessageCircle size={16} />
                      Inquire Now
                    </a>
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[11px]"
                    title="This photographer has not added a contact number"
                  >
                    Contact unavailable
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="rounded-2xl h-12 w-12 border-primary/20 hover:border-primary transition-colors duration-200"
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
              <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
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
                    Auto-playing · swipe anytime <ExternalLink size={10} />
                  </span>
                </div>
                <div
                  ref={portfolioRef}
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 portfolio-scroll"
                  aria-label="Photography portfolio"
                  onMouseEnter={() => { carouselPausedRef.current = true; }}
                  onMouseLeave={() => { carouselPausedRef.current = false; }}
                  onFocusCapture={() => { carouselPausedRef.current = true; }}
                  onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      carouselPausedRef.current = false;
                    }
                  }}
                  onPointerDown={() => { carouselPausedRef.current = true; }}
                  onPointerUp={() => { carouselPausedRef.current = false; }}
                  onPointerCancel={() => { carouselPausedRef.current = false; }}
                >
                  {galleryPhotos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden rounded-2xl group aspect-[4/5] shadow-xl snap-start shrink-0 w-[78vw] sm:w-[45vw] md:w-[280px] lg:w-[300px]"
                    >
                      <img
                        src={url}
                        alt={`Portfolio ${idx + 1}`}
                        loading={idx === 0 ? "eager" : "lazy"}
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center motion-reduce:transition-none">
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
                      : "border-border"
                  }`}
                >
                  {pkg.popular && (
                    <span className="bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-full self-start mb-4">
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
