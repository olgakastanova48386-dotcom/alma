import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' https://unpkg.com https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://unpkg.com",
      "img-src 'self' data: blob: https://*.openstreetmap.org https://sibaristica.com https://thb.tildacdn.com https://static.tildacdn.com https://spb.restoran.ru https://back.b.devtwin.multikey.studio https://img.restoclub.ru https://www.restoclub.ru https://www.xtremespots.com https://pr6.zoon.ru https://p2.zoon.ru https://maps.climbingpro.ru https://spb.lazertag-portal.ru https://laser-battle.ru https://sportishka.com https://media.kudago.com https://tennis-play.com https://scdn.tomesto.ru https://ovvy.ru https://static.sobaka.ru https://chef.ru https://cdnstatic.rg.ru https://www.atorus.ru https://4traveler.me https://s1.afisha.ru https://nordwest.wheretoeat.ru https://wheretoeat.ru https://banshiki.spb.ru https://s.restorating.ru https://helen-hotel.ru https://static.gorbilet.com https://peterburg2.ru https://phali-hinkali.ru https://img01.rl0.ru https://avatars.mds.yandex.net",
      "font-src 'self' data:",
      "connect-src 'self' https://api.open-meteo.com https://*.openstreetmap.org https://unpkg.com https://cloudflareinsights.com https://router.project-osrm.org",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
