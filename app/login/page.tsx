"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const product = params.get("product");
  const isRoutePurchase = product === "route-199";
  const registerHref = `/register?next=${encodeURIComponent(next)}${product ? `&product=${encodeURIComponent(product)}` : ""}`;

  return (
    <main className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-4 pt-24 pb-12">
      <div className="bg-white p-8 sm:p-10 rounded-[30px] shadow-xl w-full max-w-[430px] border border-black/5">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 text-center">ALMA</p>
        <h1 className="mt-3 text-3xl font-bold text-center">Вход</h1>
        {isRoutePurchase ? <div className="mt-5 rounded-[22px] bg-[#f2eee7] p-5 text-center"><p className="text-xs uppercase tracking-[.16em] text-neutral-400">Твой маршрут сохранён</p><p className="mt-2 font-semibold">После входа вернём тебя к маршруту за 199 ₽</p><p className="mt-2 text-xs leading-5 text-neutral-500">Повторно отвечать на вопросы не придётся.</p></div> : <p className="mt-2 text-center text-sm text-neutral-500">Войдите по номеру телефона, чтобы сохранять любимые места</p>}
        <form className="mt-7">
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="Номер телефона" className="w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <input type="password" name="password" autoComplete="current-password" placeholder="Пароль" className="mt-4 w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <button type="button" className="mt-6 w-full bg-black text-white rounded-2xl py-3.5 font-medium hover:opacity-85 transition">{isRoutePurchase ? "Войти и продолжить" : "Войти"}</button>
        </form>
        <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-black/10"/><span className="text-xs text-neutral-400">или</span><div className="h-px flex-1 bg-black/10"/></div>
        <p className="text-center text-sm text-neutral-600">Нет аккаунта? <Link href={registerHref} className="font-semibold text-black underline underline-offset-4">Зарегистрироваться</Link></p>
        {isRoutePurchase && <Link href="/surprise" className="mt-5 block text-center text-xs text-neutral-400 hover:text-black">← Вернуться к маршруту</Link>}
      </div>
    </main>
  );
}
