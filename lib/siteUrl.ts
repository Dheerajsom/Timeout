export const PUBLIC_SITE_ORIGIN = "https://timeout-wheat.vercel.app";

export function getSiteOrigin() {
  const rawOrigin =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    (process.env.NODE_ENV === "development" ? "" : PUBLIC_SITE_ORIGIN) ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";

  const withProtocol = /^https?:\/\//.test(rawOrigin) ? rawOrigin : `https://${rawOrigin}`;
  return withProtocol.replace(/\/+$/, "");
}
