import React from "react";
import { format } from "date-fns";

/**
 * AgreementPDF
 * Pure presentational component — always renders in light/white mode
 * so it prints cleanly regardless of the app's current theme.
 */

const LINE = () => (
  <div style={{ height: 1, background: "#e2e8f0", margin: "16px 0" }} />
);

const SectionTitle = ({ children }) => (
  <div
    style={{
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#1a56db",
      marginBottom: 10,
      paddingBottom: 4,
      borderBottom: "2px solid #1a56db",
    }}
  >
    {children}
  </div>
);

const InfoRow = ({ label, value }) =>
  value ? (
    <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
      <span
        style={{ fontSize: 9, color: "#64748b", minWidth: 80, fontWeight: 600 }}
      >
        {label}
      </span>
      <span style={{ fontSize: 9, color: "#1e293b", flex: 1 }}>{value}</span>
    </div>
  ) : null;

const PartyBox = ({ title, name, contact, extra, extraLabel }) => (
  <div
    style={{
      flex: 1,
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      padding: "12px 14px",
      background: "#f8fafc",
    }}
  >
    <div
      style={{
        fontSize: 8,
        fontWeight: 800,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#94a3b8",
        marginBottom: 8,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#0f172a",
        marginBottom: 4,
      }}
    >
      {name || "—"}
    </div>
    {contact && <div style={{ fontSize: 10, color: "#475569" }}>{contact}</div>}
    {extra && (
      <div style={{ fontSize: 9, color: "#64748b", marginTop: 3 }}>
        {extraLabel && <span style={{ fontWeight: 600 }}>{extraLabel}: </span>}
        {extra}
      </div>
    )}
  </div>
);

