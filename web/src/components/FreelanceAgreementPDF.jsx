import React from "react";
import { format } from "date-fns";

/**
 * FreelanceAgreementPDF — always light/white, theme-independent.
 * Inline-styles only (same convention as AgreementPDF).
 *
 * Single page  : conditions ≤ 3 — everything on one page.
 * Two pages    : conditions > 3 — Page 1 core + acknowledgement, Page 2 terms appendix.
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
    <div
      style={{
        width: 3, height: 13, background: "#1a56db",
        borderRadius: 2, flexShrink: 0,
      }}
    />
    <span
      style={{
        fontSize: 8, fontWeight: 800, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "#475569",
      }}
    >
      {children}
    </span>
  </div>
);

const PartyBox = ({ label, name, subtitle, contact, extra = [] }) => (
  <div
    style={{
      flex: 1, border: "1px solid #e2e8f0",
      borderRadius: 8, overflow: "hidden",
    }}
  >
    <div
      style={{
        background: "#f1f5f9", padding: "5px 12px",
        borderBottom: "1px solid #e2e8f0", fontSize: 7.5,
        fontWeight: 800, textTransform: "uppercase",
        letterSpacing: "0.1em", color: "#64748b",
      }}
    >
      {label}
    </div>
    <div style={{ padding: "10px 12px" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
        {name || "—"}
      </div>
      {subtitle && (
        <div style={{ fontSize: 8.5, color: "#1a56db", fontWeight: 600, marginBottom: 2 }}>
          {subtitle}
        </div>
      )}
      {contact && (
        <div style={{ fontSize: 9, color: "#475569" }}>{contact}</div>
      )}
      {extra.map((e, i) => (
        <div key={i} style={{ fontSize: 8.5, color: "#64748b", marginTop: 1 }}>{e}</div>
      ))}
    </div>
  </div>
);

const AmountBox = ({ label, value, highlight }) => (
  <div
    style={{
      flex: 1, textAlign: "center", padding: "9px 8px", borderRadius: 8,
      background: highlight ? "#1a56db" : "#f8fafc",
      border: highlight ? "none" : "1px solid #e2e8f0",
    }}
  >
    <div
      style={{
        fontSize: 7.5, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: highlight ? "rgba(255,255,255,0.7)" : "#64748b",
        marginBottom: 5,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 15, fontWeight: 800,
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
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: "none", overflow: "hidden", zIndex: 0,
    }}
  >
    <div
      style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%) rotate(-35deg)",
        display: "grid", gridTemplateColumns: "repeat(3, 80px)",
        gap: "60px 80px", opacity: 0.12,
      }}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <img
          key={i}
          src="/static/icons/logo.png"
          alt=""
          style={{ width: 72, height: 72, objectFit: "contain" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ))}
    </div>
  </div>
);

// ─── Shared Header ────────────────────────────────────────────────────────────

const PDFHeader = ({ photographer, refId, today }) => (
  <div style={{ marginBottom: 20 }}>
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, paddingBottom: 14, borderBottom: "2px solid #1a56db",
      }}
    >
      {/* Brand logo */}
      <div style={{ width: 48, height: 48, flexShrink: 0 }}>
        {photographer?.brandLogoUrl ? (
          <img
            src={photographer.brandLogoUrl}
            alt="Brand"
            style={{
              width: 48, height: 48, borderRadius: 6, objectFit: "contain",
              border: "1px solid #e2e8f0", background: "#f8fafc", padding: 4,
            }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div style={{ width: 48 }} />
        )}
      </div>

      {/* Center */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <div
          style={{
            fontSize: 16, fontWeight: 900, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#1a56db", lineHeight: 1.1,
          }}
        >
          Freelance Agreement
        </div>
        <div style={{ fontSize: 7.5, color: "#94a3b8", marginTop: 5, letterSpacing: "0.04em" }}>
          {refId} &nbsp;·&nbsp; {today}
        </div>
      </div>

      {/* ShutterSync logo */}
      <div style={{ width: 48, height: 48, flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
        <img
          src="/static/icons/logo.png"
          alt="ShutterSync"
          style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>
    </div>
  </div>
);

// ─── Shared Footer ────────────────────────────────────────────────────────────

const PDFFooter = ({ photographer, refId }) => (
  <div
    style={{
      marginTop: 18, paddingTop: 10, borderTop: "1px solid #e2e8f0",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontSize: 7.5, color: "#94a3b8",
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

// ─── Page style ───────────────────────────────────────────────────────────────

const pageStyle = {
  width: "100%", maxWidth: 720, margin: "0 auto",
  padding: "14px 18px 14px", background: "#ffffff", color: "#1e293b",
  fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif",
  fontSize: 10, lineHeight: 1.5, boxSizing: "border-box", position: "relative",
};

// ─── Main Document ────────────────────────────────────────────────────────────

export default function FreelanceAgreementPDF({ job, photographer }) {
  const refId = `#FL-${String(job._id || "").slice(-6).toUpperCase()}`;
  const today = format(new Date(), "dd MMMM yyyy");

  const fmtDate = (d) => {
    try { return format(new Date(d + "T00:00:00"), "dd MMM yyyy"); } catch { return d; }
  };

  const dates = (job.dates || []).map(fmtDate);
  const dateDisplay = dates.length === 0 ? "TBD" : dates.join("  ·  ");

  const photoTotal    = Number(job.photographyAmount || 0);
  const photoReceived = Number(job.photographyReceived || 0);
  const photoDue      = Math.max(0, photoTotal - photoReceived);
  const videoTotal    = Number(job.videographyAmount || 0);
  const videoReceived = Number(job.videographyReceived || 0);
  const videoDue      = Math.max(0, videoTotal - videoReceived);

  const conditions = job.conditions || [];
  const multiPage  = conditions.length > 3;

  const headerProps = { photographer, refId, today };
  const footerProps = { photographer, refId };

  // ── Title ───────────────────────────────────────────────────────────────────
  const TitleSection = (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 19, fontWeight: 800, color: "#0f172a",
          letterSpacing: "-0.02em", lineHeight: 1.2,
        }}
      >
        {job.studioName}
      </div>
      <div style={{ fontSize: 11, color: "#1a56db", fontWeight: 700, marginTop: 3 }}>
        Freelance Assignment
      </div>
      {(job.venue || job.location) && (
        <div style={{ fontSize: 9.5, color: "#64748b", marginTop: 4 }}>
          {[job.venue, job.location].filter(Boolean).join(" · ")}
        </div>
      )}
    </div>
  );

  // ── Parties ─────────────────────────────────────────────────────────────────
  const PartiesSection = (
    <div style={{ marginBottom: 16 }}>
      <SectionLabel>Parties Involved</SectionLabel>
      <div style={{ display: "flex", gap: 10 }}>
        <PartyBox
          label="Studio"
          name={job.studioOwnerName}
          subtitle={job.studioName}
          contact={job.studioMobile}
          extra={[job.studioEmail, job.studioArea].filter(Boolean)}
        />
        <PartyBox
          label="Photographer"
          name={job.photographerName}
          contact={job.photographerMobile}
          extra={[job.photographerEmail].filter(Boolean)}
        />
        {job.hasVideography && job.videographerName && (
          <PartyBox
            label="Videographer"
            name={job.videographerName}
            contact={job.videographerMobile}
            extra={[job.videographerEmail].filter(Boolean)}
          />
        )}
      </div>
    </div>
  );

  // ── Work Details ─────────────────────────────────────────────────────────────
  const workRows = [
    { label: "Date(s)",   value: dateDisplay },
    { label: "Duration",  value: dates.length > 0 ? `${dates.length} Day${dates.length !== 1 ? "s" : ""}` : null },
    { label: "Venue",     value: job.venue },
    { label: "Location",  value: job.location },
  ].filter((r) => r.value);

  const WorkSection = workRows.length > 0 && (
    <div style={{ marginBottom: 16 }}>
      <SectionLabel>Work Details</SectionLabel>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
        {workRows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center",
              background: i % 2 === 0 ? "#f8fafc" : "#ffffff",
              borderBottom: i < workRows.length - 1 ? "1px solid #f1f5f9" : "none",
              padding: "5.5px 12px",
            }}
          >
            <span style={{ fontSize: 8.5, color: "#64748b", fontWeight: 600, width: 80, flexShrink: 0 }}>
              {row.label}
            </span>
            <span style={{ fontSize: 8.5, color: "#1e293b" }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Gadgets ──────────────────────────────────────────────────────────────────
  const GadgetsSection = (job.gadgets || []).length > 0 && (
    <div style={{ marginBottom: 16 }}>
      <SectionLabel>Gadgets &amp; Equipment</SectionLabel>
      <div
        style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px",
        }}
      >
        {job.gadgets.map((g, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "flex-start", gap: 7,
              fontSize: 9, color: "#334155", padding: "3px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <span
              style={{
                fontSize: 8, fontWeight: 800, color: "#1a56db",
                flexShrink: 0, marginTop: 1, minWidth: 18,
              }}
            >
              {String(i + 1).padStart(2, "0")}.
            </span>
            {g}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Photography Payment + Footage ────────────────────────────────────────────
  const PhotographySection = (photoTotal > 0 || (job.photographyFootageTypes || []).length > 0) && (
    <div style={{ marginBottom: 16 }}>
      <SectionLabel>Photography</SectionLabel>
      {/* Footage */}
      {(job.photographyFootageTypes || []).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
          {job.photographyFootageTypes.map((t, i) => (
            <span key={i} style={{ fontSize: 8.5, fontWeight: 700, color: "#10b981", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 99, padding: "3px 10px" }}>
              {t}
            </span>
          ))}
        </div>
      )}
      {/* Payment */}
      {photoTotal > 0 && (
        <div style={{ display: "flex", gap: 8 }}>
          <AmountBox label="Total" value={`₹${photoTotal.toLocaleString()}`} />
          <AmountBox label="Received" value={`₹${photoReceived.toLocaleString()}`} highlight />
          <AmountBox label="Due" value={`₹${photoDue.toLocaleString()}`} />
        </div>
      )}
    </div>
  );

  // ── Videography Payment + Footage ─────────────────────────────────────────────
  const VideographySection = job.hasVideography && (videoTotal > 0 || (job.videographyFootageTypes || []).length > 0) && (
    <div style={{ marginBottom: 16 }}>
      <SectionLabel>Videography</SectionLabel>
      {(job.videographyFootageTypes || []).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
          {job.videographyFootageTypes.map((t, i) => (
            <span key={i} style={{ fontSize: 8.5, fontWeight: 700, color: "#1a56db", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 99, padding: "3px 10px" }}>
              {t}
            </span>
          ))}
        </div>
      )}
      {videoTotal > 0 && (
        <div style={{ display: "flex", gap: 8 }}>
          <AmountBox label="Total" value={`₹${videoTotal.toLocaleString()}`} />
          <AmountBox label="Received" value={`₹${videoReceived.toLocaleString()}`} highlight />
          <AmountBox label="Due" value={`₹${videoDue.toLocaleString()}`} />
        </div>
      )}
    </div>
  );

  // ── Acknowledgement ──────────────────────────────────────────────────────────
  const AcknowledgementSection = (
    <div style={{ marginTop: 6, marginBottom: 4 }}>
      <SectionLabel>Acknowledgement</SectionLabel>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
        {/* Studio Owner */}
        <div style={{ flex: 1 }}>
          <div style={{ borderTop: "1.5px dashed #cbd5e1", paddingTop: 8, marginTop: 24 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "#0f172a" }}>
              {job.studioOwnerName || "Studio Owner"}
            </div>
            <div style={{ fontSize: 8, color: "#64748b" }}>Studio Owner</div>
            {job.studioMobile && (
              <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 1 }}>
                {job.studioMobile}
              </div>
            )}
          </div>
        </div>
        {/* Photographer */}
        <div style={{ flex: 1 }}>
          <div style={{ borderTop: "1.5px dashed #cbd5e1", paddingTop: 8, marginTop: 24 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "#0f172a" }}>
              {job.photographerName || "Photographer"}
            </div>
            <div style={{ fontSize: 8, color: "#64748b" }}>Photographer</div>
            {job.photographerMobile && (
              <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 1 }}>
                {job.photographerMobile}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Terms ────────────────────────────────────────────────────────────────────
  const TermsSection = conditions.length > 0 && (
    <div style={{ marginBottom: 20 }}>
      {multiPage && (
        <div
          style={{
            background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8,
            padding: "7px 12px", marginBottom: 16,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 8.5, fontWeight: 700, color: "#475569" }}>
            {job.studioName} — Freelance
          </span>
          <span style={{ fontSize: 7.5, color: "#94a3b8", fontStyle: "italic" }}>
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
              display: "flex", gap: 10, fontSize: 9, color: "#334155",
              paddingLeft: 10, borderLeft: "2px solid #e2e8f0",
              paddingTop: 3, paddingBottom: 3, lineHeight: 1.6,
            }}
          >
            <span style={{ color: "#1a56db", fontWeight: 800, flexShrink: 0, minWidth: 16 }}>
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
      <div style={{ fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif", display: "block" }}>
        <div style={{ ...pageStyle }}>
          <Watermark />
          <div style={{ position: "relative", zIndex: 1 }}>
            <PDFHeader {...headerProps} />
            {TitleSection}
            {PartiesSection}
            {WorkSection}
            {GadgetsSection}
            {PhotographySection}
            {VideographySection}
            {AcknowledgementSection}
            <PDFFooter {...footerProps} />
          </div>
        </div>
        <div
          data-pdf-break="1"
          style={{
            display: "block", width: "100%", height: 0, overflow: "hidden",
            visibility: "hidden", pageBreakAfter: "always", breakAfter: "page",
          }}
        />
        <div style={{ ...pageStyle }}>
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
        {WorkSection}
        {GadgetsSection}
        {PhotographySection}
        {VideographySection}
        {TermsSection}
        {AcknowledgementSection}
        <PDFFooter {...footerProps} />
      </div>
    </div>
  );
}
