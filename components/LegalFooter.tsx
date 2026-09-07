import Link from "next/link";

export default function LegalFooter() {
  return (
    <footer className="bg-[#111] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <div className="text-xl font-bold tracking-[0.3em]">alma</div>
            <p className="mt-3 text-sm text-white/55 max-w-xl leading-6">
              Информационный сервис о местах Санкт-Петербурга. Цены, рейтинги,
              часы работы и правила посещения могут меняться — проверяйте важную
              информацию у заведения перед визитом.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/70">
            <Link href="/legal" className="hover:text-white transition">Правовая информация</Link>
            <Link href="/legal/terms" className="hover:text-white transition">Соглашение</Link>
            <Link href="/legal/privacy" className="hover:text-white transition">Персональные данные</Link>
            <Link href="/legal/cookies" className="hover:text-white transition">Cookies</Link>
            <Link href="/legal/reviews" className="hover:text-white transition">Отзывы и цены</Link>
            <Link href="/legal/complaints" className="hover:text-white transition">Жалобы</Link>
            <Link href="/legal/rightsholders" className="hover:text-white transition">Правообладателям</Link>
            <Link href="/legal/data-sources" className="hover:text-white transition">Источники данных</Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/45 leading-6">
          <p>ИП Прибыткова Ольга Алексеевна · ИНН 783827717569 · ОГРНИП 323784700226902</p>
          <p>Юридические обращения: olgakastanova48386@gmail.com</p>
          <p className="mt-2">© {new Date().getFullYear()} ALMA</p>
        </div>
      </div>
    </footer>
  );
}