const AmountBox = ({ label, value, highlight }) => (
  <div
    style={{
      flex: 1,
      textAlign: "center",
      padding: "10px 8px",
      borderRadius: 8,
      background: highlight ? "#1a56db" : "#f1f5f9",
      border: highlight ? "none" : "1px solid #e2e8f0",
    }}
  >
    <div
      style={{
        fontSize: 8,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: highlight ? "rgba(255,255,255,0.75)" : "#64748b",
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 14,
        fontWeight: 800,
        color: highlight ? "#ffffff" : "#0f172a",
      }}
    >
      {value}
    </div>
  </div>
);

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

  const dateDisplay =
    dates.length === 0
      ? "TBD"
      : dates.join("  ·  ");

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        padding: "32px 36px",
        background: "#ffffff",
        color: "#1e293b",
        fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif",
        fontSize: 10,
        lineHeight: 1.5,
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 12,
        }}
      >
        {/* Left: photographer brand logo only */}
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          {photographer?.brandLogoUrl && (
            <img
              src={photographer.brandLogoUrl}
              alt="Brand"
              style={{
                width: 52,
                height: 52,
                borderRadius: 8,
                objectFit: "contain",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                padding: 4,
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
        </div>

        {/* Center: title + meta */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#1a56db",
              lineHeight: 1.2,
            }}
          >
            Service Agreement
          </div>
          <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 4 }}>
            Ref: {refId} &nbsp;·&nbsp; {today}
          </div>
        </div>

        {/* Right: ShutterSync app logo only */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <img
            src="/static/icons/logo.png"
            alt="ShutterSync"
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Primary divider */}
      <div
        style={{
          height: 3,
          background: "#1a56db",
          borderRadius: 2,
          marginBottom: 20,
        }}
      />

      {/* ── Assignment title ── */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {assignment.title || assignment.packageName || "Photography Services"}
        </div>
        {assignment.description && (
          <div
            style={{
              fontSize: 10,
              color: "#64748b",
              marginTop: 4,
              maxWidth: 480,
            }}
          >
            {assignment.description}
          </div>
        )}
      </div>

      {/* ── Parties ── */}
      <div style={{ marginBottom: 20 }}>
        <SectionTitle>Parties Involved</SectionTitle>
        <div style={{ display: "flex", gap: 12 }}>
          <PartyBox
            title="Photographer"
            name={photographer?.name || "—"}
            contact={photographer?.contact || photographer?.email || ""}
            extra={photographer?.upiId}
            extraLabel="UPI"
          />
          <PartyBox
            title="Client"
            name={assignment.clientName || "—"}
            contact={assignment.clientContact || ""}
          />
        </div>
      </div>

      {/* ── Event details ── */}
      <div style={{ marginBottom: 20 }}>
        <SectionTitle>Event Details</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px 24px",
          }}
        >
          <InfoRow label="Date(s)" value={dateDisplay} />
          <InfoRow
            label="Duration"
            value={
              assignment.eventDuration
                ? `${assignment.eventDuration} Day${assignment.eventDuration !== 1 ? "s" : ""}`
                : null
            }
          />
          <InfoRow label="Venue" value={assignment.venue} />
          <InfoRow label="Location" value={assignment.location} />
        </div>
      </div>

      {/* ── Payment summary ── */}
      <div style={{ marginBottom: 20 }}>
        <SectionTitle>Payment Summary</SectionTitle>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <AmountBox
            label="Total Amount"
            value={`₹${total.toLocaleString()}`}
          />
          <AmountBox
            label="Amount Paid"
            value={`₹${paid.toLocaleString()}`}
            highlight
          />
          <AmountBox
            label="Balance Due"
            value={`₹${pending.toLocaleString()}`}
          />
        </div>

        {/* Progress bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 9,
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

      {/* ── Deliverables ── */}
      {assignment.services?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Deliverables & Inclusions</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3px 24px",
            }}
          >
            {assignment.services.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 6,
                  fontSize: 9.5,
                  color: "#334155",
                }}
              >
                <span
                  style={{
                    color: "#1a56db",
                    fontWeight: 800,
                    marginTop: 1,
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}.
                </span>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Terms ── */}
      {assignment.conditions?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Terms &amp; Conditions</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {assignment.conditions.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  fontSize: 9.5,
                  color: "#334155",
                  paddingLeft: 4,
                  borderLeft: "2px solid #e2e8f0",
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <span
                  style={{
                    color: "#1a56db",
                    fontWeight: 800,
                    flexShrink: 0,
                    marginTop: 0,
                  }}
                >
                  {i + 1}.
                </span>
                {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Acknowledgement + Stamp ── */}
      <div
        style={{
          pageBreakInside: "avoid",
          marginBottom: 20,
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        {/* Parties */}
        <div style={{ flex: 1 }}>
          <SectionTitle>Acknowledged By</SectionTitle>
          <div style={{ display: "flex", gap: 32 }}>
            {/* Photographer */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0f172a" }}>
                {photographer?.name || "Photographer"}
              </div>
              <div style={{ fontSize: 9, color: "#64748b" }}>Photographer</div>
              {photographer?.contact && (
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>
                  {photographer.contact}
                </div>
              )}
            </div>
            {/* Client */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0f172a" }}>
                {assignment.clientName || "Client"}
              </div>
              <div style={{ fontSize: 9, color: "#64748b" }}>Client</div>
              {assignment.clientContact && (
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>
                  {assignment.clientContact}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Official round stamp */}
        <div
          style={{
            flexShrink: 0,
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: "2.5px solid #1a56db",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            padding: 8,
            position: "relative",
            opacity: 0.85,
          }}
        >
          {/* Outer ring text effect via dashed inner border */}
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
          {/* Green tick mark */}
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

      {/* ── Footer ── */}
      <LINE />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 8,
          color: "#94a3b8",
        }}
      >
        <span>
          Generated on ShutterSync by
          {photographer?.name ? ` · ${photographer.name}` : ""}
        </span>
        <span
          style={{
            fontStyle: "italic",
            color: "#b0bec5",
          }}
        >
          This is a computer-generated agreement — no signature required.
        </span>
        <span>Ref: {refId}</span>
      </div>
    </div>
  );
}
