import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Camera,
  FileText,
  LogOut,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  Layers,
  ShieldCheck,
  Users,
  Briefcase,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { cn } from "../../lib/utils";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: "/dashboard",                   icon: BarChart3,  label: "Dashboard"       },
  { to: "/create-assignment",           icon: Camera,     label: "New Assignment"  },
  { to: "/freelance",                   icon: Briefcase,  label: "Freelance Jobs"  },
  { to: "/packages",                    icon: Layers,     label: "My Packages"     },
  { to: "/agreements",                  icon: FileText,   label: "Agreements"      },
  { to: "/profile",                     icon: User,       label: "Profile"         },
];

const ADMIN_NAV_ITEMS = [
  { to: "/admin/dashboard", icon: ShieldCheck, label: "Admin Dashboard" },
  { to: "/photographers",   icon: Users,       label: "Photographers"   },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ user, onLogout, onClose }) {
  const { pathname } = useLocation();
  const isAdmin = user?.roleCode === 0;
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : NAV_ITEMS;

  return (
    <aside className="flex flex-col h-full bg-card border-r border-border">

      {/* Brand row */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
        <img
          src="/static/icons/logo.png"
          alt="ShutterSync"
          className="w-8 h-8 rounded-xl object-cover shrink-0"
        />
        <span className="text-sm font-black tracking-tight text-foreground flex-1 min-w-0 truncate">
          ShutterSync
        </span>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active =
            pathname === to ||
            (to === "/freelance" && pathname === "/create-freelance-assignment") ||
            (to === "/create-assignment" && pathname === "/create-assignment");
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold",
                "transition-all duration-150 group",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "shrink-0 transition-transform duration-150",
                  !active && "group-hover:scale-110"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User profile + logout */}
      {user && (
        <div className="px-2.5 py-3 border-t border-border shrink-0 space-y-1">
          {/* User chip */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/50 mb-1">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-black text-primary">
                {(user.name || user.email || "U")[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate leading-none">
                {user.name || (user.roleCode === 0 ? "Admin" : "Photographer")}
              </p>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                {user.roleCode === 0 ? "Administrator" : user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={15} className="shrink-0" />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

function MobileBottomNav({ user }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showCreate, React_useState] = React.useState(false);
  const isAdmin = user?.roleCode === 0;

  if (isAdmin) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <BottomNavItem to="/admin/dashboard" icon={ShieldCheck} label="Admin" current={pathname} />
        <BottomNavItem to="/photographers" icon={Users} label="Profiles" current={pathname} />
      </nav>
    );
  }

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-card border-t border-border z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <BottomNavItem to="/dashboard" icon={BarChart3} label="Dashboard" current={pathname} />
        <BottomNavItem to="/packages" icon={Layers} label="Packages" current={pathname} />
        
        {/* Center Create Button */}
        <div className="relative -top-5">
          <button
            onClick={() => React_useState(true)}
            className="w-[52px] h-[52px] bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(var(--primary),0.3)] transform active:scale-95 transition-all"
          >
            <Plus size={26} strokeWidth={3} />
          </button>
        </div>

        <BottomNavItem to="/agreements" icon={FileText} label="Agreements" current={pathname} />
        <BottomNavItem to="/profile" icon={User} label="Profile" current={pathname} />
      </nav>

      {/* Create Options Dialog */}
      <Dialog open={showCreate} onOpenChange={React_useState}>
        <DialogContent className="max-w-[320px] rounded-[1.5rem] mx-auto p-5">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-black">Create New</DialogTitle>
            <DialogDescription className="text-center text-xs">
              What would you like to create?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-3 pb-1">
            <button
              onClick={() => { React_useState(false); navigate("/create-assignment"); }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 text-left cursor-pointer group"
            >
              <div className="bg-primary text-primary-foreground p-3 rounded-[0.8rem] shadow-sm group-hover:scale-110 transition-transform">
                <Camera size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">Assignment</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Standard booking session</p>
              </div>
            </button>
            <button
              onClick={() => { React_useState(false); navigate("/create-freelance-assignment"); }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/10 hover:bg-secondary/20 transition-colors border border-secondary/20 text-left cursor-pointer group"
            >
              <div className="bg-secondary text-secondary-foreground p-3 rounded-[0.8rem] shadow-sm group-hover:scale-110 transition-transform">
                <Briefcase size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">Freelance Job</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">B2B or studio work</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BottomNavItem({ to, icon: Icon, label, current }) {
  const active = current === to;
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center w-[60px] h-full gap-1 transition-colors duration-200",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon size={20} className={cn("transition-transform", active ? "scale-[1.12] origin-bottom" : "")} strokeWidth={active ? 2.5 : 2} />
      <span className={cn("text-[9px] font-bold origin-top", active ? "hidden" : "block")}>{label}</span>
      {active && <div className="w-1 h-1 rounded-full bg-primary mt-1" />}
    </Link>
  );
}

// ─── App Layout ───────────────────────────────────────────────────────────────

export default function AppLayout({ children, user, onLogout, theme, setTheme }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const ThemeIcon =
    theme === "dark" ? Sun : theme === "light" ? Moon : Laptop;

  const cycleTheme = () => {
    if (!setTheme) return;
    setTheme(
      theme === "dark" ? "light" : theme === "light" ? "system" : "dark"
    );
  };

  const userInitial = (user?.name || user?.email || "U")[0].toUpperCase();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden transition-colors duration-300">

      {/* ── Top bar ── */}
      <header className="z-40 h-14 flex items-center gap-3 px-4 shrink-0
        bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
        border-b border-border">

        {/* Hamburger removed as per request */}

        {/* Logo — mobile only (sidebar brand covers desktop) */}
        <div className="flex items-center gap-2 md:hidden">
          <img
            src="/static/icons/logo.png"
            alt="logo"
            className="w-7 h-7 rounded-lg object-cover"
          />
          <span className="text-sm font-black text-foreground">ShutterSync</span>
        </div>

        <div className="flex-1" />

        {/* Theme toggle */}
        {setTheme && (
          <button
            onClick={cycleTheme}
            title={`Current: ${theme} — click to cycle`}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ThemeIcon size={17} />
          </button>
        )}

        {/* User avatar */}
        <Link
          to="/profile"
          title="Profile"
          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center
            text-primary text-[11px] font-black hover:bg-primary/20 transition-colors"
        >
          {userInitial}
        </Link>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-60 md:flex-col md:shrink-0 overflow-y-auto border-r border-border">
          <Sidebar user={user} onLogout={onLogout} />
        </div>

        {/* Mobile sidebar — overlay drawer */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-60 md:hidden shadow-xl">
              <div className="h-full">
                <Sidebar
                  user={user}
                  onLogout={onLogout}
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            </div>
          </>
        )}

        {/* Main scrollable content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="px-4 sm:px-6 pt-5 pb-24 md:py-8 md:pb-8 max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav user={user} />
    </div>
  );
}
