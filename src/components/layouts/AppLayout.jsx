import React from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function AppLayout({ children, user, onLogout, theme, setTheme }) {
    return (
        <div className="min-h-screen bg-background transition-colors duration-500 font-sans">
            <Header
                user={user}
                onLogout={onLogout}
                theme={theme}
                setTheme={setTheme}
            />
            <main className="max-w-7xl mx-auto px-6 py-12">
                {children}
            </main>
            <Footer />
        </div>
    );
}
