import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ClientView from "../components/ClientView";

// ─── Public branded shell (no sidebar / auth) ────────────────────────────────

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal branded header */}
      <header className="sticky top-0 z-40 h-14 flex items-center gap-3 px-5
        bg-background/95 backdrop-blur border-b border-border shrink-0">
        <img
          src="/static/icons/logo.png"
          alt="ShutterSync"
          className="w-7 h-7 rounded-lg object-cover shrink-0"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <span className="text-sm font-black tracking-tight text-foreground">
          ShutterSync
        </span>
        <span className="text-[10px] font-semibold text-muted-foreground ml-1 hidden sm:block">
          — Client Portal
        </span>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-6 py-6 md:py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-muted-foreground border-t border-border">
        Powered by <span className="font-bold text-foreground">ShutterSync</span>
      </footer>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicClientPage() {
  const { id } = useParams();
  const assignment = useQuery(api.assignments.get, id ? { id } : "skip");
  const [agreed, setAgreed] = useState(false);

  if (!id)
    return (
      <PublicLayout>
        <div className="max-w-lg mx-auto py-20 text-center">
          <p className="text-muted-foreground">Invalid assignment link.</p>
        </div>
      </PublicLayout>
    );

  if (assignment === undefined)
    return (
      <PublicLayout>
        <LoadingSpinner />
      </PublicLayout>
    );

  if (!assignment)
    return (
      <PublicLayout>
        <div className="max-w-lg mx-auto py-20 text-center">
          <p className="text-muted-foreground">Assignment not found.</p>
        </div>
      </PublicLayout>
    );

  const handlePaymentSuccess = () => {
    toast.success("Payment initiated! We'll confirm details soon.");
  };

  return (
    <PublicLayout>
      <ClientView
        pkg={assignment}
        onInitiatePayment={handlePaymentSuccess}
        agreed={agreed}
        setAgreed={setAgreed}
      />
    </PublicLayout>
  );
}
