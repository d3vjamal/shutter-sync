import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api.js";

const FALLBACK_IMAGE = "/static/icons/web-app-manifest-512x512.png";

const escapeAttribute = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const replaceMeta = (html, attribute, key, content) => {
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attribute}=["']${key.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}["'][^>]*>`,
    "i",
  );
  const tag = `<meta ${attribute}="${key}" content="${escapeAttribute(content)}" />`;
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n</head>`);
};

const absoluteUrl = (value, origin) => {
  if (!value) return `${origin}${FALLBACK_IMAGE}`;
  try {
    return new URL(value, origin).toString();
  } catch {
    return `${origin}${FALLBACK_IMAGE}`;
  }
};

export const handler = async (event) => {
  const slug = event.queryStringParameters?.slug;
  const protocol = event.headers["x-forwarded-proto"] || "https";
  const host = event.headers["x-forwarded-host"] || event.headers.host;
  const origin = `${protocol}://${host}`;

  const indexResponse = await fetch(`${origin}/index.html`);
  let html = await indexResponse.text();

  if (!slug) {
    return { statusCode: 200, headers: { "Content-Type": "text/html; charset=utf-8" }, body: html };
  }

  try {
    const convexUrl = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;
    if (!convexUrl) throw new Error("Missing CONVEX_URL or VITE_CONVEX_URL");

    const client = new ConvexHttpClient(convexUrl);
    const photographer = await client.query(api.photographers.getBySlug, { slug });
    if (!photographer) {
      return { statusCode: 404, headers: { "Content-Type": "text/html; charset=utf-8" }, body: html };
    }

    const profileUrl = `${origin}/photographer/${encodeURIComponent(slug)}`;
    const title = `${photographer.name} | Professional Photographer | ShutterSync`;
    const description = photographer.bio
      || `Explore ${photographer.name}'s photography portfolio, service packages, and contact details on ShutterSync.`;
    const image = absoluteUrl(
      photographer.coverImageUrl || photographer.photos?.[0] || photographer.avatarUrl,
      origin,
    );
    const imageAlt = `${photographer.name}'s photography portfolio`;

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(title)}</title>`);
    html = html.replace(
      /<link\s+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${escapeAttribute(profileUrl)}" />`,
    );

    const tags = [
      ["name", "description", description],
      ["property", "og:type", "profile"],
      ["property", "og:url", profileUrl],
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:image", image],
      ["property", "og:image:secure_url", image],
      ["property", "og:image:alt", imageAlt],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
      ["name", "twitter:image", image],
      ["name", "twitter:image:alt", imageAlt],
    ];
    for (const [attribute, key, content] of tags) {
      html = replaceMeta(html, attribute, key, content);
    }
    html = html.replace(/<meta\s+[^>]*property=["']og:image:(?:type|width|height)["'][^>]*>\s*/gi, "");

    const structuredData = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: photographer.name,
      description,
      url: profileUrl,
      image: [image, ...(photographer.photos || []).slice(0, 5)],
      telephone: photographer.contact || undefined,
      sameAs: [photographer.instagram, photographer.facebook, photographer.twitter]
        .filter(Boolean),
    }).replaceAll("<", "\\u003c");
    html = html.replace(
      "</head>",
      `    <script type="application/ld+json" id="photographer-structured-data">${structuredData}</script>\n</head>`,
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
      },
      body: html,
    };
  } catch (error) {
    console.error("Profile metadata rendering failed", error);
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: html,
    };
  }
};
