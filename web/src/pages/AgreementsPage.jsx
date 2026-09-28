import React from "react";
import AppLayout from "../components/layouts/AppLayout";
import Header from "../components/Header";
import AgreementsManager from "../components/AgreementsManager";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useAgreements } from "../hooks/useAgreements";

export default function AgreementsPage() {
  const { user, handleLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { agreements, createAgreement, updateAgreement, deleteAgreement } =
    useAgreements();

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
      <AgreementsManager
        agreements={agreements}
        onAdd={createAgreement}
        onUpdate={updateAgreement}
        onDelete={deleteAgreement}
      />
    </AppLayout>
  );
}
