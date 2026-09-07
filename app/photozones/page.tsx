import Link from "next/link";

const photozones = [
  { name: "Исаакиевская площадь", image: "/images/isaac.jpg", area: "Адмиралтейский район", note: "Монументальная архитектура и открытая перспектива." },
  { name: "Поцелуев мост", image: "/images/kisses-bridge.jpg", area: "Набережная Мойки", note: "Вода, мост и романтичный городской фон." },
  { name: "Новая Голландия", image: "/images/new-holland.jpg", area: "Адмиралтейский район", note: "Кирпичная архитектура, зелень и современная городская среда." },
  { name: "Лахта Центр", image: "/images/lahta-hero.jpg", area: "Приморский район", note: "Современный Петербург и просторные кадры у воды." },
];

export default function PhotozonesPage() {
  return <main className="min-h-screen bg-[#f7f4ef] pt-24 sm:pt-32 pb-20">
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[.22em] text-neutral-500">ALMA · Фотозоны</p>
      <h1 className="mt-4 text-[42px] sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[.98]">Петербург,<br/>который хочется снять</h1>
      <p className="mt-5 max-w-2xl text-base sm:text-xl leading-7 sm:leading-8 text-neutral-500">Красивые точки можно смотреть бесплатно. После покупки маршрута ALMA сможет открыть подробный фотогид: точку съёмки, лучшее время, ракурс и фототочки по пути.</p>

      <div className="mt-9 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {photozones.map((place, index) => <article key={place.name} className="overflow-hidden rounded-[24px] sm:rounded-[28px] bg-white border border-black/5">
          <div className="relative h-[300px] sm:h-[360px]"><img src={place.image} alt={place.name} className="absolute inset-0 h-full w-full object-cover"/><span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs">📸 Фотозона</span></div>
          <div className="p-5"><p className="text-xs text-neutral-400">{place.area}</p><h2 className="mt-2 text-xl font-bold">{place.name}</h2><p className="mt-2 text-sm leading-6 text-neutral-500">{place.note}</p>{index < 2 ? <p className="mt-4 text-xs font-semibold">Бесплатный просмотр</p> : <div className="mt-4 rounded-[16px] bg-[#f2eee8] p-3"><p className="text-xs font-semibold">После покупки маршрута</p><p className="mt-1 text-xs leading-5 text-neutral-500">Точная точка · время · ракурс · что надеть</p></div>}</div>
        </article>)}
      </div>

      <div className="mt-8 rounded-[26px] bg-black p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"><div><p className="text-xs uppercase tracking-[.18em] text-white/45">Фото + маршрут</p><h2 className="mt-2 text-2xl sm:text-3xl font-bold">Фототочки могут стать частью твоего дня</h2><p className="mt-2 text-sm sm:text-base text-white/60">ALMA добавит короткие остановки для фото между основными местами, не превращая прогулку в марафон.</p></div><Link href="/surprise" className="shrink-0 rounded-full bg-white text-black px-6 py-3.5 text-sm font-semibold text-center">✦ Удиви меня</Link></div>
    </section>
  </main>;
}
