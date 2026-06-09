export function getSiteOrigin() {
  const rawOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";

  const withProtocol = /^https?:\/\//.test(rawOrigin) ? rawOrigin : `https://${rawOrigin}`;
  return withProtocol.replace(/\/+$/, "");
}
