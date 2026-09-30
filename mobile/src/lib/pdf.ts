import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';

/**
 * A4 in PDF points (1pt = 1/72in): matches the web app's `@page { size: A4 }`
 * print rule so agreements/receipts paginate the same way on mobile.
 */
const A4_WIDTH_PT = 595;
const A4_HEIGHT_PT = 842;

/** Hyphen-separates a title for use as a filename: "Freelance Agreement - Studio Name" -> "Freelance-Agreement-Studio-Name". */
const slug = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'Document';

/** Renders an HTML string to a PDF file and opens the OS share sheet so the user can save or send it. */
export async function generateAndSharePdf(html: string, title: string): Promise<void> {
  const fileName = slug(title);
  const pdf = await generatePDF({
    html,
    fileName,
    base64: false,
    width: A4_WIDTH_PT,
    height: A4_HEIGHT_PT,
    padding: 0,
  });

  if (!pdf.filePath) {
    throw new Error('PDF generation failed');
  }

  try {
    await Share.open({
      url: `file://${pdf.filePath}`,
      type: 'application/pdf',
      filename: fileName,
      failOnCancel: false,
    });
  } catch (err: any) {
    // User dismissing the share sheet rejects the promise on some platforms — not a real error.
    if (err?.message && !/user did not share/i.test(err.message)) throw err;
  }
}

/** Escapes text interpolated into the PDF HTML templates so user-entered content can't break the markup. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;',
  );
}

/**
 * Fetches a remote image and returns it as a base64 data URI. The PDF renderer prints before remote
 * <img> sources finish loading, so logos must be embedded. Returns null on any failure.
 */
export async function imageToDataUri(url?: string | null): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('data:')) return url;
  try {
    const blob = await (await fetch(url)).blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/** Copy of the user with `brandLogoUrl` replaced by an embedded data URI (dropped if it can't be fetched). */
export async function withInlinedLogo<T extends { brandLogoUrl?: string | null }>(user: T): Promise<T> {
  const logo = await imageToDataUri(user?.brandLogoUrl);
  return { ...user, brandLogoUrl: logo ?? undefined };
}
