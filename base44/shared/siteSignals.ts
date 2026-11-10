export type SiteSignals = {
  url: string;
  status: number;
  title: string;
  metaDescription: string;
  headings: string[];
  headingCount: number;
  wordCount: number;
  hasViewport: boolean;
  hasCanonical: boolean;
  hasOpenGraph: boolean;
  hasJsonLd: boolean;
  hasForm: boolean;
  hasPhoneLink: boolean;
  hasEmailLink: boolean;
  hasBookingWords: boolean;
  imageCount: number;
  imagesMissingAlt: number;
  internalLinks: number;
  externalLinks: number;
  textSample: string;
};

const BLOCKED_HOSTS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^0\./,
  /^\[?::1\]?$/,
  /\.local$/i,
  /\.internal$/i,
];

export function normalizeUrl(raw: string): string | null {
  if (!raw) return null;
  let value = String(raw).trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!parsed.hostname.includes(".")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function assertPublicUrl(raw: string): string {
  const normalized = normalizeUrl(raw);
  if (!normalized) throw new Error("Enter a full website address, for example yourbusiness.com");
  const host = new URL(normalized).hostname.toLowerCase();
  if (BLOCKED_HOSTS.some((pattern) => pattern.test(host))) {
    throw new Error("That address is not a public website.");
  }
  return normalized;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function matchOne(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  return match && match[1] ? match[1].replace(/\s+/g, " ").trim().slice(0, 300) : "";
}

export async function fetchSignals(rawUrl: string): Promise<SiteSignals> {
  const url = assertPublicUrl(rawUrl);
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
    headers: { "user-agent": "DemoreWebsiteReview/1.0 (+https://www.demoretechnologysolutions.com)" },
  });
  const html = (await response.text()).slice(0, 400000);
  const text = stripHtml(html);
  const origin = new URL(response.url || url).origin;
  const headings = Array.from(html.matchAll(/<h([12])[^>]*>([\s\S]*?)<\/h\1>/gi))
    .map((m) => stripHtml(m[2]).slice(0, 160))
    .filter(Boolean)
    .slice(0, 12);
  const images = html.match(/<img\b/gi) || [];
  const altless = html.match(/<img\b(?![^>]*\balt=)[^>]*>/gi) || [];
  const links = Array.from(html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)).map((m) => m[1]);

  return {
    url: response.url || url,
    status: response.status,
    title: matchOne(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    metaDescription: matchOne(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i),
    headings,
    headingCount: (html.match(/<h[1-6][\s>]/gi) || []).length,
    wordCount: text ? text.split(" ").length : 0,
    hasViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    hasCanonical: /<link[^>]+rel=["']canonical["']/i.test(html),
    hasOpenGraph: /property=["']og:/i.test(html),
    hasJsonLd: /application\/ld\+json/i.test(html),
    hasForm: /<form[\s>]/i.test(html),
    hasPhoneLink: /href=["']tel:/i.test(html),
    hasEmailLink: /href=["']mailto:/i.test(html),
    hasBookingWords: /(book (now|a|an)|schedule|request a quote|get a quote|estimate|call today|add to cart|checkout)/i.test(text),
    imageCount: images.length,
    imagesMissingAlt: altless.length,
    internalLinks: links.filter((href) => href.startsWith("/") || href.startsWith(origin)).length,
    externalLinks: links.filter((href) => href.startsWith("http") && !href.startsWith(origin)).length,
    textSample: text.slice(0, 3500),
  };
}

export function signalsToText(signals: SiteSignals): string {
  const lines = [
    `URL reviewed: ${signals.url}`,
    `HTTP status: ${signals.status}`,
    `Page title: ${signals.title || "(none found)"}`,
    `Meta description: ${signals.metaDescription || "(none found)"}`,
    `Main headings: ${signals.headings.length ? signals.headings.join(" | ") : "(none found)"}`,
    `Total headings: ${signals.headingCount}`,
    `Visible word count: ${signals.wordCount}`,
    `Mobile viewport tag: ${signals.hasViewport ? "present" : "missing"}`,
    `Canonical tag: ${signals.hasCanonical ? "present" : "missing"}`,
    `Open Graph tags: ${signals.hasOpenGraph ? "present" : "missing"}`,
    `Structured data (JSON-LD): ${signals.hasJsonLd ? "present" : "missing"}`,
    `On-page form: ${signals.hasForm ? "present" : "missing"}`,
    `Click-to-call link: ${signals.hasPhoneLink ? "present" : "missing"}`,
    `Email link: ${signals.hasEmailLink ? "present" : "missing"}`,
    `Conversion action words: ${signals.hasBookingWords ? "present" : "not detected"}`,
    `Images: ${signals.imageCount} total, ${signals.imagesMissingAlt} without alt text`,
    `Links: ${signals.internalLinks} internal, ${signals.externalLinks} external`,
    "",
    "Visible page text (excerpt):",
    signals.textSample,
  ];
  return lines.join("\n");
}