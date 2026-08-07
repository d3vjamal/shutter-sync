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
  Camera,
  Share2,
  Layers,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";

const COVER_URL =
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2070";

const PACKAGE_TIERS = ["All", "Classic", "Standard", "Premium", "Signature"];

const setMetaContent = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

function PackageCard({ pkg, photographerName, whatsappUrl }) {
  const [expanded, setExpanded] = React.useState(Boolean(pkg.popular));
  const servicesId = `package-services-${pkg._id}`;
  const serviceCount = pkg.services?.length || 0;

  return (
    <article
      className={`relative h-fit overflow-hidden rounded-[1.75rem] border bg-card text-card-foreground transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl motion-reduce:transform-none motion-reduce:transition-none ${
        pkg.popular
          ? "border-primary/50 shadow-xl shadow-primary/10"
          : "border-border shadow-lg shadow-foreground/5"
      }`}
    >
      {pkg.popular && (
        <div className="flex items-center gap-2 bg-primary px-6 py-2.5 text-primary-foreground">
          <Sparkles size={13} aria-hidden="true" />
          <span className="text-[10px] font-black uppercase tracking-[0.18em]">
            Most requested
          </span>
        </div>
      )}

      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Photography package
            </p>
            <h4 className="text-2xl font-black leading-tight">{pkg.name}</h4>
          </div>
          {pkg.price && (
            <div className="shrink-0 text-right">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                From
              </span>
              <span className="text-2xl font-black tabular-nums">
                <span className="mr-0.5 text-sm align-top">₹</span>
                {pkg.price}
              </span>
            </div>
          )}
        </div>

        {pkg.description && (
          <p className="mt-5 max-w-[60ch] text-sm leading-6 text-muted-foreground">
            {pkg.description}
          </p>
        )}

        {serviceCount > 0 && (
          <>
            <button
              type="button"
              className="mt-6 flex w-full items-center justify-between gap-4 border-y border-border/80 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-expanded={expanded}
              aria-controls={servicesId}
              onClick={() => setExpanded((value) => !value)}
            >
              <span>
                <span className="block text-sm font-black">
                  What’s included
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {serviceCount} {serviceCount === 1 ? "detail" : "details"}
                </span>
              </span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-foreground">
                <ChevronDown
                  size={17}
                  className={`transition-transform duration-300 ease-out motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </span>
            </button>
            <div
              className={`package-details-grid ${expanded ? "is-open" : ""}`}
              id={servicesId}
            >
              <div>
                <ul className="space-y-3 py-5">
                  {pkg.services.map((service, index) => (
                    <li
                      key={`${service}-${index}`}
                      className="flex items-start gap-3 text-sm font-semibold text-muted-foreground"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {whatsappUrl && (
          <Button
            asChild
            variant={pkg.popular ? "default" : "outline"}
            className="mt-5 h-11 w-full rounded-xl font-black"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask ${photographerName} about the ${pkg.name} package`}
            >
              Do WhatsApp
              <ChevronRight size={16} aria-hidden="true" />
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}

export default function PublicPhotographerPage() {
  const { id } = useParams(); // may be a username or a raw Convex ID
  const portfolioRef = React.useRef(null);
  const packagesRef = React.useRef(null);
  const carouselPausedRef = React.useRef(false);
  const [activePhoto, setActivePhoto] = React.useState(0);
  const [activePackageTier, setActivePackageTier] = React.useState("All");
  const photographer = useQuery(
    api.photographers.getBySlug,
    id ? { slug: id } : "skip",
  );
  const packages =
    useQuery(
      api.packages.listByPhotographer,
      photographer?._id ? { photographerId: photographer._id } : "skip",
    ) || [];

  // SEO Updates
  React.useEffect(() => {
    if (photographer) {
      const title = `${photographer.name} | Professional Photographer | ShutterSync`;
      const description =
        photographer.bio ||
        `Explore ${photographer.name}'s photography portfolio, service packages, and contact details on ShutterSync.`;
      const image =
        photographer.coverImageUrl ||
        photographer.photos?.[0] ||
        photographer.avatarUrl ||
        `${window.location.origin}/static/icons/web-app-manifest-512x512.png`;
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

      let structuredData = document.getElementById(
        "photographer-structured-data",
      );
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
        image: [
          image,
          ...(photographer.photos || []).filter((url) => url !== image),
        ],
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

    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Profile link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };

  const socials = [
    {
      platform: "Instagram",
      icon: Instagram,
      url: photographer?.instagram
        ? `https://instagram.com/${photographer.instagram.replace("@", "")}`
        : null,
    },
    {
      platform: "Facebook",
      icon: Facebook,
      url: photographer?.facebook
        ? `https://facebook.com/${photographer.facebook}`
        : null,
    },
    {
      platform: "Twitter",
      icon: Twitter,
      url: photographer?.twitter
        ? `https://twitter.com/${photographer.twitter.replace("@", "")}`
        : null,
    },
  ].filter((s) => s.url);

  const galleryPhotos = photographer?.photos || [];
  const filteredPackages = React.useMemo(() => {
    if (activePackageTier === "All") return packages;

    const tier = activePackageTier.toLowerCase();
    return packages.filter((pkg) => {
      const searchableText = [
        pkg.name,
        pkg.description,
        ...(pkg.services || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchableText.includes(tier);
    });
  }, [activePackageTier, packages]);

  const selectPackageTier = (tier) => {
    setActivePackageTier(tier);
    packagesRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const scrollPackages = (direction) => {
    const carousel = packagesRef.current;
    if (!carousel) return;
    carousel.scrollBy({
      left: direction * Math.max(carousel.clientWidth * 0.82, 280),
      behavior: "smooth",
    });
  };

  const scrollToPhoto = React.useCallback((index) => {
    const carousel = portfolioRef.current;
    const slide = carousel?.children[index];
    if (!carousel || !slide) return;

    const carouselLeft = carousel.getBoundingClientRect().left;
    const targetLeft =
      carousel.scrollLeft + slide.getBoundingClientRect().left - carouselLeft;
    carousel.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    const carousel = portfolioRef.current;
    if (!carousel || galleryPhotos.length < 2) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    const intervalId = window.setInterval(() => {
      if (carouselPausedRef.current || document.hidden) return;

      const slides = Array.from(carousel.children);
      if (slides.length < 2) return;

      scrollToPhoto((activePhoto + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [activePhoto, galleryPhotos.length, scrollToPhoto]);

  React.useEffect(() => {
    const carousel = portfolioRef.current;
    if (!carousel) return undefined;

    let animationFrame;
    const updateActivePhoto = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const slides = Array.from(carousel.children);
        const viewportCenter = carousel.scrollLeft + carousel.clientWidth / 2;
        const carouselLeft = carousel.getBoundingClientRect().left;
        const nearestIndex = slides.reduce((nearest, slide, index) => {
          const slideCenter =
            carousel.scrollLeft +
            slide.getBoundingClientRect().left -
            carouselLeft +
            slide.clientWidth / 2;
          const nearestSlide = slides[nearest];
          const nearestCenter =
            carousel.scrollLeft +
            nearestSlide.getBoundingClientRect().left -
            carouselLeft +
            nearestSlide.clientWidth / 2;
          return Math.abs(slideCenter - viewportCenter) <
            Math.abs(nearestCenter - viewportCenter)
            ? index
            : nearest;
        }, 0);
        setActivePhoto(nearestIndex);
      });
    };

    carousel.addEventListener("scroll", updateActivePhoto, { passive: true });
    return () => {
      carousel.removeEventListener("scroll", updateActivePhoto);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [galleryPhotos.length]);

  if (!id)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Invalid photographer ID
      </div>
    );
  if (photographer === undefined) return <LoadingSpinner />;
  if (!photographer)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Photographer not found
      </div>
    );

  const contactDigits = (photographer.contact || "").replace(/\D/g, "");
  const whatsappNumber =
    contactDigits.length === 10
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
              <h1 className="text-2xl font-black uppercase tracking-tight mb-1">
                {photographer.name}
              </h1>
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
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">
                    Contact Socially
                  </h4>
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
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">
                  The Storyteller
                </h3>
                <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground italic">
                  "{photographer.bio}"
                </p>
              </section>
            )}

            {/* Gallery */}
            {galleryPhotos.length > 0 && (
              <section>
                <div className="flex items-end justify-between gap-4 mb-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">
                    Visual Portfolio
                  </h3>
                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Auto-playing
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        scrollToPhoto(
                          (activePhoto - 1 + galleryPhotos.length) %
                            galleryPhotos.length,
                        )
                      }
                      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Previous portfolio photo"
                    >
                      <ChevronLeft size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        scrollToPhoto((activePhoto + 1) % galleryPhotos.length)
                      }
                      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Next portfolio photo"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
                <div
                  ref={portfolioRef}
                  className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:gap-4 md:mx-0 md:px-0 portfolio-scroll"
                  aria-label="Photography portfolio"
                  aria-roledescription="carousel"
                  onMouseEnter={() => {
                    carouselPausedRef.current = true;
                  }}
                  onMouseLeave={() => {
                    carouselPausedRef.current = false;
                  }}
                  onFocusCapture={() => {
                    carouselPausedRef.current = true;
                  }}
                  onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      carouselPausedRef.current = false;
                    }
                  }}
                  onPointerDown={() => {
                    carouselPausedRef.current = true;
                  }}
                  onPointerUp={() => {
                    carouselPausedRef.current = false;
                  }}
                  onPointerCancel={() => {
                    carouselPausedRef.current = false;
                  }}
                >
                  {galleryPhotos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden rounded-2xl group aspect-[4/5] shadow-xl snap-center shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-0.5rem)]"
                      aria-label={`${idx + 1} of ${galleryPhotos.length}`}
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
                <div
                  className="mt-1 flex items-center justify-center gap-2"
                  aria-label={`Portfolio photo ${activePhoto + 1} of ${galleryPhotos.length}`}
                >
                  {galleryPhotos.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => scrollToPhoto(index)}
                      className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activePhoto === index ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"}`}
                      aria-label={`Go to portfolio photo ${index + 1}`}
                      aria-current={activePhoto === index ? "true" : undefined}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Photographer Service Packages */}
        {packages.length > 0 && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="flex items-center gap-2.5 ml-1">
                <Layers size={14} className="text-primary" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">
                  Photographer Service Packages
                </h3>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => scrollPackages(-1)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Previous packages"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollPackages(1)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Next packages"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>

            <div
              className="mb-5 flex gap-2 overflow-x-auto pb-2 portfolio-scroll"
              aria-label="Filter packages by tier"
            >
              {PACKAGE_TIERS.map((tier) => {
                const selected = activePackageTier === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => selectPackageTier(tier)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground"}`}
                    aria-pressed={selected}
                  >
                    {tier}
                  </button>
                );
              })}
            </div>

            {filteredPackages.length > 0 ? (
              <div
                ref={packagesRef}
                className="portfolio-scroll -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 pt-1 md:mx-0 md:px-0"
                aria-label={`${activePackageTier} service packages`}
                aria-roledescription="carousel"
              >
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="w-[calc(100%-2rem)] shrink-0 snap-start sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)]"
                  >
                    <PackageCard
                      pkg={pkg}
                      photographerName={photographer.name}
                      whatsappUrl={whatsappUrl}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border px-5 py-8 text-center">
                <p className="text-sm font-bold">
                  No {activePackageTier.toLowerCase()} packages found
                </p>
                <button
                  type="button"
                  onClick={() => selectPackageTier("All")}
                  className="mt-2 text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  View all packages
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
