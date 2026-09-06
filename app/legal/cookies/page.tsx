export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA · Cookies</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Cookies и технические данные</h1>
        <div className="mt-8 rounded-[28px] bg-white border border-black/5 p-6 sm:p-8 shadow-sm text-neutral-700 leading-7 space-y-5">
          <p>ALMA может использовать технически необходимые механизмы браузера для работы интерфейса, сохранения пользовательских настроек и обеспечения безопасности.</p>
          <p>В текущей версии избранное может сохраняться локально в браузере пользователя. Такие данные не являются отзывами и не публикуются от имени пользователя.</p>
          <p>Если в ALMA будут подключены аналитические, рекламные или иные сторонние технологии, требующие отдельного информирования или согласия, эта страница и интерфейс согласия будут обновлены до их запуска.</p>
          <p>Пользователь может управлять cookies и локальным хранилищем через настройки своего браузера. Отключение технически необходимых механизмов может повлиять на работу отдельных функций сайта.</p>
        </div>
      </div>
    </main>
  );
}
