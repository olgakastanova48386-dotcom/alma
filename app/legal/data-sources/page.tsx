export default function DataSourcesPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA · Источники</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Источники и актуальность информации</h1>
        <div className="mt-8 rounded-[28px] bg-white border border-black/5 p-6 sm:p-8 shadow-sm text-neutral-700 leading-7 space-y-5">
          <p>ALMA стремится использовать официальные сайты заведений, музеев, городских пространств и иные проверяемые источники. Рейтинги из сторонних сервисов должны отображаться с указанием источника и даты проверки.</p>
          <p>Цены, часы работы, рейтинги, выставки, меню, правила посещения и Dog Friendly-условия могут меняться после даты проверки. Поэтому критичную информацию перед визитом рекомендуется подтвердить непосредственно у заведения.</p>
          <p>Пользовательские сообщения об актуальных ценах и условиях посещения будут храниться отдельно от редакционно проверенной информации и сопровождаться статусом источника.</p>
        </div>
      </div>
    </main>
  );
}
