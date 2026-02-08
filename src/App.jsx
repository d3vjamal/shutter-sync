import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import "./photographer.css";
import { ToastProvider, useToast } from "./components/Toast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import CreateAssignment from "./components/CreateAssignment";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import PhotographerManager from "./components/PhotographerManager";

const AppContent = () => {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.viewer);
  // 'user' will be null if not logged in, or object if logged in.
  // We can use this to determine state.

  const [view, setView] = useState("dashboard"); // 'dashboard', 'create-assignment', 'artists'
  const [theme, setTheme] = useState("dark"); // 'light', 'dark', 'system'
  const [route, setRoute] = useState(window.location.pathname); // Track current route

  const { showToast } = useToast();

  // Theme Handling
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("theme-light", "theme-dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      if (systemTheme === "light") root.classList.add("theme-light");
    } else if (theme === "light") {
      root.classList.add("theme-light");
    }
  }, [theme]);

  // Convex Queries
  const photographers = useQuery(api.photographers.list) || [];
  // assignments query: needs logged in user ID
  const assignments =
    useQuery(
      api.assignments.listByPhotographer,
      user ? { photographerId: user._id } : "skip",
    ) || [];

  // Convex Mutations
  const createPhotographer = useMutation(api.photographers.create);
  const updatePhotographer = useMutation(api.photographers.update);
  const deletePhotographer = useMutation(api.photographers.remove);

  const updateAssignStatus = useMutation(api.assignments.updateStatus);
  const updateAssignCaptureDate = useMutation(
    api.assignments.updateCaptureDate,
  );
  const updateAssignment = useMutation(api.assignments.update);
  const createAssignment = useMutation(api.assignments.create);
  const seedAdmin = useMutation(api.auth.seedAdmin);

  useEffect(() => {
    seedAdmin();
  }, [seedAdmin]);

  const handleLogout = async () => {
    await signOut();
    setView("dashboard");
    window.history.pushState({}, "", "/");
    setRoute("/");
  };

  const handleCreateAssignment = async (assignmentData) => {
    if (!user) return; // Should be protected anyway
    try {
      await createAssignment({
        ...assignmentData,
        photographerId: user._id,
        status: "Ongoing", // Default status
      });
      showToast("Assignment created successfully! 📸", "success");
      setView("dashboard");
    } catch (err) {
      showToast("Failed to create assignment: " + err.message, "error");
    }
  };

  // Login View if not authenticated
  if (user === null) {
    // Assuming query return null if not auth?
    // Actually convex-auth often returns null or undefined while loading.
    // api.users.viewer needs to be created to return current user.
    return (
      <div className="min-h-screen bg-main transition-colors duration-500 font-sans body-font">
        <Login />
        {/* Admin login is now handled via same flow usually, or we can keep separate route if heavily distinct */}
      </div>
    );
  }

  // Loading state
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Authenticated View
  return (
    <div className="min-h-screen bg-main transition-colors duration-500 font-sans body-font">
      <Header
        view={view}
        setView={setView}
        user={{ ...user, role: user.role || "photographer" }}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Basic role check */}
        {(user.role === "admin" || user.email === "admin@shuttersync.com") &&
          view === "artists" && (
            <PhotographerManager
              photographers={photographers}
              onAdd={createPhotographer}
              onUpdate={updatePhotographer}
              onDelete={deletePhotographer}
            />
          )}

        {/* Default Photographer View */}
        {view === "dashboard" && (
          <Dashboard
            assignments={assignments}
            onViewChange={setView}
            onUpdateStatus={async (id, status) =>
              await updateAssignStatus({ id, status })
            }
            onUpdateCaptureDate={async (id, date) =>
              await updateAssignCaptureDate({ id, captureDate: date })
            }
            onUpdateAssignment={async (id, data) => {
              await updateAssignment({ id, ...data });
              showToast("Assignment updated successfully!", "success");
            }}
          />
        )}

        {view === "create-assignment" && (
          <CreateAssignment onSave={handleCreateAssignment} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
