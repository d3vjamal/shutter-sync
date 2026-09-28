import React, { useState, useRef, useCallback } from "react";
import { FileDown, Printer, Loader2, X, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import PaymentReceiptPDF from "./PaymentReceiptPDF";
import { useAuth } from "../hooks/useAuth";

/**
 * Builds a standalone HTML document for printing the receipt.
 */
function buildPrintHTML(html, filename) {
  const base = `${window.location.origin}/`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=560, initial-scale=1.0, shrink-to-fit=no"/>
  <base href="${base}"/>
  <title>${filename}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; width: 560px; }
    body {
      font-family: 'Lato', 'Helvetica Neue', Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    @page { size: A4 portrait; margin: 10mm 12mm; }
  </style>
</head>
<body>${html}</body>
</html>`;
}

function printNode(node, filename) {
  if (!node) return;
  const html = node.innerHTML;
  const docHTML = buildPrintHTML(html, filename);

  try {
    const blob = new Blob([docHTML], { type: "text/html;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, "_blank");
    if (win) {
      let fired = false;
      const doPrint = () => {
        if (fired) return;
        fired = true;
        try { win.focus(); win.print(); } catch (e) { console.warn("Print failed", e); }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      };
      win.addEventListener("load", () => setTimeout(doPrint, 400));
      setTimeout(doPrint, 1800);
      return;
    }
    URL.revokeObjectURL(blobUrl);
  } catch (_) { /* fall through to iframe */ }

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;width:560px;height:1px;border:0;top:-10000px;left:-10000px;visibility:hidden;";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(docHTML);
  doc.close();
  let fired = false;
  const doPrint = () => {
    if (fired) return;
    fired = true;
    try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch (e) { console.warn("Print failed", e); }
    setTimeout(() => { if (iframe.parentNode) iframe.parentNode.removeChild(iframe); }, 3000);
  };
  iframe.contentWindow.addEventListener("load", () => setTimeout(doPrint, 350));
  setTimeout(doPrint, 1800);
}

// ─── Dialog ──────────────────────────────────────────────────────────────────

export default function PaymentReceiptDialog({
  payments = [],
  title = "Photography Service",
  clientName,
  totalAmount = 0,
  totalPaid = 0,
  balance = 0,
}) {
  const [open, setOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const { user } = useAuth();
  const docRef = useRef(null);

  const filename = `Receipt-${(title || "Payment")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50)}`;

  const handlePrint = useCallback(() => {
    if (printing) return;
    setPrinting(true);
    printNode(docRef.current, filename);
    setTimeout(() => setPrinting(false), 2000);
  }, [printing, filename]);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-primary hover:bg-primary/10 transition-colors duration-150"
        title="Generate Payment Receipt"
      >
        <Receipt size={13} />
        <span className="text-[10px] font-bold">Receipt</span>
      </button>

      {/* Preview Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-2xl w-full p-0 gap-0 overflow-hidden rounded-2xl border border-border
            [&>button:last-child]:hidden"
          style={{ maxHeight: "92vh" }}
        >
          {/* Top bar */}
          <DialogHeader className="flex flex-row items-center gap-2 px-4 py-3 border-b border-border shrink-0">
            <Receipt size={14} className="text-primary shrink-0" />
            <DialogTitle className="text-sm font-bold flex-1 min-w-0 truncate">
              Payment Receipt — {title}
            </DialogTitle>
            <Button
              onClick={handlePrint}
              disabled={printing}
              size="sm"
              className="shrink-0 h-8 px-3 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {printing ? (
                <><Loader2 size={13} className="mr-1.5 animate-spin" />Printing…</>
              ) : (
                <><Printer size={13} className="mr-1.5" />Save PDF</>
              )}
            </Button>
            <DialogClose asChild>
              <button
                className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </DialogClose>
          </DialogHeader>

          {/* PDF Preview */}
          <div
            className="overflow-y-auto"
            style={{ background: "#e5e7eb", maxHeight: "calc(92vh - 57px)" }}
          >
            <div className="py-3 px-2 flex justify-center">
              <div
                ref={docRef}
                style={{
                  background: "#ffffff",
                  width: "100%",
                  maxWidth: 600,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.10)",
                }}
              >
                <PaymentReceiptPDF
                  payments={payments}
                  title={title}
                  clientName={clientName}
                  totalAmount={totalAmount}
                  totalPaid={totalPaid}
                  balance={balance}
                  photographer={user}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
