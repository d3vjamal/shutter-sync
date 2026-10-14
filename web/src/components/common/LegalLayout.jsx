import React from "react";
import { Link } from "react-router-dom";

export const SUPPORT_EMAIL = "d3v.jamal@gmail.com";
export const LEGAL_UPDATED = "October 11, 2026";

export function Section({ id, title, children }) {
  return (
    <section id={id} className="mb-8 scroll-mt-20">
      <h2 className="text-lg font-bold text-foreground mb-3">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function LegalLayout({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 h-14 flex items-center gap-3 px-5 bg-background/95 backdrop-blur border-b border-border shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/static/icons/logo.png"
            alt="ShutterSync"
            className="w-7 h-7 rounded-lg object-cover shrink-0"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="text-sm font-black tracking-tight text-foreground">
            ShutterSync
          </span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-black text-foreground mb-2">{title}</h1>
        <p className="text-xs text-muted-foreground mb-8">
          Last updated: {LEGAL_UPDATED}
        </p>
        {children}
      </main>

      <footer className="border-t border-border py-6 px-5 text-xs text-muted-foreground">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} ShutterSync</span>
          <nav className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms &amp; Conditions
            </Link>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="hover:text-foreground transition-colors"
            >
              Support
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
