import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-[9999]">
      <div className="max-w-7xl mx-auto mt-4 px-4 sm:px-6">
        <div className="flex items-center justify-between rounded-full bg-white/90 backdrop-blur-xl border border-black/5 shadow-lg px-5 sm:px-8 py-3">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-[0.3em]">
            alma
          </Link>

          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm md:text-base text-gray-600">
            <Link href="/" className="hover:text-black transition">
              Главная
            </Link>
            <Link href="/map" className="hover:text-black transition">
              Карта
            </Link>
            <Link href="/dog-friendly" className="hover:text-black transition">
              🐾 С собакой
            </Link>
            <Link href="/favorites" className="hover:text-black transition">
              ♡ Избранное
            </Link>
            <Link href="/about" className="hover:text-black transition">
              О проекте
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/map"
              className="md:hidden w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-base"
              aria-label="Карта"
            >
              ⌖
            </Link>
            <Link
              href="/favorites"
              className="md:hidden w-10 h-10 rounded-full bg-[#f3f1ed] flex items-center justify-center text-lg"
              aria-label="Избранное"
            >
              ♡
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-black text-white px-5 py-2.5 hover:opacity-80 transition"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
