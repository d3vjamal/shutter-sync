import React from "react";
import AppLayout from "../components/layouts/AppLayout";
import PhotographerManager from "../components/PhotographerManager";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { usePhotographers } from "../hooks/usePhotographers";

export default function PhotographersPage() {
    const { user, handleLogout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { photographers, createPhotographer, updatePhotographer, deletePhotographer } = usePhotographers();

    return (
        <AppLayout user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme}>
            <PhotographerManager
                photographers={photographers}
                onAdd={createPhotographer}
                onUpdate={updatePhotographer}
                onDelete={deletePhotographer}
            />
        </AppLayout>
    );
}
