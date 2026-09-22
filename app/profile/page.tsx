"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <main className="min-h-screen bg-[#f7f4ef] pt-[144px] sm:pt-36 pb-24 px-4">
      <div className="max-w-3xl mx-auto px-1 sm:px-0">
        <div className="mt-0 rounded-[22px] sm:rounded-[34px] bg-white border border-black/5 shadow-sm p-4 sm:p-10">
          <div className="flex items-center gap-2.5 sm:gap-5">
            <div className="h-11 w-11 sm:h-20 sm:w-20 shrink-0 rounded-full bg-black text-white flex items-center justify-center text-lg sm:text-3xl font-semibold uppercase">{user.name.trim().charAt(0) || "A"}</div>
            <h1 className="min-w-0 flex-1 text-[18px] leading-tight sm:text-4xl font-bold break-words">{user.name}</h1>
            <Link href="/favorites" className="ml-auto shrink-0 inline-flex items-center gap-1 rounded-full bg-[#f2eee7] px-2.5 py-2 text-[12px] sm:px-5 sm:py-3 sm:text-base font-semibold hover:bg-[#ebe5dc] transition" aria-label="Избранное">
              <span aria-hidden="true">♡</span><span>Избранное</span>
            </Link>
          </div>
        </div>

                <section className="mt-3 sm:mt-6 rounded-[22px] sm:rounded-[34px] bg-white border border-black/5 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src="/alma-qr.svg"
              alt="QR-код со ссылкой на ALMA"
              className="h-[104px] w-[104px] shrink-0 rounded-[16px] bg-white p-1.5 ring-1 ring-black/10 sm:h-[132px] sm:w-[132px]"
            />
            <div className="min-w-0">
              <p className="text-[9px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] text-neutral-400">Поделиться</p>
              <h2 className="mt-1 text-lg sm:text-2xl font-bold tracking-tight">Покажи ALMA другу</h2>
              <p className="mt-1.5 text-[12px] sm:text-sm leading-5 text-neutral-500">Наведи камеру другого телефона на QR-код.</p>
              <a href="https://alma.almacity.workers.dev" className="mt-3 inline-flex min-h-9 items-center justify-center rounded-full bg-black px-4 py-2 text-[11px] sm:text-xs font-semibold text-white transition hover:opacity-80">
                Открыть сайт
              </a>
            </div>
          </div>
        </section>

{user.gender === "female" && (
          <section className="mt-3 sm:mt-6 rounded-[22px] sm:rounded-[34px] bg-white border border-black/5 shadow-sm p-4 sm:p-7">
            <div className="flex items-start gap-3">
              <div className="shrink-0 h-10 w-10 rounded-full bg-[#f4d9df] text-[#6f2437] flex items-center justify-center text-xl shadow-sm ring-1 ring-[#dca9b5]/60" aria-hidden="true">🛡</div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] sm:text-xs uppercase tracking-[0.14em] text-neutral-400">Безопасность</p>
                <h2 className="mt-0.5 text-lg sm:text-2xl font-bold tracking-tight">Нужна помощь?</h2>
                <p className="mt-1.5 text-[13px] sm:text-sm leading-5 text-neutral-700">
                  Место с отметкой щита — безопасное место. Скажи сотруднику кодовую фразу <span className="font-extrabold text-black">«Я потеряла ключи»</span> или любые другие слова со словом <span className="font-extrabold text-black">«ключ»</span> — тебе помогут.
                </p>
                <details className="mt-3 group">
                  <summary className="cursor-pointer list-none text-[12px] sm:text-sm font-semibold underline underline-offset-4 decoration-black/20">
                    Как работает безопасное место
                  </summary>
                  <div className="mt-3 rounded-[16px] bg-[#f7f4ef] p-3 text-[12px] sm:text-sm leading-5 text-neutral-600">
                    <p>По правилам проекта «Ключевое слово» подойдут, например, фразы «Я потеряла ключи», «Мне оставили ключи», «У вас нет моего ключа» — или любые другие слова со словом «ключ». Сотрудники партнёрской точки знают протокол: помогут укрыться от преследователя и по твоему выбору вызовут полицию или такси.</p>
                    <p className="mt-2 text-neutral-500">Если есть непосредственная опасность, не жди кодовой фразы: прямо скажи сотруднику, что тебе нужна помощь, и обратись в экстренные службы.</p>
                  </div>
                </details>
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
