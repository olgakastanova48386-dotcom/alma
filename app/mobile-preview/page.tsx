export default function MobilePreviewPage() {
  return (
    <main className="min-h-screen bg-[#ece9e4] px-6 py-10 text-black">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">ALMA · предпросмотр</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Мобильная версия</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-black/55">Здесь сайт открывается внутри мобильного экрана шириной 390 px, чтобы можно было проверять мобильную версию прямо с ноутбука.</p>
          </div>
          <a href="/" className="self-start rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">Открыть обычный сайт</a>
        </div>

        <div className="flex justify-center">
          <div className="rounded-[42px] bg-black p-[10px] shadow-[0_30px_90px_rgba(0,0,0,.24)]">
            <div className="overflow-hidden rounded-[34px] bg-white">
              <iframe
                src="/"
                title="Мобильная версия ALMA"
                className="block h-[844px] w-[390px] max-w-[calc(100vw-44px)] bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
