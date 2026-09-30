import { format } from 'date-fns';

import { BRAND_MARK_DATA_URI } from '@/lib/brand-mark-base64';
import { escapeHtml } from '@/lib/pdf';
import type { RevenueItem } from '@/lib/revenue';
import type { Doc } from '@convex/_generated/dataModel';

type Photographer = Doc<'users'> | null | undefined;

const fmtDate = (d?: string) => {
  if (!d) return '';
  try {
    return format(new Date(d), 'dd MMM yyyy');
  } catch {
    return d;
  }
};

const rupees = (n: number) => `Rs. ${Math.round(n).toLocaleString('en-IN')}`;

/** Shared page shell: mirrors the web PDFs' Lato-ish look with a light, print-safe palette. */
function shell(title: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body {
    font-family: Helvetica, Arial, sans-serif;
    color: #1e293b;
    font-size: 10px;
    line-height: 1.5;
  }
  .page { position: relative; max-width: 720px; margin: 0 auto; padding: 16px 20px; overflow: hidden; }
  .content { position: relative; z-index: 1; }
  .watermark {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; overflow: hidden; z-index: 0;
  }
  .watermark .grid {
    display: grid; grid-template-columns: repeat(3, 80px); gap: 60px 80px;
    transform: rotate(-35deg); opacity: 0.08;
  }
  .watermark .grid img { width: 72px; height: 72px; object-fit: contain; }
  .header-logo { width: 44px; height: 44px; object-fit: contain; flex-shrink: 0; }
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 14px; margin-bottom: 18px; border-bottom: 2px solid #1a56db;
  }
  .header .title { flex: 1; text-align: center; }
  .header .title .main {
    font-size: 16px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #1a56db;
  }
  .header .title .meta { font-size: 8px; color: #94a3b8; margin-top: 4px; }
  .section { margin-bottom: 16px; }
  .section-label {
    font-size: 8px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;
    color: #475569; border-left: 3px solid #1a56db; padding-left: 7px; margin-bottom: 9px;
  }
  .doc-title { font-size: 19px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
  .doc-subtitle { font-size: 9.5px; color: #64748b; }
  .parties { display: flex; gap: 10px; }
  .party-box { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
  .party-box .label {
    background: #f1f5f9; padding: 5px 12px; border-bottom: 1px solid #e2e8f0;
    font-size: 7.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b;
  }
  .party-box .body { padding: 10px 12px; }
  .party-box .name { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
  .party-box .sub { font-size: 8.5px; color: #1a56db; font-weight: 600; margin-bottom: 2px; }
  .party-box .contact { font-size: 9px; color: #475569; }
  .party-box .extra { font-size: 8.5px; color: #64748b; margin-top: 1px; }
  .table-box { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
  .table-row {
    display: flex; align-items: center; padding: 6px 12px; border-bottom: 1px solid #f1f5f9;
  }
  .table-row:nth-child(even) { background: #f8fafc; }
  .table-row:last-child { border-bottom: none; }
  .table-row .k { font-size: 8.5px; color: #64748b; font-weight: 600; width: 90px; flex-shrink: 0; }
  .table-row .v { font-size: 8.5px; color: #1e293b; }
  .amounts { display: flex; gap: 8px; margin-bottom: 9px; }
  .amount-box { flex: 1; text-align: center; padding: 9px 8px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; }
  .amount-box.highlight { background: #1a56db; border: none; }
  .amount-box .label { font-size: 7.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 5px; }
  .amount-box.highlight .label { color: rgba(255,255,255,0.75); }
  .amount-box .value { font-size: 15px; font-weight: 800; color: #0f172a; }
  .amount-box.highlight .value { color: #fff; }
  .list-grid { display: flex; flex-wrap: wrap; }
  .list-item { width: 50%; font-size: 9px; color: #334155; padding: 3px 12px 3px 0; border-bottom: 1px solid #f1f5f9; }
  .list-item .n { font-size: 8px; font-weight: 800; color: #1a56db; margin-right: 5px; }
  .terms { display: flex; flex-direction: column; gap: 5px; }
  .term-item { font-size: 9px; color: #334155; padding-left: 10px; border-left: 2px solid #e2e8f0; }
  .term-item .n { color: #1a56db; font-weight: 800; margin-right: 6px; }
  .tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
  .tag { font-size: 8.5px; font-weight: 700; border-radius: 99px; padding: 3px 10px; }
  .tag.green { color: #10b981; background: #f0fdf4; border: 1px solid #bbf7d0; }
  .tag.blue { color: #1a56db; background: #eff6ff; border: 1px solid #bfdbfe; }
  .ack { display: flex; gap: 16px; margin-top: 10px; }
  .ack-box { flex: 1; border-top: 1.5px dashed #cbd5e1; padding-top: 8px; margin-top: 24px; }
  .ack-box .name { font-size: 9.5px; font-weight: 700; color: #0f172a; }
  .ack-box .role { font-size: 8px; color: #64748b; }
  .ack-box .contact { font-size: 8px; color: #94a3b8; margin-top: 1px; }
  .footer {
    margin-top: 18px; padding-top: 10px; border-top: 1px solid #e2e8f0;
    display: flex; justify-content: space-between; font-size: 7.5px; color: #94a3b8;
  }
  table.receipt { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  table.receipt th { padding: 8px 0; font-size: 9px; font-weight: 800; text-transform: uppercase; color: #0f172a; text-align: left; border-bottom: 2px solid #0f172a; }
  table.receipt th.amt { text-align: right; }
  table.receipt td { padding: 10px 0; font-size: 11px; border-bottom: 1px solid #f1f5f9; color: #475569; }
  table.receipt td.amt { text-align: right; }
  .totals { width: 60%; margin-left: auto; margin-top: 16px; }
  .totals .row { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: #475569; padding: 4px 0; }
  .totals .grand { display: flex; justify-content: space-between; font-size: 14px; font-weight: 800; color: #0f172a; padding-top: 10px; margin-top: 6px; border-top: 2px solid #e2e8f0; }
  .receipt-highlight {
    display: flex; justify-content: space-between; align-items: center; padding: 14px 0;
    border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; margin-bottom: 24px;
  }
  .receipt-highlight .label { font-size: 16px; font-weight: 800; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px; }
  .receipt-highlight .value { font-size: 20px; font-weight: 900; color: #16a34a; }
</style>
</head>
<body>${body}</body>
</html>`;
}

/** Tiled, low-opacity ShutterSync mark behind the page content — matches the web PDFs' watermark. */
function watermarkHtml() {
  const tile = `<img src="${BRAND_MARK_DATA_URI}" />`;
  return `<div class="watermark"><div class="grid">${tile.repeat(9)}</div></div>`;
}

function pdfHeader(mainTitle: string, refId: string, today: string, photographer?: Photographer) {
  const brandLogo = photographer?.brandLogoUrl
    ? `<img src="${photographer.brandLogoUrl}" class="header-logo" style="border-radius:6px;border:1px solid #e2e8f0;background:#f8fafc;padding:4px" />`
    : `<div style="width:44px"></div>`;
  return `<div class="header">
  ${brandLogo}
  <div class="title">
    <div class="main">${escapeHtml(mainTitle)}</div>
    <div class="meta">${escapeHtml(refId)} &middot; ${escapeHtml(today)}</div>
  </div>
  <img src="${BRAND_MARK_DATA_URI}" class="header-logo" />
</div>`;
}

function pdfFooter(photographer: Photographer, refId: string) {
  const name = photographer?.name ? ` &middot; ${escapeHtml(photographer.name)}` : '';
  return `<div class="footer">
  <span>Generated on ShutterSync${name}</span>
  <span style="font-style:italic;color:#b0bec5">Computer-generated &middot; No signature required</span>
  <span>Ref: ${escapeHtml(refId)}</span>
</div>`;
}

function termsSection(conditions: string[]) {
  if (!conditions.length) return '';
  return `<div class="section">
  <div class="section-label">Terms &amp; Conditions</div>
  <div class="terms">
    ${conditions
      .map((c, i) => `<div class="term-item"><span class="n">${i + 1}.</span>${escapeHtml(c)}</div>`)
      .join('')}
  </div>
</div>`;
}

// ─── Assignment (work) agreement ───────────────────────────────────────────

export function buildAgreementHtml(assignment: Doc<'assignments'>, photographer: Photographer) {
  const total = Number(assignment.amount || 0);
  const paid = Number(assignment.paidAmount || 0);
  const pending = Math.max(0, total - paid);

  const refId = `#${String(assignment._id || '').slice(-7).toUpperCase()}`;
  const today = format(new Date(), 'dd MMMM yyyy');

  const dates = assignment.photographerDays?.length
    ? assignment.photographerDays.map(fmtDate)
    : assignment.eventStartDate
      ? [fmtDate(assignment.eventStartDate)]
      : [];
  const dateDisplay = dates.length ? dates.join('  &middot;  ') : 'TBD';

  const eventRows = [
    { k: 'Date(s)', v: dateDisplay },
    {
      k: 'Duration',
      v: assignment.eventDuration ? `${assignment.eventDuration} Day${assignment.eventDuration !== 1 ? 's' : ''}` : '',
    },
    { k: 'Venue', v: assignment.venue },
    { k: 'Location', v: assignment.location },
  ].filter((r) => r.v);

  const services = assignment.services || [];
  const conditions = assignment.conditions || [];

  const body = `<div class="page">
  ${watermarkHtml()}
  <div class="content">
  ${pdfHeader('Service Agreement', refId, today, photographer)}

  <div class="section">
    <div class="doc-title">${escapeHtml(assignment.title || 'Photography Services')}</div>
    ${assignment.description ? `<div class="doc-subtitle">${escapeHtml(assignment.description)}</div>` : ''}
  </div>

  <div class="section">
    <div class="section-label">Parties Involved</div>
    <div class="parties">
      <div class="party-box">
        <div class="label">Photographer</div>
        <div class="body">
          <div class="name">${escapeHtml(photographer?.name || '—')}</div>
          ${photographer?.contact || photographer?.email ? `<div class="contact">${escapeHtml(photographer?.contact || photographer?.email)}</div>` : ''}
          ${photographer?.upiId ? `<div class="extra"><b>UPI:</b> ${escapeHtml(photographer.upiId)}</div>` : ''}
        </div>
      </div>
      <div class="party-box">
        <div class="label">Client</div>
        <div class="body">
          <div class="name">${escapeHtml(assignment.clientName || '—')}</div>
          ${assignment.clientContact ? `<div class="contact">${escapeHtml(assignment.clientContact)}</div>` : ''}
        </div>
      </div>
    </div>
  </div>

  ${
    eventRows.length
      ? `<div class="section">
    <div class="section-label">Event Details</div>
    <div class="table-box">
      ${eventRows.map((r) => `<div class="table-row"><span class="k">${escapeHtml(r.k)}</span><span class="v">${escapeHtml(r.v)}</span></div>`).join('')}
    </div>
  </div>`
      : ''
  }

  <div class="section">
    <div class="section-label">Payment Summary</div>
    <div class="amounts">
      <div class="amount-box"><div class="label">Total Amount</div><div class="value">${rupees(total)}</div></div>
      <div class="amount-box highlight"><div class="label">Amount Paid</div><div class="value">${rupees(paid)}</div></div>
      <div class="amount-box"><div class="label">Balance Due</div><div class="value">${rupees(pending)}</div></div>
    </div>
  </div>

  ${
    services.length
      ? `<div class="section">
    <div class="section-label">Deliverables &amp; Inclusions</div>
    <div class="list-grid">
      ${services.map((s, i) => `<div class="list-item"><span class="n">${String(i + 1).padStart(2, '0')}.</span>${escapeHtml(s)}</div>`).join('')}
    </div>
  </div>`
      : ''
  }

  ${termsSection(conditions)}

  <div class="section">
    <div class="section-label">Acknowledgement</div>
    <div class="ack">
      <div class="ack-box">
        <div class="name">${escapeHtml(photographer?.name || 'Photographer')}</div>
        <div class="role">Photographer</div>
        ${photographer?.contact ? `<div class="contact">${escapeHtml(photographer.contact)}</div>` : ''}
      </div>
      <div class="ack-box">
        <div class="name">${escapeHtml(assignment.clientName || 'Client')}</div>
        <div class="role">Client</div>
        ${assignment.clientContact ? `<div class="contact">${escapeHtml(assignment.clientContact)}</div>` : ''}
      </div>
    </div>
  </div>

  ${pdfFooter(photographer, refId)}
  </div>
</div>`;

  return shell('Service Agreement', body);
}

// ─── Freelance agreement ───────────────────────────────────────────────────

export function buildFreelanceAgreementHtml(job: Doc<'freelanceAssignments'>, photographer: Photographer) {
  const refId = `#FL-${String(job._id || '').slice(-6).toUpperCase()}`;
  const today = format(new Date(), 'dd MMMM yyyy');

  const fmtJobDate = (d: string) => {
    try {
      return format(new Date(d + 'T00:00:00'), 'dd MMM yyyy');
    } catch {
      return d;
    }
  };
  const dates = (job.dates || []).map(fmtJobDate);
  const dateDisplay = dates.length ? dates.join('  &middot;  ') : 'TBD';

  const photoTotal = Number(job.photographyAmount || 0);
  const photoReceived = Number(job.photographyReceived || 0);
  const photoDue = Math.max(0, photoTotal - photoReceived);
  const videoTotal = Number(job.videographyAmount || 0);
  const videoReceived = Number(job.videographyReceived || 0);
  const videoDue = Math.max(0, videoTotal - videoReceived);

  const workRows = [
    { k: 'Date(s)', v: dateDisplay },
    { k: 'Duration', v: dates.length ? `${dates.length} Day${dates.length !== 1 ? 's' : ''}` : '' },
    { k: 'Venue', v: job.venue },
    { k: 'Location', v: job.location },
  ].filter((r) => r.v);

  const gadgets = job.gadgets || [];
  const conditions = job.conditions || [];

  const partyBox = (label: string, name?: string, subtitle?: string, contact?: string, extra: (string | undefined)[] = []) => `
    <div class="party-box">
      <div class="label">${escapeHtml(label)}</div>
      <div class="body">
        <div class="name">${escapeHtml(name || '—')}</div>
        ${subtitle ? `<div class="sub">${escapeHtml(subtitle)}</div>` : ''}
        ${contact ? `<div class="contact">${escapeHtml(contact)}</div>` : ''}
        ${extra.filter(Boolean).map((e) => `<div class="extra">${escapeHtml(e)}</div>`).join('')}
      </div>
    </div>`;

  const body = `<div class="page">
  ${watermarkHtml()}
  <div class="content">
  ${pdfHeader('Freelance Agreement', refId, today, photographer)}

  <div class="section">
    <div class="doc-title">${escapeHtml(job.studioName)}</div>
    <div style="font-size:11px;color:#1a56db;font-weight:700;margin-top:3px">Freelance Assignment</div>
    ${[job.venue, job.location].filter(Boolean).length ? `<div class="doc-subtitle" style="margin-top:4px">${escapeHtml([job.venue, job.location].filter(Boolean).join(' · '))}</div>` : ''}
  </div>

  <div class="section">
    <div class="section-label">Parties Involved</div>
    <div class="parties">
      ${partyBox('Studio', job.studioOwnerName, job.studioName, job.studioMobile, [job.studioEmail, job.studioArea])}
      ${partyBox('Photographer', job.photographerName, undefined, job.photographerMobile, [job.photographerEmail])}
      ${job.hasVideography && job.videographerName ? partyBox('Videographer', job.videographerName, undefined, job.videographerMobile, [job.videographerEmail]) : ''}
    </div>
  </div>

  ${
    workRows.length
      ? `<div class="section">
    <div class="section-label">Work Details</div>
    <div class="table-box">
      ${workRows.map((r) => `<div class="table-row"><span class="k">${escapeHtml(r.k)}</span><span class="v">${escapeHtml(r.v)}</span></div>`).join('')}
    </div>
  </div>`
      : ''
  }

  ${
    gadgets.length
      ? `<div class="section">
    <div class="section-label">Gadgets &amp; Equipment</div>
    <div class="list-grid">
      ${gadgets.map((g, i) => `<div class="list-item"><span class="n">${String(i + 1).padStart(2, '0')}.</span>${escapeHtml(g)}</div>`).join('')}
    </div>
  </div>`
      : ''
  }

  ${
    photoTotal > 0 || (job.photographyFootageTypes || []).length
      ? `<div class="section">
    <div class="section-label">Photography</div>
    ${
      (job.photographyFootageTypes || []).length
        ? `<div class="tags">${job.photographyFootageTypes!.map((t) => `<span class="tag green">${escapeHtml(t)}</span>`).join('')}</div>`
        : ''
    }
    ${
      photoTotal > 0
        ? `<div class="amounts">
      <div class="amount-box"><div class="label">Total</div><div class="value">${rupees(photoTotal)}</div></div>
      <div class="amount-box highlight"><div class="label">Received</div><div class="value">${rupees(photoReceived)}</div></div>
      <div class="amount-box"><div class="label">Due</div><div class="value">${rupees(photoDue)}</div></div>
    </div>`
        : ''
    }
  </div>`
      : ''
  }

  ${
    job.hasVideography && (videoTotal > 0 || (job.videographyFootageTypes || []).length)
      ? `<div class="section">
    <div class="section-label">Videography</div>
    ${
      (job.videographyFootageTypes || []).length
        ? `<div class="tags">${job.videographyFootageTypes!.map((t) => `<span class="tag blue">${escapeHtml(t)}</span>`).join('')}</div>`
        : ''
    }
    ${
      videoTotal > 0
        ? `<div class="amounts">
      <div class="amount-box"><div class="label">Total</div><div class="value">${rupees(videoTotal)}</div></div>
      <div class="amount-box highlight"><div class="label">Received</div><div class="value">${rupees(videoReceived)}</div></div>
      <div class="amount-box"><div class="label">Due</div><div class="value">${rupees(videoDue)}</div></div>
    </div>`
        : ''
    }
  </div>`
      : ''
  }

  ${termsSection(conditions)}

  <div class="section">
    <div class="section-label">Acknowledgement</div>
    <div class="ack">
      <div class="ack-box">
        <div class="name">${escapeHtml(job.studioOwnerName || 'Studio Owner')}</div>
        <div class="role">Studio Owner</div>
        ${job.studioMobile ? `<div class="contact">${escapeHtml(job.studioMobile)}</div>` : ''}
      </div>
      <div class="ack-box">
        <div class="name">${escapeHtml(job.photographerName || 'Photographer')}</div>
        <div class="role">Photographer</div>
        ${job.photographerMobile ? `<div class="contact">${escapeHtml(job.photographerMobile)}</div>` : ''}
      </div>
    </div>
  </div>

  ${pdfFooter(photographer, refId)}
  </div>
</div>`;

  return shell('Freelance Agreement', body);
}

// ─── Payment receipt ────────────────────────────────────────────────────────

export function buildReceiptHtml(opts: {
  payments: Doc<'payments'>[];
  title: string;
  clientName?: string;
  totalAmount: number;
  totalPaid: number;
  balance: number;
  photographer: Photographer;
}) {
  const { payments, title, clientName, totalAmount, totalPaid, balance, photographer } = opts;
  const today = format(new Date(), 'dd/MM/yyyy');
  const receiptId = `REC-${Math.floor(Math.random() * 90000) + 10000}`;
  const sorted = [...payments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const logoSrc = photographer?.brandLogoUrl || BRAND_MARK_DATA_URI;

  const body = `<div class="page" style="max-width:650px;padding:32px 40px">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #e2e8f0">
    <div>
      <img src="${logoSrc}" style="height:48px;object-fit:contain;margin-bottom:10px;display:block" />
      <div style="font-size:22px;font-weight:800;color:#0f172a;margin-bottom:6px">${escapeHtml(photographer?.name || 'Photographer')}</div>
      <div style="font-size:11px;color:#475569;line-height:1.6">
        ${photographer?.contact ? `${escapeHtml(photographer.contact)}<br/>` : ''}
        ${escapeHtml(photographer?.email || '')}
      </div>
    </div>
    <div style="font-size:24px;font-weight:900;color:#e2e8f0;text-transform:uppercase;letter-spacing:2px">Receipt</div>
  </div>

  <div style="display:flex;justify-content:space-between;margin-bottom:28px">
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;color:#0f172a;margin-bottom:6px">Bill To</div>
      <div style="font-size:12px;color:#475569;line-height:1.5">
        ${clientName ? `<b style="color:#0f172a">${escapeHtml(clientName)}</b><br/>` : ''}
        ${escapeHtml(title)}
      </div>
    </div>
    <div style="text-align:right">
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;color:#0f172a">Receipt #  <span style="font-weight:400;color:#475569">${receiptId}</span></div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;color:#0f172a;margin-top:6px">Date  <span style="font-weight:400;color:#475569">${today}</span></div>
    </div>
  </div>

  <div class="receipt-highlight">
    <div class="label">Receipt Total</div>
    <div class="value">${rupees(totalPaid)}</div>
  </div>

  <table class="receipt">
    <thead><tr><th>Date</th><th>Description</th><th class="amt">Amount</th></tr></thead>
    <tbody>
      ${sorted
        .map(
          (p) => `<tr>
        <td>${fmtDate(p.date)}</td>
        <td>${escapeHtml(p.note || 'Payment Installment')}</td>
        <td class="amt">${rupees(Number(p.amount))}</td>
      </tr>`,
        )
        .join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="row"><span>Service Total</span><span>${rupees(totalAmount)}</span></div>
    <div class="row"><span>Amount Paid</span><span>- ${rupees(totalPaid)}</span></div>
    <div class="grand"><span>Balance Due</span><span>${rupees(balance)}</span></div>
  </div>

  <div style="margin-top:50px;text-align:center;border-top:1px solid #e2e8f0;padding-top:18px">
    ${photographer?.upiId ? `<div style="font-size:11px;color:#475569;margin-bottom:8px">UPI Payments accepted at: <b style="color:#0f172a">${escapeHtml(photographer.upiId)}</b></div>` : ''}
    <div style="font-size:13px;font-weight:700;color:#0f172a">THANK YOU FOR YOUR BUSINESS</div>
    <div style="font-size:10px;color:#64748b;margin-top:4px">This is system generated, no signature needed</div>
  </div>
</div>`;

  return shell('Payment Receipt', body);
}

// ─── Revenue report ─────────────────────────────────────────────────────────

export function buildRevenueReportHtml(items: RevenueItem[], photographer: Photographer) {
  const today = format(new Date(), 'dd MMMM yyyy');
  const collected = items.reduce((sum, i) => sum + i.paid, 0);
  const pending = items.reduce((sum, i) => sum + Math.max(0, i.total - i.paid), 0);

  const body = `<div class="page">
  ${watermarkHtml()}
  <div class="content">
  ${pdfHeader('Revenue Report', photographer?.name || 'ShutterSync', today, photographer)}

  <div class="section">
    <div class="amounts">
      <div class="amount-box highlight"><div class="label">Collected</div><div class="value">${rupees(collected)}</div></div>
      <div class="amount-box"><div class="label">Pending</div><div class="value">${rupees(pending)}</div></div>
      <div class="amount-box"><div class="label">Bookings</div><div class="value">${items.length}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-label">All Bookings</div>
    <table class="receipt">
      <thead><tr><th>Client</th><th>Type</th><th>Date</th><th class="amt">Collected</th><th class="amt">Pending</th></tr></thead>
      <tbody>
        ${items
          .map(
            (i) => `<tr>
          <td>${escapeHtml(i.title)}</td>
          <td>${i.source === 'assignment' ? 'Assignment' : 'Freelance'}</td>
          <td>${i.date ? fmtDate(i.date) : 'TBD'}</td>
          <td class="amt">${rupees(i.paid)}</td>
          <td class="amt">${rupees(Math.max(0, i.total - i.paid))}</td>
        </tr>`,
          )
          .join('')}
      </tbody>
    </table>
  </div>

  ${pdfFooter(photographer, 'REVENUE')}
  </div>
</div>`;

  return shell('Revenue Report', body);
}
