import React from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Camera,
  FileText,

  LogOut,
  User,
} from "lucide-react";
import Footer from "../Footer";

function SidebarDrawer() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  React.useEffect(() => {
    const handleRouteChange = () => setSidebarOpen(false);
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);
  return null;
}

export default function AppLayout({
  children,
  user,
  onLogout,
  theme,
  setTheme,
}) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 font-sans flex flex-col">
      {/* Header always visible */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3 md:hidden">
          <button
            className="p-2 rounded-md bg-primary text-primary-foreground"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <img
            src="/static/icons/logo.png"
            alt="logo"
            className="w-10 h-10 mx-auto"
          />
        </div>
      </div>
      <div className="flex-1 w-full flex flex-col md:flex-row">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`fixed md:static z-50 h-full md:h-auto top-0 left-0 w-64 max-w-full p-4 bg-background border-r overflow-auto transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col`}
          style={{ minWidth: "220px" }}
        >
          <div className="flex flex-col items-center mb-6">
            <img
              src="/static/icons/logo.png"
              alt="logo"
              className="w-16 h-16 mb-2"
            />
            <span className="text-xs font-bold text-muted-foreground tracking-widest">
              SHUTTER SYNC
            </span>
          </div>
          <nav className="flex flex-col gap-2 mt-2">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${isActive("/dashboard") ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/5"}`}
            >
              <BarChart3 size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/create-assignment"
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${isActive("/create-assignment") ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/5"}`}
            >
              <Camera size={18} />
              <span>Create Assignment</span>
            </Link>
            <Link
              to="/agreements"
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${isActive("/agreements") ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/5"}`}
            >
              <FileText size={18} />
              <span>Manage Agreements</span>
            </Link>
            <Link
              to="/profile"
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${isActive("/profile") ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/5"}`}
            >
              <User size={18} />
              <span> Profile</span>
            </Link>
            {user && (
              <>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold text-destructive hover:bg-destructive/10 w-full"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>

        </aside>
        <main className="flex-1 max-w-7xl mx-auto px-2 sm:px-4 py-4 md:py-8 w-full">
          <section>{children}</section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
