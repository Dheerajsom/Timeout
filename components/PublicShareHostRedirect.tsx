"use client";

import { useEffect } from "react";
import { PUBLIC_SITE_ORIGIN } from "@/lib/siteUrl";

const PUBLIC_SITE_HOST = new URL(PUBLIC_SITE_ORIGIN).host;

export function PublicShareHostRedirect() {
  useEffect(() => {
    const { hash, hostname, pathname, search } = window.location;

    if (!isShareablePath(pathname) || !isVercelNonPublicHost(hostname)) {
      return;
    }

    window.location.replace(`${PUBLIC_SITE_ORIGIN}${pathname}${search}${hash}`);
  }, []);

  return null;
}

function isShareablePath(pathname: string) {
  return pathname.startsWith("/result/") || pathname.startsWith("/share/");
}

function isVercelNonPublicHost(hostname: string) {
  return hostname.endsWith(".vercel.app") && hostname !== PUBLIC_SITE_HOST;
}
