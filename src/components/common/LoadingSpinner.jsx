import React from "react";

export default function LoadingSpinner({ message = "Initializing Session" }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 animate-load">
        <div className="fancy-spinner" aria-hidden="true"></div>
        <p className="text-[12px] font-black uppercase tracking-widest text-muted-foreground loader-text">
          {message}
        </p>
      </div>
    </div>
  );
}
