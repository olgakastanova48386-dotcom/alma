"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  phone: string;
};

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[20px] w-[20px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[20px] w-[20px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[23px] w-[23px]">
      <mask id="alma-nav-paw-heart">
        <rect width="24" height="24" fill="white" />
        <ellipse cx="8.1" cy="10.25" rx="1.15" ry="1.7" transform="rotate(-18 8.1 10.25)" fill="black" />
        <ellipse cx="10.65" cy="8.3" rx="1.15" ry="1.7" fill="black" />
        <ellipse cx="13.35" cy="8.3" rx="1.15" ry="1.7" fill="black" />
        <ellipse cx="15.9" cy="10.25" rx="1.15" ry="1.7" transform="rotate(18 15.9 10.25)" fill="black" />
        <path d="M12 11.25c-2.1 0-3.6 1.65-4.05 3.5-.3 1.2.1 2.55 1.1 2.9.75.26 1.35-.06 2.05-.38.42-.2.65-.27.9-.27s.48.07.9.27c.7.32 1.3.64 2.05.38 1-.35 1.4-1.7 1.1-2.9-.45-1.85-1.95-3.5-4.05-3.5Z" fill="black" />
      </mask>
      <path d="M12 21.2 3.5 13.2C.3 10.1 1.2 5.05 4.8 3.65 7.4 2.65 10.05 3.8 12 6.1c1.95-2.3 4.6-3.45 7.2-2.45 3.6 1.4 4.5 6.45 1.3 9.55L12 21.2Z" fill="currentColor" mask="url(#alma-nav-paw-heart)" />
    </svg>
  );
}

function EventsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[20px] w-[20px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
      <path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" />
      <path d="m12 13 .7 1.45 1.6.23-1.15 1.12.27 1.58L12 16.63l-1.42.75.27-1.58-1.15-1.12 1.6-.23L12 13Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[21px] w-[21px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.8l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.4 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
    </svg>
  );
}

function isCurrentRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const authScreen =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/verify-phone");

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (active) {
          setUser(data.user || null);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setAuthLoaded(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="absolute top-0 left-0 z-[9999] w-full md:fixed">
      <div className="max-w-7xl mx-auto mt-[calc(env(safe-area-inset-top)+10px)] md:mt-4 px-2.5 md:px-6">
        <div className="px-3 py-1.5 md:rounded-full md:border md:border-black/5 md:bg-white/92 md:px-8 md:py-3 md:shadow-lg md:backdrop-blur-xl">

          {/* Mobile: only the logo stays above the page. */}
          <div className="flex h-11 items-center md:hidden">
            <Link href="/" aria-label="ALMA — главная" className={`pl-1 text-[18px] font-bold tracking-[0.2em] ${pathname === "/" ? "text-white drop-shadow-[0_1px_5px_rgba(0,0,0,.7)]" : "text-black"}`}>alma</Link>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center justify-between">

            <Link
              href="/"
              className="text-lg sm:text-2xl font-bold tracking-[0.28em]"
            >
              alma
            </Link>

            <nav className="flex items-center gap-5 lg:gap-7 text-sm md:text-base text-gray-600">

              <Link href="/" className="hover:text-black">
                Главная
              </Link>

              <Link href="/map" className="hover:text-black">
                События
              </Link>

              <Link href="/dog-friendly" className="hover:text-black">
                🐾 С собакой
              </Link>

              <Link href="/favorites" className="hover:text-black">
                ♡ Избранное
              </Link>

              <Link href="/about" className="hover:text-black">
                О проекте
              </Link>

            </nav>


            {authLoaded && user ? (
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5"
              >
                <ProfileIcon />
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-black text-white px-5 py-2.5"
              >
                Войти
              </Link>
            )}

          </div>

        </div>
      </div>
          {!authScreen && <nav aria-label="Основная навигация" className="fixed inset-x-3 bottom-[calc(10px+env(safe-area-inset-bottom))] z-[10000] mx-auto grid max-w-[480px] grid-cols-5 rounded-[24px] border border-black/10 bg-white/95 px-1.5 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,.16)] backdrop-blur-xl md:hidden">
            {[
              { href: "/", label: "Главная", icon: <HomeIcon /> },
              { href: "/map", label: "События", icon: <EventsIcon /> },
              { href: "/dog-friendly", label: "С собакой", icon: <PawIcon /> },
              { href: "/favorites", label: "Избранное", icon: <HeartIcon /> },
              { href: user ? "/profile" : "/login", label: "Профиль", icon: <ProfileIcon /> },
            ].map(({ href, label, icon }) => {
              const active = isCurrentRoute(pathname, href);
              return <Link key={label} href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[11px] font-medium leading-none ${active ? "bg-[#f3e9e6] text-black" : "text-neutral-600"}`}>
                {icon}<span className="truncate">{label}</span>
              </Link>;
            })}
          </nav>}

    </header>
  );
}