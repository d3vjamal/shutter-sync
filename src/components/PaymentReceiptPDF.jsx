import React from "react";
import { format } from "date-fns";

/**
 * Retail-style shop-bill receipt for payment history.
 * Redesigned to match a shop receipt invoice.
 * Uses only inline styles so it can be printed/saved as PDF like AgreementPDF.
 */
export default function PaymentReceiptPDF({
  payments = [],
  title = "Photography Service",
  totalAmount = 0,
  totalPaid = 0,
  balance = 0,
  photographer,
  clientName,
}) {
  const today = format(new Date(), "dd/MM/yyyy");
  const pName = photographer?.name || "Photographer";
  const pContact = photographer?.contact || "";
  const pEmail = photographer?.email || "";
  const pAddress = photographer?.address || "";
  const pUPI = photographer?.upiId || "";
  const pLogo = photographer?.logoUrl || "/static/icons/logo.png";
  const receiptId = `REC-${Math.floor(Math.random() * 90000) + 10000}`;

  // Sort payments oldest-first for the bill
  const sorted = [...payments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const S = {
    page: {
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      maxWidth: 650,
      margin: "0 auto",
      padding: "40px",
      background: "#fff",
      color: "#1c2434",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 32,
      paddingBottom: 24,
      borderBottom: "1px solid #e2e8f0",
    },
    logoBox: {
      height: 60,
      objectFit: "contain",
      marginBottom: 12,
    },
    brandName: {
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: "-0.5px",
      color: "#0f172a",
      margin: "0 0 6px 0",
    },
    brandDetails: {
      fontSize: 12,
      color: "#475569",
      lineHeight: 1.6,
      margin: 0,
    },
    metaGrid: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "stretch",
      marginBottom: 40,
    },
    billToCol: {
      flex: 1,
    },
    detailsCol: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    metaLabel: {
      fontSize: 10,
      fontWeight: 800,
      textTransform: "uppercase",
      color: "#0f172a",
      marginBottom: 6,
      letterSpacing: "0.5px",
    },
    metaValue: {
      fontSize: 13,
      color: "#475569",
      lineHeight: 1.5,
    },
    receiptGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      marginBottom: "20px",
      textAlign: "right",
    },
    receiptGridLabel: {
      fontSize: 10,
      fontWeight: 800,
      textTransform: "uppercase",
      color: "#0f172a",
    },
    receiptGridValue: {
      fontSize: 12,
      color: "#475569",
    },
    totalHighlightBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderTop: "1px solid #e2e8f0",
      borderBottom: "1px solid #e2e8f0",
      marginBottom: 40,
    },
    totalHighlightLabel: {
      fontSize: 20,
      fontWeight: 800,
      color: "#16a34a",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    totalHighlightValue: {
      fontSize: 24,
      fontWeight: 900,
      color: "#16a34a",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: 24,
    },
    th: {
      padding: "12px 0",
      fontSize: 10,
      fontWeight: 800,
      textTransform: "uppercase",
      color: "#0f172a",
      textAlign: "left",
      borderBottom: "2px solid #0f172a",
    },
    thAmount: {
      padding: "12px 0",
      fontSize: 10,
      fontWeight: 800,
      textTransform: "uppercase",
      color: "#0f172a",
      textAlign: "right",
      borderBottom: "2px solid #0f172a",
    },
    td: {
      padding: "16px 0",
      fontSize: 13,
      borderBottom: "1px solid #f1f5f9",
      color: "#475569",
    },
    tdAmount: {
      padding: "16px 0",
      fontSize: 13,
      borderBottom: "1px solid #f1f5f9",
      color: "#475569",
      textAlign: "right",
    },
    tdDesc: {
      padding: "16px 0",
      fontSize: 13,
      borderBottom: "1px solid #f1f5f9",
      color: "#0f172a",
      fontWeight: 500,
    },
    footerTotals: {
      width: "50%",
      marginLeft: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginTop: 20,
    },
    footerRow: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 13,
      fontWeight: 600,
      color: "#475569",
    },
    footerGrandTotal: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 16,
      fontWeight: 800,
      color: "#0f172a",
      paddingTop: 12,
      borderTop: "2px solid #e2e8f0",
    },
  };

  return (
    <div style={S.page}>
      
      {/* ── Brand & Meta Header ── */}
      <div style={S.headerRow}>
        <div>
          <img src={pLogo} alt="Logo" style={S.logoBox} />
          <h1 style={S.brandName}>{pName}</h1>
          <p style={S.brandDetails}>
            {pAddress && <>{pAddress}<br/></>}
            {pContact && <>{pContact}<br/></>}
            {pEmail}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
           <h2 style={{ fontSize: 26, fontWeight: 900, color: "#e2e8f0", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 20px 0" }}>Receipt</h2>
        </div>
      </div>

      <div style={S.metaGrid}>
        {/* Bill To Info */}
        <div style={S.billToCol}>
          <div style={S.metaLabel}>BILL TO</div>
          <div style={S.metaValue}>
            {clientName ? (
              <span style={{ fontWeight: 600, color: "#0f172a" }}>{clientName}</span>
            ) : "Client Name"}
            <br />
            {title}
          </div>
        </div>

        {/* Receipt Details */}
        <div style={S.detailsCol}>
           <div style={{ display: "flex", gap: "24px", marginBottom: "8px" }}>
             <div style={S.receiptGridLabel}>RECEIPT #</div>
             <div style={S.receiptGridValue}>{receiptId}</div>
           </div>
           <div style={{ display: "flex", gap: "24px", marginBottom: "8px" }}>
             <div style={S.receiptGridLabel}>RECEIPT DATE</div>
             <div style={S.receiptGridValue}>{today}</div>
           </div>
        </div>
      </div>

      {/* ── Total Highlight Bar ── */}
      <div style={S.totalHighlightBar}>
        <div style={S.totalHighlightLabel}>RECEIPT TOTAL</div>
        <div style={S.totalHighlightValue}>₹{Number(totalPaid).toLocaleString()}</div>
      </div>

      {/* ── Items Table ── */}
      <table style={S.table}>
        <thead>
          <tr>
            <th style={{ ...S.th, width: "15%" }}>DATE</th>
            <th style={S.th}>DESCRIPTION</th>
            <th style={{ ...S.th, width: "20%" }}>UNIT AMOUNT</th>
            <th style={{ ...S.thAmount, width: "20%" }}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => (
            <tr key={p._id || i}>
              <td style={S.td}>{format(new Date(p.date), "dd/MM/yyyy")}</td>
              <td style={S.tdDesc}>{p.note || "Payment Installment"}</td>
              <td style={S.td}>₹{Number(p.amount).toLocaleString()}</td>
              <td style={S.tdAmount}>₹{Number(p.amount).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Summary ── */}
      <div style={S.footerTotals}>
        <div style={S.footerRow}>
          <span>Service Total</span>
          <span>₹{Number(totalAmount).toLocaleString()}</span>
        </div>
        <div style={S.footerRow}>
          <span>Amount Paid</span>
          <span>- ₹{Number(totalPaid).toLocaleString()}</span>
        </div>
        <div style={S.footerGrandTotal}>
          <span>Balance Due</span>
          <span>₹{Number(balance).toLocaleString()}</span>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: 60, textAlign: "center", borderTop: "1px solid #e2e8f0", paddingTop: 20 }}>
         {pUPI && (
           <p style={{ fontSize: 11, color: "#475569", marginBottom: 8 }}>
             UPI Payments accepted at: <strong style={{ color: "#0f172a" }}>{pUPI}</strong>
           </p>
         )}
         <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>THANK YOU FOR YOUR BUSINESS</p>
         <p style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>This is system generated, no signature needed</p>
      </div>

    </div>
  );
}
