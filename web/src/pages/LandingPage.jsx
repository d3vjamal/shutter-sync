import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  FileText,
  CreditCard,
  Users,
  Star,
  Share2,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  ImageIcon,
  Zap,
  Shield,
  ChevronRight,
  BookOpen,
  BarChart3,
  Globe,
  Github,
  Twitter,
  MapPin,
  Code2,
  Building2,
} from "lucide-react";

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080e1c]/90 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src="/static/icons/logo.png"
            alt="ShutterSync"
            className="w-8 h-8 rounded-xl object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className="text-white font-black text-lg tracking-tight">
            ShutterSync
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            ["features", "Features"],
            ["how-it-works", "How It Works"],
            ["freelance", "Freelance"],
            ["for-clients", "For Clients"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-bold text-white/80 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-black bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Get Started Free
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden text-white p-2"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#080e1c]/98 backdrop-blur-xl border-t border-white/10 px-5 py-4 space-y-3">
          {[
            ["features", "Features"],
            ["how-it-works", "How It Works"],
            ["freelance", "Freelance"],
            ["for-clients", "For Clients"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="block w-full text-left text-sm font-semibold text-white/80 hover:text-white py-2"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="w-full text-sm font-black bg-primary text-white py-3 rounded-xl mt-2"
          >
            Get Started Free
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#060c1a]">
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-2/3 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
          <Zap size={11} fill="currentColor" /> Built for Indian Photographers
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 max-w-5xl mx-auto">
          Run Your Photography{" "}
          <span className="relative">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Business
            </span>
          </span>
          , Not Just Your Camera
        </h1>

        <p className="text-lg md:text-xl text-white/55 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Assignments, freelance jobs, agreements, payments, and your public
          portfolio — everything a photographer needs to look professional and
          stay organised.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate("/login")}
            className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-black text-base px-8 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1"
          >
            Start for Free
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-2 text-white/70 hover:text-white font-bold text-base px-8 py-4 rounded-2xl border border-white/15 hover:border-white/30 transition-all"
          >
            See Features
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { value: "1-Click", label: "PDF Agreements" },
            { value: "3-Step", label: "Client Booking Flow" },
            { value: "Real-time", label: "Payment Tracking" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-5"
            >
              <div className="text-2xl md:text-3xl font-black text-white mb-1">
                {value}
              </div>
              <div className="text-xs font-semibold text-white/45 uppercase tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: LayoutDashboard,
    c1: "#3b82f6", c2: "#1d4ed8",
    title: "Smart Dashboard",
    desc: "Active, upcoming, and past jobs in one view — revenue collected, pending balance, and job count, all live.",
    badge: "Real-time sync",
  },
  {
    icon: Building2,
    c1: "#f59e0b", c2: "#ea580c",
    title: "Freelance Jobs",
    desc: "Log studio gigs as a freelancer. Separate photo & video payment splits, gadgets list, and agreement PDFs per job.",
    badge: "Photo + Video splits",
  },
  {
    icon: FileText,
    c1: "#8b5cf6", c2: "#7c3aed",
    title: "Agreement PDFs",
    desc: "Branded contract PDF from any assignment in one click — party details, payment summary, and custom terms included.",
    badge: "1-click PDF",
  },
  {
    icon: CreditCard,
    c1: "#10b981", c2: "#059669",
    title: "Payment Tracking",
    desc: "Total, received, and balance due per job. Visual progress bars keep every client's payment status clear.",
    badge: "Visual progress bars",
  },
  {
    icon: Globe,
    c1: "#06b6d4", c2: "#0891b2",
    title: "Portfolio Page",
    desc: "A public profile at your own shareable link — bio, gallery, social handles, and packages for new clients.",
    badge: "Custom public link",
  },
  {
    icon: BookOpen,
    c1: "#f97316", c2: "#d97706",
    title: "Contract Terms",
    desc: "Write advance, cancellation, and travel policies once — then reuse them across any assignment or freelance job.",
    badge: "Reusable templates",
  },
  {
    icon: CalendarDays,
    c1: "#6366f1", c2: "#4f46e5",
    title: "Multi-Day Scheduling",
    desc: "Pick individual coverage dates for weddings and multi-day events. Duration is calculated automatically.",
    badge: "Multi-date support",
  },
  {
    icon: ImageIcon,
    c1: "#eab308", c2: "#ca8a04",
    title: "Portfolio & Branding",
    desc: "Upload up to 6 portfolio photos and your studio logo. Your logo appears on every PDF you generate.",
    badge: "Logo on every PDF",
  },
  {
    icon: Briefcase,
    c1: "#ec4899", c2: "#e11d48",
    title: "Service Packages",
    desc: "Define offerings with pricing and inclusions. Mark your best package as Most Popular to guide clients.",
    badge: "Most Popular badge",
  },
];

function Features() {
  return (
    <section id="features" className="bg-[#070d1b] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
            <Star size={11} fill="currentColor" /> Everything You Need
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Built for the Way Photographers Work
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
            Not a generic project tool — every feature is designed around the
            real workflow of a photographer.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map(({ icon: Icon, c1, c2, title, desc, badge }) => (
            <div
              key={title}
              className="group relative rounded-2xl p-6 overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-2"
              style={{
                background: `linear-gradient(140deg, ${c1}18 0%, rgba(7,13,27,0.6) 60%)`,
                border: `1px solid ${c1}35`,
                boxShadow: "0 0 0 0 transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 20px 60px -10px ${c1}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${c1}45 0%, transparent 70%)` }}
              />

              {/* Bottom-right number watermark */}
              <div
                className="absolute -bottom-4 -right-2 text-[80px] font-black leading-none select-none pointer-events-none transition-all duration-500"
                style={{ color: `${c1}10` }}
              >
                {String(FEATURES.findIndex((f) => f.title === title) + 1).padStart(2, "0")}
              </div>

              {/* Icon */}
              <div
                className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
              >
                <Icon size={26} className="text-white drop-shadow" />
              </div>

              {/* Title */}
              <h3 className="relative font-black text-white text-[15px] leading-snug mb-2">
                {title}
              </h3>

              {/* Description */}
              <p
                className="relative text-[13px] leading-relaxed mb-5 transition-colors duration-300 group-hover:text-white/70"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {desc}
              </p>

              {/* Badge */}
              <div
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full"
                style={{
                  color: c1,
                  background: `${c1}18`,
                  border: `1px solid ${c1}35`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: c1 }}
                />
                {badge}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: Camera,
      title: "Create Your Account",
      desc: "Sign up in under a minute. Set up your profile with your name, contact, UPI ID, and studio logo. Your public portfolio page is instantly live.",
    },
    {
      num: "02",
      icon: FileText,
      title: "Add an Assignment",
      desc: "Fill in client details, event dates, venue, deliverables, and payment amount. Attach your pre-written contract terms. Done in 2 minutes.",
    },
    {
      num: "03",
      icon: Share2,
      title: "Share With Your Client",
      desc: "Send the client link. They see event details, read and accept the agreement, and proceed to pay via UPI — all without creating an account.",
    },
    {
      num: "04",
      icon: CheckCircle,
      title: "Track & Close",
      desc: "Update payment received as it comes in. Mark the assignment complete when done. Your dashboard stays accurate at every stage.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#060b18] py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
            <Zap size={11} fill="currentColor" /> Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            From Inquiry to Invoice in Minutes
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            No complicated setup. No training required. Just open it and start.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {steps.map(({ num, icon: Icon, title, desc }) => (
            <div
              key={num}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step circle */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-all group-hover:shadow-xl group-hover:shadow-primary/20">
                  <Icon size={28} className="text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">
                  {num.replace("0", "")}
                </div>
              </div>
              <div className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-2">
                {num}
              </div>
              <h3 className="text-base font-black text-white mb-2">{title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PDF Spotlight ─────────────────────────────────────────────────────────────

function PDFSpotlight() {
  return (
    <section className="bg-[#070d1b] py-28">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <FileText size={11} /> Agreement PDF
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              Contracts That Look Like You Mean Business
            </h2>
            <p className="text-white/55 text-lg leading-relaxed mb-8">
              Generate a clean, professional service agreement for every
              assignment in one click. No templates to fill, no Word documents
              to email — it's built from your assignment data automatically.
            </p>
            <ul className="space-y-3">
              {[
                "Your studio logo in the header",
                "Photographer & client party details",
                "Event dates, venue, and deliverables",
                "Payment summary with progress bar",
                "Your custom terms & conditions",
                "Works perfectly on mobile and Android",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-white/70 text-sm font-medium"
                >
                  <CheckCircle
                    size={16}
                    className="text-emerald-400 shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Mock PDF card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-blue-500/10 rounded-3xl blur-3xl" />
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-6 text-gray-800 text-sm">
              {/* PDF header mock */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-blue-600 mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <Briefcase size={16} className="text-slate-400" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-black tracking-[0.18em] uppercase text-blue-700">
                    Service Agreement
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    #A7F2D31 · 16 March 2026
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Camera size={16} className="text-white" />
                </div>
              </div>
              {/* Parties */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {["Photographer", "Client"].map((role) => (
                  <div
                    key={role}
                    className="rounded-lg border border-slate-200 overflow-hidden"
                  >
                    <div className="bg-slate-100 px-3 py-1 text-[8px] font-black uppercase tracking-wider text-slate-500">
                      {role}
                    </div>
                    <div className="px-3 py-2">
                      <div className="font-bold text-[11px] text-slate-800">
                        {role === "Photographer"
                          ? "Rahul Sharma"
                          : "Priya & Arjun"}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        {role === "Photographer"
                          ? "+91 98765 43210"
                          : "+91 87654 32109"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Payment boxes */}
              <div className="flex gap-2 mb-3">
                {[
                  ["Total", "₹75,000", ""],
                  ["Paid", "₹25,000", "bg-blue-600 text-white"],
                  ["Balance", "₹50,000", ""],
                ].map(([l, v, cls]) => (
                  <div
                    key={l}
                    className={`flex-1 rounded-lg text-center py-2 px-1 ${cls || "bg-slate-50 border border-slate-200"}`}
                  >
                    <div
                      className={`text-[7px] font-bold uppercase tracking-wider mb-0.5 ${cls ? "text-white/70" : "text-slate-500"}`}
                    >
                      {l}
                    </div>
                    <div
                      className={`text-sm font-black ${cls ? "text-white" : "text-slate-800"}`}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                <div className="h-full w-1/3 bg-orange-400 rounded-full" />
              </div>
              {/* Terms preview */}
              <div className="space-y-1.5">
                {[
                  "50% advance required to confirm booking",
                  "Cancellation within 7 days forfeits advance",
                  "Travel charges apply for outstation events",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="flex gap-2 text-[9px] text-slate-500 border-l-2 border-slate-200 pl-2 py-0.5"
                  >
                    <span className="text-blue-600 font-black shrink-0">
                      {i + 1}.
                    </span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Freelance Spotlight ──────────────────────────────────────────────────────

function FreelanceSpotlight() {
  return (
    <section id="freelance" className="bg-[#060b18] py-28">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Building2 size={11} /> Freelance Jobs
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              Track Every Studio You Work With
            </h2>
            <p className="text-white/55 text-lg leading-relaxed mb-8">
              Working as a freelancer under a studio? Log each job with full
              studio details, separate photography and videography payment
              tracking, and generate a professional agreement PDF for every
              engagement — all in one place.
            </p>
            <ul className="space-y-3">
              {[
                "Separate photography & videography sections",
                "Per-section: total amount, received & amount due",
                "Footage type tags (Photos, Reels, Drone & more)",
                "Auto-generated freelance agreement PDF",
                "Gadgets & equipment list per job",
                "Calendar event auto-downloaded on job create",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-white/70 text-sm font-medium"
                >
                  <CheckCircle size={16} className="text-amber-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Mock freelance job card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-3xl blur-3xl" />
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-6 text-gray-800 text-sm">
              {/* Card header accent + title */}
              <div className="h-1 w-full bg-amber-500 rounded-full -mt-6 mb-5 -mx-6" style={{ width: "calc(100% + 48px)" }} />
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="text-sm font-black text-slate-800">Lens &amp; Light Studios</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Ankit Sinha</div>
                </div>
                <span className="text-[9px] font-black bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Ongoing
                </span>
              </div>
              {/* Meta chips */}
              <div className="flex gap-1.5 flex-wrap mb-4">
                {["18 Mar 2026", "Grand Hyatt, Mumbai", "Rahul Sharma"].map((t) => (
                  <span key={t} className="text-[8px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              {/* Photography */}
              <div className="mb-3">
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">📷 Photography</div>
                <div className="flex gap-1.5 mb-2">
                  {[["Total", "₹30,000", ""], ["Received", "₹15,000", "bg-blue-600 text-white"], ["Due", "₹15,000", ""]].map(([l, v, cls]) => (
                    <div key={l} className={`flex-1 rounded-lg text-center py-1.5 px-1 ${cls || "bg-slate-50 border border-slate-200"}`}>
                      <div className={`text-[7px] font-bold uppercase tracking-wider mb-0.5 ${cls ? "text-white/70" : "text-slate-500"}`}>{l}</div>
                      <div className={`text-xs font-black ${cls ? "text-white" : "text-slate-800"}`}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {["Photos", "Reels", "Album"].map((t) => (
                    <span key={t} className="text-[7px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
              {/* Videography */}
              <div>
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">🎥 Videography</div>
                <div className="flex gap-1.5 mb-2">
                  {[["Total", "₹20,000", ""], ["Received", "₹20,000", "bg-blue-600 text-white"], ["Due", "₹0", ""]].map(([l, v, cls]) => (
                    <div key={l} className={`flex-1 rounded-lg text-center py-1.5 px-1 ${cls || "bg-slate-50 border border-slate-200"}`}>
                      <div className={`text-[7px] font-bold uppercase tracking-wider mb-0.5 ${cls ? "text-white/70" : "text-slate-500"}`}>{l}</div>
                      <div className={`text-xs font-black ${cls ? "text-white" : "text-slate-800"}`}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {["Video", "Drone", "Short Film"].map((t) => (
                    <span key={t} className="text-[7px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── For Clients ──────────────────────────────────────────────────────────────

function ForClients() {
  const steps = [
    { icon: FileText, label: "View event details & services" },
    { icon: CheckCircle, label: "Read & accept the agreement" },
    { icon: CreditCard, label: "Pay via UPI or WhatsApp" },
  ];
  return (
    <section id="for-clients" className="bg-[#060b18] py-28">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps mockup */}
          <div className="order-2 lg:order-1 space-y-4">
            {steps.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={`flex items-center gap-5 bg-white/[0.04] border rounded-2xl px-6 py-5 transition-all ${
                  i === 1
                    ? "border-primary/40 shadow-lg shadow-primary/10"
                    : "border-white/[0.08]"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    i === 1 ? "bg-primary" : "bg-white/5 border border-white/10"
                  }`}
                >
                  <Icon
                    size={20}
                    className={i === 1 ? "text-white" : "text-white/40"}
                  />
                </div>
                <div>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-0.5">
                    Step {i + 1}
                  </div>
                  <div
                    className={`text-sm font-black ${i === 1 ? "text-white" : "text-white/60"}`}
                  >
                    {label}
                  </div>
                </div>
                {i === 1 && (
                  <div className="ml-auto bg-primary/20 text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Active
                  </div>
                )}
              </div>
            ))}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-4 flex items-center gap-3">
              <Shield size={16} className="text-emerald-400" />
              <span className="text-xs text-white/50 font-medium">
                No account required — clients access everything via a secure
                link
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Users size={11} /> For Your Clients
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              A Smooth Experience for Every Client
            </h2>
            <p className="text-white/55 text-lg leading-relaxed mb-6">
              Share one link. Your client gets a clean, guided 3-step booking
              flow — they review the assignment, accept the terms, and make
              payment. No app to download, no account to create.
            </p>
            <p className="text-white/40 text-base leading-relaxed">
              Works flawlessly on any phone or browser, including WhatsApp's
              in-app browser. Perfect for the way Indian clients communicate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Portfolio Spotlight ───────────────────────────────────────────────────────

function PortfolioSpotlight() {
  return (
    <section className="bg-[#070d1b] py-28">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Globe size={11} /> Public Portfolio
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              Your Own Professional Profile Page
            </h2>
            <p className="text-white/55 text-lg leading-relaxed mb-6">
              Every photographer gets a shareable public page at a custom link
              like{" "}
              <span className="text-primary font-mono font-bold">
                app.com/photographer/rahul
              </span>
              . Share it on Instagram, WhatsApp, or your business card.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: ImageIcon,
                  label: "Portfolio gallery (up to 6 photos)",
                },
                { icon: Briefcase, label: "Service packages with pricing" },
                { icon: Users, label: "Bio & contact details" },
                { icon: Share2, label: "Social media links" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl p-4"
                >
                  <Icon size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-xs font-semibold text-white/60 leading-snug">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile card mock */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-teal-500/5 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0a1220] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              {/* Cover */}
              <div className="h-28 bg-gradient-to-br from-blue-600/60 to-cyan-600/40 relative">
                <div className="absolute bottom-0 left-6 translate-y-1/2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 border-4 border-[#0a1220] flex items-center justify-center shadow-xl">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="pt-12 px-6 pb-6">
                <div className="mb-4">
                  <div className="text-base font-black text-white">
                    Rahul Sharma
                  </div>
                  <div className="text-xs text-white/40 font-medium">
                    Wedding & Portrait Photographer · Mumbai
                  </div>
                </div>
                {/* Gallery row */}
                <div className="grid grid-cols-3 gap-1.5 mb-4 rounded-xl overflow-hidden">
                  {[
                    "from-rose-400 to-pink-500",
                    "from-amber-400 to-orange-500",
                    "from-violet-400 to-purple-500",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`aspect-square bg-gradient-to-br ${g} opacity-60 rounded-lg`}
                    />
                  ))}
                </div>
                {/* Package card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-white">
                      Wedding Package
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">
                      2 photographers · Full day
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-primary">
                      ₹75,000
                    </div>
                    <div className="text-[9px] text-orange-400 font-bold">
                      ★ Most Popular
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#060b18] py-28">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl" />
          <div className="relative bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/25 rounded-3xl px-8 py-16">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Zap size={11} fill="currentColor" /> Free to Get Started
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Start Managing Your Business Today
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
              No credit card. No complicated setup. Just sign up and start
              adding your first assignment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-black text-base px-10 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1"
              >
                Create Your Account
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="text-white/60 hover:text-white font-bold text-sm transition-colors"
              >
                Already have an account? Sign in →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Developer ────────────────────────────────────────────────────────────────

function Developer() {
  return (
    <section className="bg-[#060b18] border-t border-white/[0.06] py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            <Code2 size={11} /> Designed &amp; Developed by
          </div>
        </div>

        <div className="max-w-sm mx-auto">
          <div className="relative group">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-violet-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.09] hover:border-white/[0.18] rounded-3xl p-8 text-center transition-all duration-300">
              {/* Avatar */}
              <div className="relative inline-block mb-5">
                <img
                  src="https://avatars.githubusercontent.com/u/42401032?s=128&v=4"
                  alt="Jamaluddin Mondal"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#24292e] border-2 border-[#060b18] rounded-xl flex items-center justify-center">
                  <Github size={14} className="text-white" />
                </div>
              </div>

              {/* Name */}
              <h3 className="text-xl font-black text-white tracking-tight mb-1">
                Jamaluddin Mondal
              </h3>
              <div className="flex items-center justify-center gap-1.5 text-white/35 text-xs font-semibold mb-3">
                <MapPin size={11} />
                Kolkata, India
              </div>

              {/* Links */}
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://github.com/d3vjamal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#24292e] hover:bg-[#2f363d] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Github size={13} />
                  @d3vjamal
                </a>
                <a
                  href="https://twitter.com/d3vjamal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#1a1a2e] hover:bg-[#1d9bf0]/20 border border-[#1d9bf0]/30 text-[#1d9bf0] text-xs font-black px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1d9bf0]/20"
                >
                  <Twitter size={13} />
                  @d3vjamal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#050a16] border-t border-white/[0.06] py-10">
      <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src="/static/icons/logo.png"
            alt="ShutterSync"
            className="w-7 h-7 rounded-lg object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className="text-white/80 font-black text-base">
            ShutterSync
          </span>
        </div>
        <p className="text-white/30 text-xs font-medium text-center">
          Built for photographers who take their business as seriously as their
          craft.
        </p>
        <div className="text-white/25 text-xs">
          © {new Date().getFullYear()} ShutterSync
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PDFSpotlight />
      <FreelanceSpotlight />
      <ForClients />
      <PortfolioSpotlight />
      <CTA />
      <Developer />
      <Footer />
    </div>
  );
}
