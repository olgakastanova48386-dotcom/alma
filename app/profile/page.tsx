"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCityArchetype from "@/components/ProfileCityArchetype";

type User = {
  id: string;
  name: string;
  phone: string;
  gender?: string;
  marketing_sms?: number;
  created_at?: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => res.ok ? res.json() : { user: null })
      .then((data) => {
        setUser(data.user || null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.replace("/");
      router.refresh();
      window.location.href = "/";
    } finally {
      setLoggingOut(false);
    }
  }

  if (!loaded) {
    return <main className="min-h-screen bg-[#f7f4ef] pt-36 px-4"><div className="max-w-3xl mx-auto text-neutral-500">Загружаем профиль…</div></main>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] pt-32 sm:pt-36 pb-24 px-4">
        <section className="max-w-xl mx-auto rounded-[32px] bg-white border border-black/5 p-8 sm:p-10 text-center shadow-sm">
          <div className="mx-auto h-16 w-16 rounded-full bg-[#f2eee7] flex items-center justify-center text-2xl">◎</div>
          <h1 className="mt-6 text-3xl font-bold">Войдите в ALMA</h1>
          <p className="mt-3 text-neutral-500 leading-7">Профиль доступен после входа в аккаунт.</p>
          <Link href="/login?next=%2Fprofile" className="inline-flex mt-7 rounded-full bg-black text-white px-7 py-3.5 font-medium hover:opacity-80 transition">Войти</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-32 sm:pt-36 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA · Аккаунт</p>
        <div className="mt-5 rounded-[34px] bg-white border border-black/5 shadow-sm p-7 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-semibold uppercase">{user.name.trim().charAt(0) || "A"}</div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">{user.name}</h1>
              <p className="mt-2 text-neutral-500">{user.phone}</p>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Link href="/favorites" className="rounded-[22px] bg-[#f2eee7] px-5 py-5 hover:bg-[#ebe5dc] transition"><p className="text-sm text-neutral-500">Твои места</p><p className="mt-1 font-semibold text-lg">♡ Избранное</p></Link>
            <Link href="/surprise" className="rounded-[22px] bg-[#f2eee7] px-5 py-5 hover:bg-[#ebe5dc] transition"><p className="text-sm text-neutral-500">Новый план</p><p className="mt-1 font-semibold text-lg">✨ Удиви меня</p></Link>
          </div>
        </div>

        <ProfileCityArchetype />

        <div className="mt-6 rounded-[34px] bg-white border border-black/5 shadow-sm p-7 sm:p-10">
          <div className="border-t border-black/10 pt-6">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Аккаунт</p>
            <p className="mt-3 text-sm text-neutral-500 leading-6">Сейчас вход работает по номеру телефона и паролю. Подтверждение номера и восстановление доступа добавим следующим этапом.</p>
            <button type="button" onClick={logout} disabled={loggingOut} className="mt-6 rounded-full border border-black/15 px-6 py-3 text-sm font-medium hover:bg-black hover:text-white transition disabled:opacity-50">{loggingOut ? "Выходим…" : "Выйти из аккаунта"}</button>
          </div>
        </div>
      </div>
    </main>
  );
}
