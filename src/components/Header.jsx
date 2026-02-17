import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Sun, Moon, Laptop } from "lucide-react";
import { Button } from "./ui/button";

const Header = ({ user, onLogout, theme, setTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;

  const isActive = (path) => location.pathname === path;
  const userRole = user?.roleCode || user?.role || "photographer";
  const isAdmin =
    userRole === "admin" || user?.email === "admin@shuttersync.com";

  return (
    <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 py-2">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-end gap-2 min-h-[48px]">
        {/* Only show user actions, no logo or name */}
        {user && (
          <>
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
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
