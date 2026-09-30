import React from "react";
import AppLayout from "../components/layouts/AppLayout";
import BannersManager from "../components/BannersManager";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function AdminBannersPage() {
  const { user, handleLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  return (
    <AppLayout user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme}>
      <BannersManager />
    </AppLayout>
  );
}
