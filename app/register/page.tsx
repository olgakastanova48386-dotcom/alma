"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

type Gender = "female" | "male" | "unspecified";

function RegisterContent() {
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const product = params.get("product");
  const isRoutePurchase = product === "route-199";
  const destination = isRoutePurchase ? "/checkout?product=route-199" : next;
  const loginHref = `/login?next=${encodeURIComponent(next)}${product ? `&product=${encodeURIComponent(product)}` : ""}`;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<Gender>("unspecified");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketingSms, setMarketingSms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const phoneOk = /^\+?[1-9]\d{9,14}$/.test(phone.replace(/[^\d+]/g, ""));
  const nameOk = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\- ']{1,39}$/.test(name.trim());
  const passwordsOk = password.length >= 8 && password === repeat;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!nameOk) { setError("Укажите имя — минимум 2 буквы."); return; }
    if (!phoneOk) { setError("Проверьте номер телефона. Например: +7 999 123-45-67."); return; }
    if (password.length < 8) { setError("Пароль должен содержать минимум 8 символов."); return; }
    if (!passwordsOk) { setError("Пароли не совпадают."); return; }
    if (!consent) { setError("Нужно согласиться с правилами ALMA и обработкой данных."); return; }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, gender, password, consent, marketingSms })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось создать аккаунт.");
      const verifiedPhone = encodeURIComponent(data.phone || phone);
      window.location.assign(`/verify-phone?phone=${verifiedPhone}&next=${encodeURIComponent(destination)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось создать аккаунт.");
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-[18px] border border-black/20 bg-white px-4 py-3 text-base outline-none transition focus:border-black";

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-3 pt-[76px] pb-28 sm:flex sm:items-center sm:justify-center sm:px-4 sm:pt-24 sm:pb-12">
      <div className="mx-auto w-full max-w-[430px] rounded-[24px] border border-black/5 bg-white p-5 shadow-lg sm:rounded-[30px] sm:p-10 sm:shadow-xl">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 sm:text-xs">ALMA</p>
          <h1 className="mt-1.5 text-[26px] font-bold sm:mt-3 sm:text-3xl">Регистрация</h1>
          {isRoutePurchase ? (
            <div className="mt-3 rounded-[18px] bg-[#f2eee7] p-3.5 text-center sm:mt-5 sm:rounded-[22px] sm:p-5">
              <p className="text-[10px] uppercase tracking-[.16em] text-neutral-400 sm:text-xs">Маршрут ждёт тебя</p>
              <p className="mt-1.5 text-sm font-semibold sm:mt-2 sm:text-base">Создай аккаунт — после подтверждения номера сразу перейдём к оплате 199 ₽</p>
            </div>
          ) : (
            <p className="mt-1.5 text-[13px] leading-5 text-neutral-500 sm:mt-2 sm:text-sm">Телефон станет вашим способом входа в ALMA</p>
          )}
        </div>

        <form className="mt-4 space-y-3 sm:mt-7 sm:space-y-4" onSubmit={onSubmit}>
          <div><label className="mb-1.5 block text-[12px] font-medium text-neutral-500">Как вас зовут</label><input value={name} onChange={e => setName(e.target.value)} type="text" autoComplete="name" enterKeyHint="next" placeholder="Имя" maxLength={40} className={inputClass} /></div>
          <div><label className="mb-1.5 block text-[12px] font-medium text-neutral-500">Номер телефона</label><input value={phone} onChange={e => setPhone(e.target.value)} type="tel" autoComplete="tel" inputMode="tel" enterKeyHint="next" placeholder="+7 999 123-45-67" className={inputClass} /></div>
          <fieldset><legend className="text-[12px] font-medium text-neutral-500">Пол <span className="font-normal text-neutral-400">· необязательно</span></legend><div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2">{([{ value: "female", label: "Женщина" }, { value: "male", label: "Мужчина" }, { value: "unspecified", label: "Не указывать" }] as const).map(option => (<button key={option.value} type="button" onClick={() => setGender(option.value)} className={`min-h-10 rounded-[14px] border px-1.5 py-2 text-[11px] font-medium sm:rounded-2xl sm:px-2 sm:py-3 sm:text-xs ${gender === option.value ? "border-black bg-black text-white" : "border-black/10 text-neutral-600"}`}>{option.label}</button>))}</div></fieldset>
          <div className="grid gap-2.5 sm:gap-4"><input value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="new-password" enterKeyHint="next" minLength={8} placeholder="Пароль · минимум 8 символов" className={inputClass} /><input value={repeat} onChange={e => setRepeat(e.target.value)} type="password" autoComplete="new-password" enterKeyHint="done" minLength={8} placeholder="Повторите пароль" className={inputClass} />{repeat && password !== repeat && <p className="-mt-1 text-[11px] text-red-600">Пароли не совпадают.</p>}</div>
          <label className="flex items-start gap-2.5 text-[11px] leading-4.5 text-neutral-600 sm:text-xs sm:leading-5"><input checked={consent} onChange={e => setConsent(e.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 shrink-0" /><span>Согласен(на) с правилами ALMA и обработкой данных для работы аккаунта.</span></label>
          <label className="flex items-start gap-2.5 text-[11px] leading-4.5 text-neutral-500 sm:text-xs sm:leading-5"><input checked={marketingSms} onChange={e => setMarketingSms(e.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 shrink-0" /><span>Хочу получать полезные сообщения ALMA. Это необязательно.</span></label>
          {error && <div role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="sticky bottom-[calc(.75rem+env(safe-area-inset-bottom))] z-20 -mx-1 pt-1 sm:static sm:mx-0 sm:pt-0"><button type="submit" disabled={loading} className="w-full rounded-[18px] bg-black py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:py-3.5 sm:text-base sm:shadow-none">{loading ? "Отправляем код…" : isRoutePurchase ? "Создать аккаунт и подтвердить номер" : "Создать аккаунт"}</button></div>
        </form>
        <p className="mt-4 text-center text-[12px] text-neutral-600 sm:mt-6 sm:text-sm">Уже есть аккаунт? <Link href={loginHref} className="font-semibold text-black underline underline-offset-4">Войти</Link></p>
      </div>
    </main>
  );
}

export default function RegisterPage() { return <Suspense fallback={<main className="min-h-screen bg-[#f7f4ef]"/>}><RegisterContent/></Suspense>; }
