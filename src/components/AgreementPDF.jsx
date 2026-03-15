import React from "react";
import { format } from "date-fns";

/**
 * AgreementPDF — always light/white, theme-independent.
 *
 * Single page  : conditions ≤ 3 — everything on one page.
 * Two pages    : conditions > 3 — Page 1 has all core sections + acknowledgement.
 *                                  Page 2 is Terms appendix with same header/footer.
 * Watermark    : tiled ShutterSync logo at very low opacity on every page.
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}
  >
    <div
      style={{
        width: 3,
        height: 13,
        background: "#1a56db",
        borderRadius: 2,
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontSize: 8,
        fontWeight: 800,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#475569",
      }}
    >
      {children}
    </span>
  </div>
);

const AmountBox = ({ label, value, highlight }) => (
  <div
    style={{
      flex: 1,
      textAlign: "center",
      padding: "9px 8px",
      borderRadius: 8,
      background: highlight ? "#1a56db" : "#f8fafc",
      border: highlight ? "none" : "1px solid #e2e8f0",
    }}
  >
    <div
      style={{
        fontSize: 7.5,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: highlight ? "rgba(255,255,255,0.7)" : "#64748b",
        marginBottom: 5,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 15,
        fontWeight: 800,
        color: highlight ? "#ffffff" : "#0f172a",
        lineHeight: 1,
      }}
    >
      {value}
    </div>
  </div>
);

// ─── Watermark ────────────────────────────────────────────────────────────────

const Watermark = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "none",
      overflow: "hidden",
      zIndex: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) rotate(-35deg)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 80px)",
        gap: "52px 64px",
        opacity: 0.05,
      }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <img
          key={i}
          src="/static/icons/logo.png"
          alt=""
          style={{ width: 72, height: 72, objectFit: "contain" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ))}
    </div>
  </div>
);

// ─── Shared Header — full-width blue banner ───────────────────────────────────

const PDFHeader = ({ photographer, refId, today }) => (
  <div style={{ marginBottom: 20 }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        paddingBottom: 14,
        borderBottom: "2px solid #1a56db",
      }}
    >
      {/* Brand logo */}
      <div style={{ width: 48, height: 48, flexShrink: 0 }}>
        {photographer?.brandLogoUrl ? (
          <img
            src={photographer.brandLogoUrl}
            alt="Brand"
            style={{
              width: 48,
              height: 48,
              borderRadius: 6,
              objectFit: "contain",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              padding: 4,
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div style={{ width: 48 }} />
        )}
      </div>

      {/* Center */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#1a56db",
            lineHeight: 1.1,
          }}
        >
          Service Agreement
        </div>
        <div
          style={{
            fontSize: 7.5,
            color: "#94a3b8",
            marginTop: 5,
            letterSpacing: "0.04em",
          }}
        >
          {refId} &nbsp;·&nbsp; {today}
        </div>
      </div>

      {/* ShutterSync logo */}
      <div
        style={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <img
          src="/static/icons/logo.png"
          alt="ShutterSync"
          style={{
            width: 48,
            height: 48,
            borderRadius: 6,
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
    </div>
  </div>
);

// ─── Shared Footer ────────────────────────────────────────────────────────────

const PDFFooter = ({ photographer, refId }) => (
  <div
    style={{
      marginTop: 18,
      paddingTop: 10,
      borderTop: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 7.5,
      color: "#94a3b8",
    }}
  >
    <span>
      Generated on ShutterSync
      {photographer?.name ? ` · ${photographer.name}` : ""}
    </span>
    <span style={{ fontStyle: "italic", color: "#b0bec5" }}>
      Computer-generated · No signature required
    </span>
    <span>Ref: {refId}</span>
  </div>
);

// ─── Page wrapper style ───────────────────────────────────────────────────────

const pageStyle = {
  width: "100%",
  // A4 at 96dpi = 794px; @page margin 14mm each side ≈ 106px total → ~688px
  // usable. Keep maxWidth inside that so nothing is clipped on print.
  maxWidth: 680,
  margin: "0 auto",
  padding: "28px 32px 28px",
  background: "#ffffff",
  color: "#1e293b",
  fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif",
  fontSize: 10,
  lineHeight: 1.5,
  boxSizing: "border-box",
  position: "relative",
};

// ─── Main Document ────────────────────────────────────────────────────────────

export default function AgreementPDF({ assignment, photographer }) {
  const paid = Number(assignment.paidAmount || 0);
  const total = Number(assignment.amount || 0);
  const pending = Math.max(0, total - paid);
  const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;

  const refId = `#${String(assignment._id || "")
    .slice(-7)
    .toUpperCase()}`;
  const today = format(new Date(), "dd MMMM yyyy");

  const fmtDate = (d) => {
    try {
      return format(new Date(d), "dd MMM yyyy");
    } catch {
      return d;
    }
  };

  const dates = assignment.photographerDays?.length
    ? assignment.photographerDays.map(fmtDate)
    : assignment.eventStartDate
      ? [fmtDate(assignment.eventStartDate)]
      : [];

  const dateDisplay = dates.length === 0 ? "TBD" : dates.join("  ·  ");

  const conditions = assignment.conditions || [];
  const multiPage = conditions.length > 3;

  const headerProps = { photographer, refId, today };
  const footerProps = { photographer, refId };

  // ── Section: Title ──────────────────────────────────────────────────────────
  const TitleSection = (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 19,
          fontWeight: 800,
          color: "#0f172a",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        {assignment.title || assignment.packageName || "Photography Services"}
      </div>
      {assignment.description && (
        <div
          style={{
            fontSize: 9.5,
            color: "#64748b",
            marginTop: 4,
            maxWidth: 500,
          }}
        >
          {assignment.description}
        </div>
      )}
    </div>
  );

  // ── Section: Parties ────────────────────────────────────────────────────────
  const PartiesSection = (
    <div style={{ marginBottom: 16 }}>
      <SectionLabel>Parties Involved</SectionLabel>
      <div style={{ display: "flex", gap: 10 }}>
        {/* Photographer */}
        <div
          style={{
            flex: 1,
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#f1f5f9",
              padding: "5px 12px",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 7.5,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#64748b",
            }}
          >
            Photographer
          </div>
          <div style={{ padding: "10px 12px" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 3,
              }}
            >
              {photographer?.name || "—"}
            </div>
            {(photographer?.contact || photographer?.email) && (
              <div style={{ fontSize: 9, color: "#475569" }}>
                {photographer.contact || photographer.email}
              </div>
            )}
            {photographer?.upiId && (
              <div style={{ fontSize: 8.5, color: "#64748b", marginTop: 2 }}>
                <span style={{ fontWeight: 700 }}>UPI: </span>
                {photographer.upiId}
              </div>
            )}
          </div>
        </div>

        {/* Client */}
        <div
          style={{
            flex: 1,
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#f1f5f9",
              padding: "5px 12px",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 7.5,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#64748b",
            }}
          >
            Client
          </div>
          <div style={{ padding: "10px 12px" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 3,
              }}
            >
              {assignment.clientName || "—"}
            </div>
            {assignment.clientContact && (
              <div style={{ fontSize: 9, color: "#475569" }}>
                {assignment.clientContact}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Section: Event Details (table style) ────────────────────────────────────
  const eventRows = [
    { label: "Date(s)", value: dateDisplay },
    {
      label: "Duration",
      value: assignment.eventDuration
        ? `${assignment.eventDuration} Day${assignment.eventDuration !== 1 ? "s" : ""}`
        : null,
    },
    { label: "Venue", value: assignment.venue },
    { label: "Location", value: assignment.location },
  ].filter((r) => r.value);

  const EventSection = eventRows.length > 0 && (
    <div style={{ marginBottom: 16 }}>
      <SectionLabel>Event Details</SectionLabel>
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {eventRows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              background: i % 2 === 0 ? "#f8fafc" : "#ffffff",
              borderBottom:
                i < eventRows.length - 1 ? "1px solid #f1f5f9" : "none",
              padding: "5.5px 12px",
            }}
          >
            <span
              style={{
                fontSize: 8.5,
                color: "#64748b",
                fontWeight: 600,
                width: 80,
                flexShrink: 0,
              }}
            >
              {row.label}
            </span>
            <span style={{ fontSize: 8.5, color: "#1e293b" }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Section: Payment Summary ─────────────────────────────────────────────────
  const PaymentSection = (
    <div style={{ marginBottom: 16 }}>
      <SectionLabel>Payment Summary</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 9 }}>
        <AmountBox label="Total Amount" value={`₹${total.toLocaleString()}`} />
        <AmountBox
          label="Amount Paid"
          value={`₹${paid.toLocaleString()}`}
          highlight
        />
        <AmountBox label="Balance Due" value={`₹${pending.toLocaleString()}`} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 8.5,
          color: "#64748b",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 5,
            background: "#e2e8f0",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: pct === 100 ? "#10b981" : "#e8a647",
              borderRadius: 99,
            }}
          />
        </div>
        <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
          {pct}% paid
        </span>
      </div>
    </div>
  );

  // ── Section: Deliverables ────────────────────────────────────────────────────
  const DeliverablesSection = assignment.services?.length > 0 && (
    <div style={{ marginBottom: 16 }}>
      <SectionLabel>Deliverables &amp; Inclusions</SectionLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4px 20px",
        }}
      >
        {assignment.services.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 7,
              fontSize: 9,
              color: "#334155",
              padding: "3px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <span
              style={{
                fontSize: 8,
                fontWeight: 800,
                color: "#1a56db",
                flexShrink: 0,
                marginTop: 1,
                minWidth: 18,
              }}
            >
              {String(i + 1).padStart(2, "0")}.
            </span>
            {s}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Section: Acknowledgement + Stamp (always on Page 1) ──────────────────────
  const AcknowledgementSection = (
    <div style={{ marginTop: 6, marginBottom: 4 }}>
      <SectionLabel>Acknowledgement</SectionLabel>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
        {/* Photographer sig */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              borderTop: "1.5px dashed #cbd5e1",
              paddingTop: 8,
              marginTop: 24,
            }}
          >
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "#0f172a" }}>
              {photographer?.name || "Photographer"}
            </div>
            <div style={{ fontSize: 8, color: "#64748b" }}>Photographer</div>
            {photographer?.contact && (
              <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 1 }}>
                {photographer.contact}
              </div>
            )}
          </div>
        </div>

        {/* Client sig */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              borderTop: "1.5px dashed #cbd5e1",
              paddingTop: 8,
              marginTop: 24,
            }}
          >
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "#0f172a" }}>
              {assignment.clientName || "Client"}
            </div>
            <div style={{ fontSize: 8, color: "#64748b" }}>Client</div>
            {assignment.clientContact && (
              <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 1 }}>
                {assignment.clientContact}
              </div>
            )}
          </div>
        </div>

        {/* Stamp */}
        <div
          style={{
            flexShrink: 0,
            width: 86,
            height: 86,
            borderRadius: "50%",
            border: "2.5px solid #1a56db",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            padding: 8,
            position: "relative",
            opacity: 0.82,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 4,
              borderRadius: "50%",
              border: "1px dashed #1a56db",
            }}
          />
          <div
            style={{
              fontSize: 7,
              fontWeight: 800,
              color: "#1a56db",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.3,
              position: "relative",
            }}
          >
            ShutterSync
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#16a34a",
              textAlign: "center",
              lineHeight: 1,
              position: "relative",
            }}
          >
            ✓
          </div>
          <div
            style={{
              fontSize: 7,
              fontWeight: 700,
              color: "#1a56db",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.3,
              position: "relative",
            }}
          >
            {today}
          </div>
          <div
            style={{
              fontSize: 6,
              fontWeight: 600,
              color: "#1a56db",
              textAlign: "center",
              position: "relative",
              lineHeight: 1.3,
            }}
          >
            VERIFIED
          </div>
        </div>
      </div>
    </div>
  );

  // ── Section: Terms & Conditions ──────────────────────────────────────────────
  const TermsSection = conditions.length > 0 && (
    <div style={{ marginBottom: 20 }}>
      {/* Context strip — only shown on page 2 */}
      {multiPage && (
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "7px 12px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 8.5, fontWeight: 700, color: "#475569" }}>
            {assignment.title ||
              assignment.packageName ||
              "Photography Services"}
          </span>
          <span
            style={{ fontSize: 7.5, color: "#94a3b8", fontStyle: "italic" }}
          >
            Appendix · Page 2 of 2
          </span>
        </div>
      )}
      <SectionLabel>Terms &amp; Conditions</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {conditions.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              fontSize: 9,
              color: "#334155",
              paddingLeft: 10,
              borderLeft: "2px solid #e2e8f0",
              paddingTop: 3,
              paddingBottom: 3,
              lineHeight: 1.6,
            }}
          >
            <span
              style={{
                color: "#1a56db",
                fontWeight: 800,
                flexShrink: 0,
                minWidth: 16,
              }}
            >
              {i + 1}.
            </span>
            {c}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Two-page layout ──────────────────────────────────────────────────────────
  if (multiPage) {
    return (
      <div
        style={{ fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif" }}
      >
        {/* Page 1: all core sections + acknowledgement */}
        <div
          style={{
            ...pageStyle,
            pageBreakAfter: "always",
            breakAfter: "page",
          }}
        >
          <Watermark />
          <div style={{ position: "relative", zIndex: 1 }}>
            <PDFHeader {...headerProps} />
            {TitleSection}
            {PartiesSection}
            {EventSection}
            {PaymentSection}
            {DeliverablesSection}
            {AcknowledgementSection}
            <PDFFooter {...footerProps} />
          </div>
        </div>

        {/* Page 2: Terms appendix */}
        <div
          style={{
            ...pageStyle,
            pageBreakBefore: "always",
            breakBefore: "page",
          }}
        >
          <Watermark />
          <div style={{ position: "relative", zIndex: 1 }}>
            <PDFHeader {...headerProps} />
            {TermsSection}
            <PDFFooter {...footerProps} />
          </div>
        </div>
      </div>
    );
  }

  // ── Single-page layout ───────────────────────────────────────────────────────
  return (
    <div style={pageStyle}>
      <Watermark />
      <div style={{ position: "relative", zIndex: 1 }}>
        <PDFHeader {...headerProps} />
        {TitleSection}
        {PartiesSection}
        {EventSection}
        {PaymentSection}
        {DeliverablesSection}
        {TermsSection}
        {AcknowledgementSection}
        <PDFFooter {...footerProps} />
      </div>
    </div>
  );
}
