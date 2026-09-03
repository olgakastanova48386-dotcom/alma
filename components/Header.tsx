import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto mt-5 px-8">
        <div className="flex items-center justify-between rounded-full bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl px-8 py-4">

          <Link
            href="/"
            className="text-2xl font-bold tracking-[0.35em]"
          >
            alma
          </Link>

          <nav className="hidden lg:flex gap-10 text-gray-600">
            <Link
              href="/"
              className="hover:text-black transition"
            >
              Главная
            </Link>

            <Link
              href="/map"
              className="hover:text-black transition"
            >
              Карта
            </Link>

            <Link
              href="/collections"
              className="hover:text-black transition"
            >
              Подборки
            </Link>

            <Link
              href="/about"
              className="hover:text-black transition"
            >
              О проекте
            </Link>
          </nav>

          <Link
            href="/login"
            className="rounded-full bg-black text-white px-6 py-3 hover:scale-105 transition"
          >
            Войти
          </Link>

        </div>
      </div>
    </header>
  );
}