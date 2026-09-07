import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-4 pt-24 pb-12">
      <div className="bg-white p-8 sm:p-10 rounded-[30px] shadow-xl w-full max-w-[430px] border border-black/5">
        <h1 className="text-3xl font-bold text-center">Вход</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">Войдите, чтобы сохранять любимые места</p>

        <form className="mt-7">
          <input type="email" name="email" autoComplete="email" placeholder="Email" className="w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <input type="password" name="password" autoComplete="current-password" placeholder="Пароль" className="mt-4 w-full border border-black/30 rounded-2xl px-4 py-3.5 outline-none focus:border-black transition" />
          <button type="button" className="mt-6 w-full bg-black text-white rounded-2xl py-3.5 font-medium hover:opacity-85 transition">Войти</button>
        </form>

        <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-black/10"/><span className="text-xs text-neutral-400">или</span><div className="h-px flex-1 bg-black/10"/></div>

        <p className="text-center text-sm text-neutral-600">Нет аккаунта? <Link href="/register" className="font-semibold text-black underline underline-offset-4">Зарегистрироваться</Link></p>
      </div>
    </main>
  );
}
