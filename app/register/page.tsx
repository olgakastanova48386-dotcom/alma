"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const NAME_RE = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\- ']{1,39}$/;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const nameOk = useMemo(() => NAME_RE.test(name.trim()) && !/(.)\1{3,}/i.test(name), [name]);
  const phoneOk = /^\+?[1-9]\d{9,14}$/.test(cleanPhone);

  return (
    <main className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-4 pt-24 pb-12">
      <div className="bg-white p-8 sm:p-10 rounded-[30px] shadow-xl w-full max-w-[430px] border border-black/5">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 text-center">ALMA</p>
        <h1 className="mt-3 text-3xl font-bold text-center">Регистрация</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">Телефон станет вашим способом входа в ALMA</p>
        <form className="mt-7">
          <label className="block text-xs font-medium text-neutral-500 mb-2">Как вас зовут</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} type="text" name="name" autoComplete="name" placeholder="Имя" maxLength={40} className="w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          {name && !nameOk && <p className="mt-2 text-xs text-red-600">Введите настоящее имя буквами, без цифр и случайного набора символов.</p>}

          <label className="block text-xs font-medium text-neutral-500 mt-4 mb-2">Номер телефона</label>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="+7 999 123-45-67" className="w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          {phone && !phoneOk && <p className="mt-2 text-xs text-red-600">Проверьте номер: нужен международный формат, например +7 999 123-45-67.</p>}

          <input type="password" name="password" autoComplete="new-password" minLength={8} placeholder="Пароль · минимум 8 символов" className="mt-4 w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <input type="password" name="password-confirm" autoComplete="new-password" minLength={8} placeholder="Повторите пароль" className="mt-4 w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-neutral-600"><input type="checkbox" className="mt-1"/><span>Согласен(на) с правилами ALMA и обработкой данных для работы аккаунта.</span></label>
          <label className="mt-3 flex items-start gap-3 text-xs leading-5 text-neutral-500"><input type="checkbox" className="mt-1"/><span>Хочу получать по SMS полезные сообщения ALMA, включая персональные коды скидок. Это необязательно.</span></label>
          <button type="button" disabled={!nameOk || !phoneOk} className="mt-6 w-full bg-black text-white rounded-2xl py-3.5 font-medium hover:opacity-85 transition disabled:opacity-30 disabled:cursor-not-allowed">Создать аккаунт</button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-600">Уже есть аккаунт? <Link href="/login" className="font-semibold text-black underline underline-offset-4">Войти</Link></p>
        <p className="mt-4 text-center text-xs leading-5 text-neutral-400">Пока кнопка не отправляет данные: подключим создание аккаунта только вместе с защищённым хранением и подтверждением телефона.</p>
      </div>
    </main>
  );
}
