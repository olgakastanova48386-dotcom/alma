"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DRAFT_KEY = "alma-surprise-draft";

export default function CheckoutPage() {
  const [step, setStep] = useState<"checking" | "ready">("checking");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        const data = response.ok ? await response.json() : { user: null };
        if (!active) return;
        if (!data.user) {
          window.location.assign("/login?next=%2Fcheckout&product=route-199");
          return;
        }

        try {
          const raw = localStorage.getItem(DRAFT_KEY);
          if (raw) {
            const route = JSON.parse(raw);
            await fetch("/api/routes/draft", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ route }),
            });
          }
        } catch {}

        const statusResponse = await fetch("/api/payments/status", { credentials: "include" });
        if (statusResponse.ok) {
          const status = await statusResponse.json();
          if (status.entitled === true) {
            window.location.assign("/surprise");
            return;
          }
        }
        if (active) setStep("ready");
      } catch {
        if (active) window.location.assign("/login?next=%2Fcheckout&product=route-199");
      }
    })();
    return () => { active = false; };
  }, []);

  if (step === "checking") {
    return <main className="min-h-screen bg-[#f7f4ef] grid place-items-center px-4"><p className="text-sm text-neutral-500">Проверяем аккаунт и доступ к маршруту…</p></main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-[520px]">
        <Link href="/surprise" className="text-sm text-neutral-500">← Вернуться к маршруту</Link>
        <div className="mt-5 rounded-[34px] bg-white p-7 sm:p-9 shadow-xl border border-black/5">
          <p className="text-xs uppercase tracking-[.2em] text-neutral-400">ALMA · оплата</p>
          <h1 className="mt-3 text-3xl font-bold">Следующий маршрут · 199 ₽</h1>
          <div className="mt-4 rounded-[20px] bg-[#f2eee7] px-4 py-3 text-sm font-semibold leading-6">Первый готовый маршрут — бесплатно. Каждый следующий — 199 ₽.</div>

          <div className="mt-7 rounded-[24px] border border-black/10 p-5">
            <p className="text-xs uppercase tracking-[.16em] text-neutral-400">Способ оплаты</p>
            <h2 className="mt-2 text-xl font-bold">СБП · 199 ₽</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">После подключения Ozon Pay здесь будет кнопка оплаты через СБП. Покупатель выберет свой банк и подтвердит 199 ₽ в банковском приложении. ALMA не получает данные банковской карты.</p>
          </div>

          <div className="mt-4 rounded-[20px] bg-[#f7f4ef] p-4">
            <p className="text-sm font-semibold">Как это будет работать</p>
            <p className="mt-1 text-sm leading-6 text-neutral-500">Оплатить через СБП → выбрать банк → подтвердить 199 ₽ → ALMA получает подтверждение успешного платежа → маршрут открывается автоматически.</p>
          </div>

          <button type="button" disabled className="mt-6 w-full rounded-full bg-black px-6 py-4 font-semibold text-white opacity-45 cursor-not-allowed">Оплатить через СБП · 199 ₽</button>
          <p className="mt-4 text-center text-xs leading-5 text-neutral-400">Кнопка станет активной после подключения интернет-эквайринга Ozon Pay. До подключения ALMA не создаёт фиктивных платежей.</p>
        </div>
      </div>
    </main>
  );
}
