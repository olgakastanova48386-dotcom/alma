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
    <header className="fixed top-0 left-0 w-full z-[9999]">
      <div className="max-w-7xl mx-auto mt-2.5 sm:mt-4 px-2.5 sm:px-6">
        <div className="rounded-[20px] sm:rounded-full bg-white/92 backdrop-blur-xl border border-black/5 shadow-lg px-3 sm:px-8 py-2 sm:py-3">

          {/* MOBILE */}
          <div className="md:hidden flex h-10 items-center">

            <Link
              href="/"
              className="shrink-0 pl-1 text-[15px] font-bold tracking-[0.19em]"
            >
              alma
            </Link>

            {!authScreen && (
              <div className="ml-auto flex items-center gap-2">

                {!isCurrentRoute(pathname, "/") && (
                  <Link
                    href="/"
                    aria-label="Главная"
                    title="Главная"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[.04]"
                  >
                    <HomeIcon />
                  </Link>
                )}

                {!isCurrentRoute(pathname, "/map") && (
                  <Link
                    href="/map"
                    aria-label="Карта"
                    title="Карта"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[.04]"
                  >
                    <MapIcon />
                  </Link>
                )}

                {!isCurrentRoute(pathname, "/favorites") && (
                  <Link
                    href="/favorites"
                    aria-label="Избранное"
                    title="Избранное"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[.04]"
                  >
                    <HeartIcon />
                  </Link>
                )}

                {authLoaded &&
                  (user ? (
                    <Link
                      href="/profile"
                      className="max-w-[90px] truncate rounded-full bg-black px-3 py-2 text-[11px] text-white"
                    >
                      {user.name}
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="rounded-full bg-black px-3 py-2 text-[11px] text-white"
                    >
                      Войти
                    </Link>
                  ))}
              </div>
            )}

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
                Карта
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
                className="rounded-full bg-black text-white px-5 py-2.5"
              >
                {user.name}
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
    </header>
  );
}