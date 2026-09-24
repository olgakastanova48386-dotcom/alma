const principles = [
  { title: "Миссия", text: "Помогать быстро находить подходящие места для отдыха, работы и встреч." },
  { title: "Идея", text: "Сделать городской поиск простым, красивым и вдохновляющим." },
  { title: "Ценность", text: "Выбирать места по настроению, а не случайно." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 pb-10 pt-[calc(env(safe-area-inset-top)+68px)] text-black sm:px-6 sm:pb-14 md:pt-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-4 alma-paper rounded-[22px] bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,.06)] sm:p-7 md:grid-cols-[minmax(0,1fr)_230px] md:gap-9 lg:p-9">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">О проекте</p>
            <h1 className="mt-2 max-w-3xl text-[clamp(25px,6vw,52px)] font-bold leading-[1.02] tracking-[-0.035em]">
              ALMA помогает находить места под твоё настроение
            </h1>
            <div className="mt-3 max-w-3xl space-y-2 text-[14px] leading-6 text-neutral-600 sm:text-[15px] sm:leading-7">
              <p>
                Мы собрали кофейни, рестораны, парки и городские пространства Петербурга в одном месте. ALMA учитывает настроение, бюджет, компанию и время.
              </p>
              <p>
                Наша цель — помочь быстрее открывать новые впечатления и места, в которые хочется возвращаться.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[170px] md:max-w-[230px] rounded-[18px] bg-[#f7f4ef] p-3 md:p-4 text-center ring-1 ring-black/5">
            <img src="/alma-qr.svg" alt="QR-код со ссылкой на ALMA" className="mx-auto aspect-square w-full max-w-[135px] md:max-w-[170px] rounded-[14px] bg-white p-2" />
            <p className="mt-3 text-sm font-semibold">Открыть ALMA</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">Наведи камеру другого телефона</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3 sm:gap-4">
          {principles.map((item, index) => (
            <article key={item.title} className="alma-paper rounded-[18px] bg-white p-4 ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">{index + 1}</span>
                <h2 className="text-lg font-semibold tracking-tight">{item.title}</h2>
              </div>
              <p className="mt-2 text-sm leading-5 text-neutral-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
