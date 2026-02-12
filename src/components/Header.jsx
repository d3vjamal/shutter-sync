import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Camera,
  BarChart3,
  Users,
  LogOut,
  User,
  FileText,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const Header = ({ user, onLogout, theme, setTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;

  const isActive = (path) => location.pathname === path;
  const userRole = user?.roleCode || user?.role || "photographer";
  const isAdmin =
    userRole === "admin" || user?.email === "admin@shuttersync.com";

  return (
    <header className=" top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo Section */}
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/static/icons/logo.png"
              alt="ShutterSync Logo"
              className="w-20 h-20 transition-transform hover:scale-110 duration-500 drop-shadow-2xl"
            />
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground mt-1 text-center md:text-left">
              Smart photography simplified
            </p>
          </div>
        </div>

        {/* Navigation & User Profile */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Role-Based Nav */}
          {user && (
            <nav className="flex items-center bg-muted/50 p-1 rounded-lg border">
              {isAdmin ? (
                <div className="flex gap-1">
                  <Button
                    variant={isActive("/dashboard") ? "default" : "ghost"}
                    onClick={() => navigate("/dashboard")}
                    className={cn(
                      "flex items-center gap-2 px-4 md:px-6 py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-300",
                      isActive("/dashboard")
                        ? "shadow-sm scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <BarChart3 size={16} />
                    <span>Dashboard</span>
                  </Button>
                  <Button
                    variant={isActive("/photographers") ? "default" : "ghost"}
                    onClick={() => navigate("/photographers")}
                    className={cn(
                      "flex items-center gap-2 px-4 md:px-6 py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-300",
                      isActive("/photographers")
                        ? "shadow-sm scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Users size={16} />
                    <span>Photographers</span>
                  </Button>
                  <Button
                    variant={isActive("/agreements") ? "default" : "ghost"}
                    onClick={() => navigate("/agreements")}
                    className={cn(
                      "flex items-center gap-2 px-4 md:px-6 py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-300",
                      isActive("/agreements")
                        ? "shadow-sm scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <FileText size={16} />
                    <span>Agreements</span>
                  </Button>
                </div>
              ) : (
                <div className="flex gap-1">
                  {[
                    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
                    {
                      path: "/create-assignment",
                      label: "New Assignment",
                      icon: Camera,
                    },
                  ].map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "flex items-center gap-2 px-4 md:px-6 py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-300",
                        isActive(item.path)
                          ? "shadow-sm scale-[1.02]"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Button>
                  ))}
                  <Button
                    variant={isActive("/agreements") ? "default" : "ghost"}
                    onClick={() => navigate("/agreements")}
                    className={cn(
                      "flex items-center gap-2 px-4 md:px-6 py-2 rounded-md font-bold text-xs md:text-sm transition-all duration-300",
                      isActive("/agreements")
                        ? "shadow-sm scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <FileText size={16} />
                    <span>Agreements</span>
                  </Button>
                </div>
              )}
            </nav>
          )}

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-4 pl-6 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">{user.name}</p>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                  {user.roleName || user.roleCode || user.role}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setTheme(
                      theme === "dark"
                        ? "light"
                        : theme === "light"
                          ? "system"
                          : "dark",
                    )
                  }
                  className="rounded-xl transition-all active:scale-95 group hover:bg-accent hover:text-accent-foreground"
                  title={`Switch to ${theme === "dark" ? "Light" : theme === "light" ? "System" : "Dark"} Mode`}
                >
                  <ThemeIcon
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/profile")}
                  className="p-2 rounded-xl bg-primary text-accent-foreground border aspect-square flex items-center justify-center"
                  title="Profile"
                >
                  <User size={18} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={onLogout}
                  className="rounded-xl transition-all active:scale-95 group"
                  title="Logout"
                >
                  <LogOut
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
