import React from "react";
import {
  Camera,
  BarChart3,
  Package,
  Users,
  LogOut,
  User,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

const Header = ({ view, setView, user, onLogout, theme, setTheme }) => {
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl px-6 py-4"
      style={{
        background: "var(--card-bg)",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo Section */}
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() =>
            setView(user?.role === "admin" ? "artists" : "dashboard")
          }
        >
          <div
            className="p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform"
            style={{ background: "var(--primary-color)" }}
          >
            <Camera
              size={22}
              className="md:w-6 md:h-6"
              style={{ color: "var(--bg-main)" }}
            />
          </div>
          <div>
            <h1
              className="text-xl md:text-2xl font-black heading-font tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              ShutterSync
            </h1>
            <p
              className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-black opacity-60"
              style={{ color: "var(--text-secondary)" }}
            >
              Smart photography simplified
            </p>
          </div>
        </div>

        {/* Navigation & User Profile */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Role-Based Nav */}
          {user && (
            <nav
              className="flex items-center p-1.5 rounded-2xl"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
              }}
            >
              {user.role === "admin" ? (
                <button
                  onClick={() => setView("artists")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-500"
                  style={{
                    background:
                      view === "artists"
                        ? "var(--primary-color)"
                        : "transparent",
                    color:
                      view === "artists"
                        ? "var(--bg-main)"
                        : "var(--text-secondary)",
                    transform: view === "artists" ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <Users size={16} />
                  <span>Artists</span>
                </button>
              ) : (
                <>
                  {[
                    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                    {
                      id: "create-assignment",
                      label: "New Assignment",
                      icon: BarChart3,
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-500"
                      style={{
                        background:
                          view === item.id
                            ? "var(--primary-color)"
                            : "transparent",
                        color:
                          view === item.id
                            ? "var(--bg-main)"
                            : "var(--text-secondary)",
                        transform:
                          view === item.id ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </>
              )}
            </nav>
          )}

          {/* User Profile & Logout */}
          {user && (
            <div
              className="flex items-center gap-4 pl-6"
              style={{ borderLeft: "1px solid var(--card-border)" }}
            >
              <div className="text-right hidden sm:block">
                <p
                  className="text-sm font-bold line-clamp-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.profile.name}
                </p>
                <p
                  className="text-[10px] uppercase tracking-widest font-black opacity-60"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.role}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setTheme(
                      theme === "dark"
                        ? "light"
                        : theme === "light"
                          ? "system"
                          : "dark",
                    )
                  }
                  className="p-2.5 rounded-xl transition-all active:scale-95 group"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    color: "var(--primary-color)",
                  }}
                  title={`Switch to ${theme === "dark" ? "Light" : theme === "light" ? "System" : "Dark"} Mode`}
                >
                  <ThemeIcon
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                </button>
                <div
                  className="p-2 rounded-xl"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    color: "var(--primary-color)",
                  }}
                >
                  <User size={18} />
                </div>
                <button
                  onClick={onLogout}
                  className="p-2.5 rounded-xl transition-all active:scale-95 group"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "#ef4444",
                  }}
                  title="Logout"
                >
                  <LogOut
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
