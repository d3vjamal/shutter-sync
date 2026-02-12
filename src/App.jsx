import React, { useEffect } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { Routes, Route, Navigate } from "react-router-dom";
import { api } from "../convex/_generated/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import DashboardPage from "./pages/DashboardPage";
import CreateAssignmentPage from "./pages/CreateAssignmentPage";
import PhotographersPage from "./pages/PhotographersPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import PublicClientPage from "./pages/PublicClientPage";
import AgreementsPage from "./pages/AgreementsPage";
import ProfilePage from "./pages/ProfilePage";

// Components
import LoadingSpinner from "./components/common/LoadingSpinner";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Hooks
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";

const AppContent = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const convex = useConvex();
  const seedAdmin = useMutation(api.auth.seedAdmin);
  const updateUserProfile = useMutation(api.users.updateUserProfile);

  // Diagnostic logging
  useEffect(() => {
    if (user === undefined) return;
    console.log("🔍 App diagnostics:", {
      userState: user === null ? "not-authenticated" : "authenticated",
      userEmail: user?.email || "N/A",
      userRole: user?.roleCode || user?.role || "N/A",
      convexConnected: !!convex,
    });
  }, [user, convex]);

  // Seed admin on mount
  useEffect(() => {
    seedAdmin();
  }, [seedAdmin]);

  // Handle post-signup profile update
  useEffect(() => {
    if (user && user.email && !(user.contact && user.upiId)) {
      const pendingFields = sessionStorage.getItem("pendingUserFields");
      if (pendingFields) {
        try {
          const fields = JSON.parse(pendingFields);
          console.log("Updating user profile with pending fields", fields);
          updateUserProfile({
            name: fields.name || undefined,
            contact: fields.contact || undefined,
            upiId: fields.upiId || undefined,
          }).catch((err) => {
            console.error("Failed to update user profile:", err);
          });
          sessionStorage.removeItem("pendingUserFields");
        } catch (err) {
          console.error("Error parsing pending fields:", err);
        }
      }
    }
  }, [user?.email, user?.contact, user?.upiId, updateUserProfile]);

  // Loading state
  if (user === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 font-sans animate-load">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/admin"
          element={
            user ? <Navigate to="/dashboard" replace /> : <AdminLoginPage />
          }
        />

        {/* Protected Routes - Default to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-assignment"
          element={
            <ProtectedRoute user={user}>
              <CreateAssignmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/photographers"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <PhotographersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agreements"
          element={
            <ProtectedRoute user={user}>
              <AgreementsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="/client/:id" element={<PublicClientPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
