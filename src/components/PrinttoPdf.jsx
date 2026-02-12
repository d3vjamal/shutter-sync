import { useRef, useState, useCallback } from "react";
import { Printer, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export default function PrintToPDF({
  children,
  filename = "document",
  buttonLabel = "Print / Save PDF",
  className,
  buttonClassName,
}) {
  // Stable unique ID so multiple PrintToPDF instances don't conflict
  const idRef = useRef(`printpdf_${Math.random().toString(36).slice(2, 8)}`);
  const [printing, setPrinting] = useState(false);

  const handlePrint = useCallback(() => {
    if (printing) return;
    setPrinting(true);

    const uid = idRef.current;
    const prevTitle = document.title;
    document.title = filename;

    // Inject print stylesheet:
    // 1. Hide the entire body
    // 2. Show only our specific content div
    // 3. Hide the print button inside it
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-printpdf-id", uid);
    styleEl.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        #${uid},
        #${uid} * {
          visibility: visible;
        }
        #${uid} {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
        #${uid}__btn {
          display: none !important;
        }
        @page {
          margin: 12mm 16mm;
          size: A4 portrait;
        }
      }
    `;
    document.head.appendChild(styleEl);

    // Slight delay ensures the style is parsed before print dialog opens
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();

        // Cleanup after dialog closes / user cancels
        document.title = prevTitle;
        const injected = document.querySelector(`[data-printpdf-id="${uid}"]`);
        if (injected) injected.remove();
        setPrinting(false);
      });
    });
  }, [printing, filename]);

  const uid = idRef.current;

  return (
    <div id={uid} className={cn("relative", className)}>
      {children}

      {/* Print button — hidden in PDF via #uid__btn rule above */}
      <div id={`${uid}__btn`} className="flex justify-end mt-6">
        <button
          onClick={handlePrint}
          disabled={printing}
          className={cn(
            "inline-flex items-center gap-2.5 px-6 py-3 rounded-xl",
            "bg-primary text-primary-foreground",
            "text-[12px] font-black uppercase tracking-[0.15em]",
            "shadow-lg shadow-primary/25",
            "hover:opacity-90 hover:-translate-y-0.5",
            "active:translate-y-0",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            buttonClassName,
          )}
        >
          {printing ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Printer size={15} />
          )}
          {printing ? "Opening Print Dialog…" : buttonLabel}
        </button>
      </div>
    </div>
  );
}
