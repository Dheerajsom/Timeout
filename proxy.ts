import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PUBLIC_SITE_ORIGIN } from "@/lib/siteUrl";

const PUBLIC_SITE_HOST = new URL(PUBLIC_SITE_ORIGIN).host;

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? request.nextUrl.host;
  const hostname = host.split(":")[0];

  if (!hostname.endsWith(".vercel.app") || hostname === PUBLIC_SITE_HOST) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, PUBLIC_SITE_ORIGIN);
  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: ["/result/:path*", "/share/:path*"],
};
