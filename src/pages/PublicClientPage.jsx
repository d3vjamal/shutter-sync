import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ClientView from "../components/ClientView";
import { t } from "../lib/clientTranslations";

// ─── Public branded shell (no sidebar / auth) ────────────────────────────────

function PublicLayout({ children, lang, onLangChange }) {
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
          — {t(lang, "clientPortal")}
        </span>

        {/* Language toggle */}
        <div className="ml-auto flex items-center bg-muted/60 rounded-xl p-0.5 gap-0.5">
          {[
            { code: "en", label: "EN" },
            { code: "bn", label: "বাং" },
          ].map(({ code, label }) => (
            <button
              key={code}
              onClick={() => onLangChange(code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-200 ${
                lang === code
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-6 py-6 md:py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-muted-foreground border-t border-border">
        {lang === "en" ? (
          <>Powered by <span className="font-bold text-foreground">ShutterSync</span></>
        ) : (
          <><span className="font-bold text-foreground">ShutterSync</span> দ্বারা পরিচালিত</>
        )}
      </footer>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicClientPage() {
  const { id } = useParams();
  const [lang, setLang] = useState("en");
  const assignment = useQuery(api.assignments.get, id ? { id } : "skip");
  const [agreed, setAgreed] = useState(false);
  const recordPayment = useMutation(api.payments.recordPublicPayment);

  if (!id)
    return (
      <PublicLayout lang={lang} onLangChange={setLang}>
        <div className="max-w-lg mx-auto py-20 text-center">
          <p className="text-muted-foreground">{t(lang, "invalidLink")}</p>
        </div>
      </PublicLayout>
    );

  if (assignment === undefined)
    return (
      <PublicLayout lang={lang} onLangChange={setLang}>
        <LoadingSpinner />
      </PublicLayout>
    );

  if (!assignment)
    return (
      <PublicLayout lang={lang} onLangChange={setLang}>
        <div className="max-w-lg mx-auto py-20 text-center">
          <p className="text-muted-foreground">{t(lang, "notFound")}</p>
        </div>
      </PublicLayout>
    );

  const handlePaymentSuccess = async (pkg, amount) => {
    try {
      await recordPayment({
        parentId: pkg._id,
        parentType: "assignment",
        amount: amount.toString(),
        note: `Online payment via client portal (${amount} INR)`,
      });
      toast.success(t(lang, "paymentInitiated"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to record payment");
    }
  };

  return (
    <PublicLayout lang={lang} onLangChange={setLang}>
      <ClientView
        pkg={assignment}
        lang={lang}
        onInitiatePayment={handlePaymentSuccess}
        agreed={agreed}
        setAgreed={setAgreed}
      />
    </PublicLayout>
  );
}
