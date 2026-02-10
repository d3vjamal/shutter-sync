import React from "react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-background transition-colors duration-500 font-sans">
            {children}
        </div>
    );
}
