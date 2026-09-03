export default function MapPage() {
  const places = [
    {
      name: "Skuratov Coffee",
      type: "Кофейня",
      mood: "☕ Спокойно",
    },
    {
      name: "Harvest",
      type: "Ресторан",
      mood: "❤️ Романтика",
    },
    {
      name: "Новая Голландия",
      type: "Парк",
      mood: "🌿 Прогулка",
    },
    {
      name: "Roof Place",
      type: "Смотровая площадка",
      mood: "🌇 Закат",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-32 pb-20">

      <div className="max-w-7xl mx-auto px-8">

        <h1 className="text-5xl font-bold">
          Карта мест
        </h1>

        <p className="text-neutral-500 mt-4 text-lg">
          Подберите место под настроение
        </p>

        <div className="flex flex-wrap gap-4 mt-10">

          <button className="rounded-full bg-black text-white px-6 py-3">
            Все
          </button>

          <button className="rounded-full bg-white px-6 py-3 shadow hover:bg-neutral-100 transition">
            ☕ Кофейни
          </button>

          <button className="rounded-full bg-white px-6 py-3 shadow hover:bg-neutral-100 transition">
            🍽 Рестораны
          </button>

          <button className="rounded-full bg-white px-6 py-3 shadow hover:bg-neutral-100 transition">
            🍸 Бары
          </button>

          <button className="rounded-full bg-white px-6 py-3 shadow hover:bg-neutral-100 transition">
            🌿 Парки
          </button>

        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-12">

          <div className="space-y-5">

            {places.map((place) => (

              <div
                key={place.name}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
              >

                <p className="text-sm text-neutral-500">
                  {place.type}
                </p>

                <h2 className="text-2xl font-semibold mt-2">
                  {place.name}
                </h2>

                <p className="mt-3 text-neutral-600">
                  {place.mood}
                </p>

                <button className="mt-6 rounded-full bg-black text-white px-5 py-3">
                  Подробнее
                </button>

              </div>

            ))}

          </div>

          <div className="lg:col-span-2">

            <div className="h-[700px] rounded-[40px] bg-white shadow-xl flex items-center justify-center">

              <div className="text-center">

                <div className="text-7xl">
                  🗺️
                </div>

                <h2 className="text-4xl font-bold mt-6">
                  Интерактивная карта
                </h2>

                <p className="text-neutral-500 mt-5 text-lg leading-8">
                  Здесь скоро появится настоящая
                  <br />
                  карта Санкт-Петербурга
                  <br />
                  с отмеченными заведениями.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}