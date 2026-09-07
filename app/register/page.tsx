"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

type Gender = "female" | "male" | "unspecified";

export default function RegisterPage() {
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
  const canSubmit = nameOk && phoneOk && passwordsOk && consent && !loading;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, gender, password, consent, marketingSms })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось создать аккаунт.");
      window.location.assign(destination);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось создать аккаунт.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-4 pt-24 pb-12">
      <div className="bg-white p-8 sm:p-10 rounded-[30px] shadow-xl w-full max-w-[430px] border border-black/5">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 text-center">ALMA</p>
        <h1 className="mt-3 text-3xl font-bold text-center">Регистрация</h1>
        {isRoutePurchase ? <div className="mt-5 rounded-[22px] bg-[#f2eee7] p-5 text-center"><p className="text-xs uppercase tracking-[.16em] text-neutral-400">Маршрут ждёт тебя</p><p className="mt-2 font-semibold">Создай аккаунт — после регистрации сразу перейдём к оплате 199 ₽</p></div> : <p className="mt-2 text-center text-sm text-neutral-500">Телефон станет вашим способом входа в ALMA</p>}

        <form className="mt-7" onSubmit={onSubmit}>
          <label className="block text-xs font-medium text-neutral-500 mb-2">Как вас зовут</label>
          <input value={name} onChange={e => setName(e.target.value)} type="text" autoComplete="name" placeholder="Имя" maxLength={40} className="w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />

          <label className="block text-xs font-medium text-neutral-500 mt-4 mb-2">Номер телефона</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" autoComplete="tel" inputMode="tel" placeholder="+7 999 123-45-67" className="w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />

          <fieldset className="mt-5">
            <legend className="text-xs font-medium text-neutral-500">Пол <span className="font-normal text-neutral-400">· необязательно</span></legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {([{ value: "female", label: "Женщина" }, { value: "male", label: "Мужчина" }, { value: "unspecified", label: "Не указывать" }] as const).map(option => (
                <button key={option.value} type="button" onClick={() => setGender(option.value)} className={`rounded-2xl border px-2 py-3 text-xs font-medium ${gender === option.value ? "border-black bg-black text-white" : "border-black/10 text-neutral-600"}`}>{option.label}</button>
              ))}
            </div>
          </fieldset>

          <input value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="new-password" minLength={8} placeholder="Пароль · минимум 8 символов" className="mt-5 w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <input value={repeat} onChange={e => setRepeat(e.target.value)} type="password" autoComplete="new-password" minLength={8} placeholder="Повторите пароль" className="mt-4 w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          {repeat && password !== repeat && <p className="mt-2 text-xs text-red-600">Пароли не совпадают.</p>}

          <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-neutral-600"><input checked={consent} onChange={e => setConsent(e.target.checked)} type="checkbox" className="mt-1" /><span>Согласен(на) с правилами ALMA и обработкой данных для работы аккаунта.</span></label>
          <label className="mt-3 flex items-start gap-3 text-xs leading-5 text-neutral-500"><input checked={marketingSms} onChange={e => setMarketingSms(e.target.checked)} type="checkbox" className="mt-1" /><span>Хочу получать полезные сообщения ALMA. Это необязательно.</span></label>

          {error && <div role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button type="submit" disabled={!canSubmit} className="mt-6 w-full bg-black text-white rounded-2xl py-3.5 font-medium hover:opacity-85 transition disabled:opacity-30 disabled:cursor-not-allowed">{loading ? "Создаём аккаунт…" : isRoutePurchase ? "Создать аккаунт и перейти к оплате" : "Создать аккаунт"}</button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">Уже есть аккаунт? <Link href={loginHref} className="font-semibold text-black underline underline-offset-4">Войти</Link></p>
        <p className="mt-4 text-center text-xs leading-5 text-neutral-400">Аккаунт создаётся сразу. Подтверждение телефона добавим следующим этапом.</p>
      </div>
    </main>
  );
}
