import React from "react";
import AppLayout from "../components/layouts/AppLayout";
import Header from "../components/Header";
import PackagesManager from "../components/PackagesManager";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function ServicePackagesPage() {
  const { user, handleLogout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <AppLayout
      user={user}
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
    >
      <Header
        user={user}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />
      <PackagesManager />
    </AppLayout>
  );
}
