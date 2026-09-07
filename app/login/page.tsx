"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const product = params.get("product");
  const isRoutePurchase = product === "route-199";
  const destination = isRoutePurchase ? "/checkout?product=route-199" : next;
  const registerHref = `/register?next=${encodeURIComponent(next)}${product ? `&product=${encodeURIComponent(product)}` : ""}`;
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось войти.");
      window.location.assign(destination);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось войти.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-4 pt-24 pb-12">
      <div className="bg-white p-8 sm:p-10 rounded-[30px] shadow-xl w-full max-w-[430px] border border-black/5">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 text-center">ALMA</p>
        <h1 className="mt-3 text-3xl font-bold text-center">Вход</h1>
        {isRoutePurchase ? <div className="mt-5 rounded-[22px] bg-[#f2eee7] p-5 text-center"><p className="text-xs uppercase tracking-[.16em] text-neutral-400">Твой маршрут сохранён</p><p className="mt-2 font-semibold">После входа сразу перейдём к безопасной оплате маршрута за 199 ₽</p></div> : <p className="mt-2 text-center text-sm text-neutral-500">Войдите по номеру телефона, чтобы сохранять любимые места</p>}
        <form className="mt-7" onSubmit={onSubmit}>
          <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" autoComplete="tel" inputMode="tel" placeholder="Номер телефона" className="w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder="Пароль" className="mt-4 w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          {error && <div role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button type="submit" disabled={loading || !phone || !password} className="mt-6 w-full bg-black text-white rounded-2xl py-3.5 font-medium hover:opacity-85 transition disabled:opacity-30 disabled:cursor-not-allowed">{loading ? "Входим…" : isRoutePurchase ? "Войти и перейти к оплате" : "Войти"}</button>
        </form>
        <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-black/10"/><span className="text-xs text-neutral-400">или</span><div className="h-px flex-1 bg-black/10"/></div>
        <p className="text-center text-sm text-neutral-600">Нет аккаунта? <Link href={registerHref} className="font-semibold text-black underline underline-offset-4">Зарегистрироваться</Link></p>
        {isRoutePurchase && <Link href="/surprise" className="mt-5 block text-center text-xs text-neutral-400 hover:text-black">← Вернуться к маршруту</Link>}
      </div>
    </main>
  );
}
