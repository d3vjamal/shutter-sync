import React, { useState, useRef, useCallback } from "react";
import { FileDown, Printer, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import AgreementPDF from "./AgreementPDF";
import { useAuth } from "../hooks/useAuth";

/**
 * Prints by cloning the rendered document's innerHTML into a hidden <iframe>
 * that is completely outside the Dialog portal — no overlay interference.
 * AgreementPDF uses only inline styles, so the copy is fully self-contained.
 */
function printNode(node, filename) {
  if (!node) return;

  const html = node.innerHTML;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  // Must have explicit A4 width (794px) so mobile browsers render content at
  // the correct width before applying @page size — a 0-width iframe causes
  // mobile to use a narrow viewport, breaking layout and page breaks.
  iframe.style.cssText =
    "position:fixed;width:794px;height:1px;border:0;top:-10000px;left:-10000px;visibility:hidden;";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=794, initial-scale=1.0, shrink-to-fit=no"/>
  <title>${filename}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; width: 794px; }
    body {
      font-family: 'Lato', 'Helvetica Neue', Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    @page { size: A4 portrait; margin: 10mm 14mm; }
  </style>
</head>
<body>${html}</body>
</html>`);
  doc.close();

  let fired = false;
  const doPrint = () => {
    if (fired) return;
    fired = true;
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.warn("Print failed", e);
    }
    setTimeout(() => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 3000);
  };

  // Try after fonts are likely ready; also set a fallback
  iframe.contentWindow.addEventListener("load", () => setTimeout(doPrint, 350));
  setTimeout(doPrint, 1800);
}

// ─── Dialog ──────────────────────────────────────────────────────────────────

export default function AssignmentPDFDialog({ assignment }) {
  const [open, setOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const { user } = useAuth();
  const docRef = useRef(null);

  const filename = `ShutterSync-${(
    assignment.title ||
    assignment.clientName ||
    "Agreement"
  )
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50)}`;

  const handlePrint = useCallback(() => {
    if (printing) return;
    setPrinting(true);
    printNode(docRef.current, filename);
    // Re-enable button after reasonable delay
    setTimeout(() => setPrinting(false), 2000);
  }, [printing, filename]);

  return (
    <>
      {/* ── Card trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        title="Generate Agreement PDF"
        className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl
          text-muted-foreground hover:text-primary hover:bg-primary/10
          transition-colors duration-150"
      >
        <FileDown size={14} />
        <span className="text-[10px] font-semibold">PDF</span>
      </button>

      {/* ── Preview modal ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* [&>button:last-child]:hidden suppresses the default absolute close X
            that Radix injects — we provide our own close button in the header */}
        <DialogContent
          className="max-w-3xl w-full p-0 gap-0 overflow-hidden rounded-2xl border border-border
            [&>button:last-child]:hidden"
          style={{ maxHeight: "92vh" }}
        >
          {/* Top bar */}
          <DialogHeader className="flex flex-row items-center gap-2 px-4 py-3 border-b border-border shrink-0">
            <FileDown size={14} className="text-primary shrink-0" />
            <DialogTitle className="text-sm font-bold flex-1 min-w-0 truncate">
              {assignment.title || assignment.clientName || "Agreement"} — PDF Preview
            </DialogTitle>

            {/* Print button */}
            <Button
              onClick={handlePrint}
              disabled={printing}
              size="sm"
              className="shrink-0 h-8 px-3 rounded-xl text-xs font-bold
                bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {printing ? (
                <><Loader2 size={13} className="mr-1.5 animate-spin" />Printing…</>
              ) : (
                <><Printer size={13} className="mr-1.5" />Save PDF</>
              )}
            </Button>

            {/* Close button — explicit, sits in the header flow */}
            <DialogClose asChild>
              <button
                className="shrink-0 p-1.5 rounded-lg text-muted-foreground
                  hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </DialogClose>
          </DialogHeader>

          {/* Scrollable preview — grey bg mimics print paper */}
          <div
            className="overflow-y-auto"
            style={{ background: "#e5e7eb", maxHeight: "calc(92vh - 57px)" }}
          >
            <div className="py-6 px-4 flex justify-center">
              {/* Paper shadow */}
              <div
                ref={docRef}
                style={{
                  background: "#ffffff",
                  width: "100%",
                  maxWidth: 720,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.10)",
                }}
              >
                <AgreementPDF assignment={assignment} photographer={user} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
