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
      <main className="min-h-screen bg-[#f7f4ef] pt-[92px] sm:pt-36 pb-16 sm:pb-24 px-4">
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
      <div className="max-w-3xl mx-auto px-1 sm:px-0">
        <p className="text-[9px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.22em] text-neutral-400">ALMA · Аккаунт</p>
        <div className="mt-2 sm:mt-5 rounded-[22px] sm:rounded-[34px] bg-white border border-black/5 shadow-sm p-4 sm:p-10">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="h-11 w-11 sm:h-20 sm:w-20 shrink-0 rounded-full bg-black text-white flex items-center justify-center text-lg sm:text-3xl font-semibold uppercase">{user.name.trim().charAt(0) || "A"}</div>
            <div>
              <h1 className="text-xl sm:text-4xl font-bold">{user.name}</h1>
              
            </div>
          </div>

          <div className="mt-4 sm:mt-8 grid grid-cols-2 gap-2 sm:gap-3">
            <Link href="/favorites" className="rounded-[16px] sm:rounded-[22px] bg-[#f2eee7] px-3 py-3 sm:px-5 sm:py-5 hover:bg-[#ebe5dc] transition"><p className="text-[11px] sm:text-sm text-neutral-500">Твои места</p><p className="mt-1 font-semibold text-[15px] sm:text-lg">♡ Избранное</p></Link>
            <Link href="/surprise" className="rounded-[16px] sm:rounded-[22px] bg-[#f2eee7] px-3 py-3 sm:px-5 sm:py-5 hover:bg-[#ebe5dc] transition"><p className="text-[11px] sm:text-sm text-neutral-500">Новый план</p><p className="mt-1 font-semibold text-[15px] sm:text-lg">✨ Удиви меня</p></Link>
          </div>
        </div>

        {user.gender === "female" && (
          <section className="mt-3 sm:mt-6 rounded-[22px] sm:rounded-[34px] bg-white border border-black/5 shadow-sm p-4 sm:p-10">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#f4d9df] text-[#6f2437] flex items-center justify-center text-xl shadow-sm ring-1 ring-[#dca9b5]/60" aria-hidden="true">🛡</div>
              <div>
                <p className="text-[9px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] text-neutral-400">Безопасность</p>
                <h2 className="mt-0.5 text-lg sm:mt-1 sm:text-2xl font-bold tracking-tight">Безопасное место</h2>
                <p className="mt-2 text-[13px] sm:mt-3 sm:text-base leading-5 sm:leading-7 text-neutral-600">В некоторых кафе, ресторанах и других местах ALMA ты увидишь этот значок. Он означает, что заведение подтвердило возможность обратиться к сотруднику за помощью, если тебя преследуют, тебе угрожают или рядом с кем-то небезопасно.</p>
                <p className="mt-2 text-[13px] sm:mt-3 sm:text-base leading-5 sm:leading-7 text-neutral-600">В карточке такого места ALMA покажет <span className="font-semibold text-black">кодовую фразу</span>, которую нужно назвать сотруднику, и объяснит, какую помощь сможет оказать персонал.</p>
                <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs leading-4 sm:leading-5 text-neutral-400">ALMA показывает отметку только после подтверждения заведением. При непосредственной опасности обращайся в экстренные службы.</p>
              </div>
            </div>
          </section>
        )}

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
