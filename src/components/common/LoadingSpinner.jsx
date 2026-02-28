import React from "react";

export default function LoadingSpinner({ message = "Loading…" }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-5 animate-load">
        {/* Conic spinner with logo inset */}
        <div className="relative">
          <div className="fancy-spinner" aria-hidden="true" />
          <img
            src="/static/icons/logo.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 m-auto w-6 h-6 rounded-md object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-black tracking-[0.22em] text-foreground uppercase">
            ShutterSync
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground loader-text">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
