import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-4 pt-24 pb-12">
      <div className="bg-white p-8 sm:p-10 rounded-[30px] shadow-xl w-full max-w-[430px] border border-black/5">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 text-center">ALMA</p>
        <h1 className="mt-3 text-3xl font-bold text-center">Регистрация</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">Создайте аккаунт, чтобы сохранять любимые места</p>

        <form className="mt-7">
          <input type="text" name="name" autoComplete="name" placeholder="Имя" className="w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <input type="email" name="email" autoComplete="email" placeholder="Email" className="mt-4 w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <input type="password" name="password" autoComplete="new-password" placeholder="Пароль" className="mt-4 w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <input type="password" name="password-confirm" autoComplete="new-password" placeholder="Повторите пароль" className="mt-4 w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <button type="button" className="mt-6 w-full bg-black text-white rounded-2xl py-3.5 font-medium hover:opacity-85 transition">Создать аккаунт</button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">Уже есть аккаунт? <Link href="/login" className="font-semibold text-black underline underline-offset-4">Войти</Link></p>
        <p className="mt-4 text-center text-xs leading-5 text-neutral-400">Регистрация станет активной после подключения защищённого хранения аккаунтов. Мы не имитируем создание пользователя без настоящей авторизации.</p>
      </div>
    </main>
  );
}
