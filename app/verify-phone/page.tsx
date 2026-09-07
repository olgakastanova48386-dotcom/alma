"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function VerifyPhoneContent() {
  const params = useSearchParams();
  const phone = params.get("phone") || "";
  const next = params.get("next") || "/";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage("");
    if (!/^\d{6}$/.test(code)) { setError("Введите шестизначный код из SMS."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-phone", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось подтвердить номер.");
      window.location.assign(next);
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось подтвердить номер."); setLoading(false); }
  }

  async function resend() {
    setError(""); setMessage(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/send-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, purpose: "verify" }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось отправить код.");
      setMessage("Новый код отправлен.");
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось отправить код."); }
    finally { setLoading(false); }
  }

  return <main className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-4 pt-24 pb-12"><div className="w-full max-w-[430px] rounded-[30px] bg-white p-8 shadow-xl border border-black/5"><p className="text-center text-xs uppercase tracking-[.22em] text-neutral-400">ALMA</p><h1 className="mt-3 text-center text-3xl font-bold">Подтвердите номер</h1><p className="mt-3 text-center text-sm text-neutral-500">Мы отправили шестизначный код на {phone || "ваш телефон"}.</p><form onSubmit={verify} className="mt-7"><input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" className="w-full rounded-2xl border border-black/20 px-4 py-4 text-center text-2xl tracking-[.35em] outline-none focus:border-black" />{error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}{message && <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}<button disabled={loading} className="mt-5 w-full rounded-2xl bg-black py-3.5 font-semibold text-white disabled:opacity-50">{loading ? "Проверяем…" : "Подтвердить номер"}</button></form><button type="button" onClick={resend} disabled={loading || !phone} className="mt-4 w-full text-sm font-medium text-neutral-600 underline underline-offset-4 disabled:opacity-40">Отправить код ещё раз</button></div></main>;
}

export default function VerifyPhonePage() { return <Suspense fallback={<main className="min-h-screen bg-[#f7f4ef]"/>}><VerifyPhoneContent/></Suspense>; }
