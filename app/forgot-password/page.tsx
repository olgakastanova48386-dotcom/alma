"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/send-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, purpose: "reset" }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось отправить код.");
      setStep(2);
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось отправить код."); }
    finally { setLoading(false); }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!/^\d{6}$/.test(code)) { setError("Введите шестизначный код из SMS."); return; }
    if (password.length < 8) { setError("Новый пароль должен содержать минимум 8 символов."); return; }
    if (password !== repeat) { setError("Пароли не совпадают."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось восстановить доступ.");
      setStep(3);
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось восстановить доступ."); }
    finally { setLoading(false); }
  }

  return <main className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-4 pt-24 pb-12"><div className="w-full max-w-[430px] rounded-[30px] bg-white p-8 shadow-xl border border-black/5"><p className="text-center text-xs uppercase tracking-[.22em] text-neutral-400">ALMA</p><h1 className="mt-3 text-center text-3xl font-bold">Восстановление доступа</h1>{step === 1 && <form onSubmit={sendCode} className="mt-7"><p className="mb-4 text-center text-sm text-neutral-500">Введите номер телефона, привязанный к аккаунту.</p><input value={phone} onChange={e => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 999 123-45-67" className="w-full rounded-2xl border border-black/20 px-4 py-3.5 outline-none focus:border-black" />{error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}<button disabled={loading || !phone} className="mt-5 w-full rounded-2xl bg-black py-3.5 font-semibold text-white disabled:opacity-40">{loading ? "Отправляем…" : "Получить код"}</button></form>}{step === 2 && <form onSubmit={resetPassword} className="mt-7 space-y-3"><p className="mb-4 text-center text-sm text-neutral-500">Введите код из SMS и придумайте новый пароль.</p><input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="Код из SMS" className="w-full rounded-2xl border border-black/20 px-4 py-3.5 text-center tracking-[.25em] outline-none focus:border-black" /><input value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="new-password" placeholder="Новый пароль · минимум 8 символов" className="w-full rounded-2xl border border-black/20 px-4 py-3.5 outline-none focus:border-black" /><input value={repeat} onChange={e => setRepeat(e.target.value)} type="password" autoComplete="new-password" placeholder="Повторите новый пароль" className="w-full rounded-2xl border border-black/20 px-4 py-3.5 outline-none focus:border-black" />{error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}<button disabled={loading} className="w-full rounded-2xl bg-black py-3.5 font-semibold text-white disabled:opacity-40">{loading ? "Сохраняем…" : "Сохранить новый пароль"}</button></form>}{step === 3 && <div className="mt-7 text-center"><div className="rounded-[22px] bg-green-50 px-5 py-5 text-sm text-green-800">Пароль изменён. Теперь можно войти в ALMA.</div><Link href="/login" className="mt-5 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">Перейти ко входу</Link></div>}<Link href="/login" className="mt-6 block text-center text-sm text-neutral-500 underline underline-offset-4">← Вернуться ко входу</Link></div></main>;
}
