import Link from "next/link";

const principles = [
  { number: "01", title: "По настроению", text: "Не просто список заведений. ALMA помогает выбрать место под конкретный день, компанию и настроение." },
  { number: "02", title: "Без лишнего поиска", text: "Фильтры, карта и готовый план собирают подходящие варианты в одном месте — без десятков открытых вкладок." },
  { number: "03", title: "Петербург ближе", text: "Сохраняем места, события и городские пространства, ради которых хочется выйти из дома и увидеть город по-новому." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pb-20 pt-[92px] text-[#171717] sm:pb-28 sm:pt-32">
      <section className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-[#eadfd5] px-5 py-8 sm:rounded-[38px] sm:px-10 sm:py-12 lg:min-h-[430px] lg:px-14 lg:py-14">
          <div className="relative z-10 flex min-h-[300px] max-w-4xl flex-col justify-between sm:min-h-[350px]">
            <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-black/45 sm:text-xs">О проекте</p>
            <div>
              <h1 className="max-w-[1000px] text-[clamp(34px,5.2vw,68px)] font-semibold leading-[.91] tracking-[-.065em]">
                Город должен<br />подходить тебе.
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-6 text-black/60 sm:mt-6 sm:text-base sm:leading-6">
                ALMA — городской гид по Санкт-Петербургу, который помогает решить не «куда вообще сходить», а куда хочется именно сегодня.
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-20 -right-14 h-64 w-64 rounded-full border-[48px] border-white/25 sm:h-96 sm:w-96 sm:border-[70px]" />
          <div className="pointer-events-none absolute right-[18%] top-12 h-24 w-24 rounded-full bg-white/25 blur-2xl sm:h-40 sm:w-40" />
        </div>
      </section>

      <section className="mx-auto grid max-w-[1380px] gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-black/40">Зачем появилась ALMA</p>
        <div className="space-y-6 text-[22px] font-medium leading-[1.25] tracking-[-.025em] sm:text-2xl lg:text-[30px]">
const almaUrl = "https://alma.almacity.workers.dev";

const principles = [
  { title: "Миссия", text: "Помогать быстро находить подходящие места для отдыха, работы и встреч." },
  { title: "Идея", text: "Сделать городской поиск простым, красивым и вдохновляющим." },
  { title: "Ценность", text: "Выбирать места по настроению, а не случайно." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 pb-10 pt-[calc(env(safe-area-inset-top)+88px)] text-black sm:px-6 sm:pb-14 md:pt-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-6 rounded-[26px] bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,.06)] sm:p-7 md:grid-cols-[minmax(0,1fr)_230px] md:gap-9 lg:p-9">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">О проекте</p>
            <h1 className="mt-3 max-w-3xl text-[clamp(30px,6vw,52px)] font-bold leading-[1.02] tracking-[-0.035em]">
              ALMA помогает находить места под твоё настроение
            </h1>
            <div className="mt-4 max-w-3xl space-y-3 text-[14px] leading-6 text-neutral-600 sm:text-[15px] sm:leading-7">
              <p>
                Мы собрали кофейни, рестораны, парки и городские пространства Петербурга в одном месте. ALMA учитывает настроение, бюджет, компанию и время.
              </p>
              <p>
                Наша цель — помочь быстрее открывать новые впечатления и места, в которые хочется возвращаться.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[230px] rounded-[22px] bg-[#f7f4ef] p-4 text-center ring-1 ring-black/5">
            <img src="/alma-qr.svg" alt="QR-код со ссылкой на ALMA" className="mx-auto aspect-square w-full max-w-[170px] rounded-[14px] bg-white p-2" />
            <p className="mt-3 text-sm font-semibold">Открыть ALMA</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">Наведи камеру другого телефона</p>
            <a href={almaUrl} className="mt-3 inline-flex min-h-9 items-center justify-center rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:opacity-80">
              Перейти на сайт
            </a>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {principles.map((item, index) => (
            <article key={item.title} className="rounded-[20px] bg-white p-5 ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">{index + 1}</span>
                <h2 className="text-lg font-semibold tracking-tight">{item.title}</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
          <p>Иногда хочется красиво поужинать. Иногда — долго гулять, взять кофе, побыть одной или придумать день с друзьями.</p>
          <p className="text-black/38">Мы собираем город вокруг таких желаний, а не заставляем тебя подстраиваться под бесконечные каталоги.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[28px] border border-black/[.07] bg-white sm:rounded-[34px] lg:grid-cols-3">
          {principles.map((item, index) => (
            <article key={item.number} className={`p-5 sm:p-6 lg:p-7 ${index ? "border-t border-black/[.07] lg:border-l lg:border-t-0" : ""}`}>
              <span className="text-xs font-semibold text-black/30">{item.number}</span>
              <h2 className="mt-7 text-[22px] font-semibold tracking-[-.04em] sm:text-2xl">{item.title}</h2>
              <p className="mt-3 max-w-sm text-[14px] leading-6 text-black/55 sm:text-[15px]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1380px] px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="flex flex-col gap-7 rounded-[28px] bg-[#dfe8d8] p-6 sm:rounded-[34px] sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-9">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-black/40">Начни с себя</p>
            <h2 className="mt-4 max-w-2xl text-[28px] font-semibold leading-[.98] tracking-[-.05em] sm:text-4xl">Как ты хочешь провести сегодняшний день?</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/#smart-map" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]">Выбрать место</Link>
            <Link href="/route" className="rounded-full border border-black/15 bg-white/55 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white">Создать маршрут</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
