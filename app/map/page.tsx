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
    key={place.id}
    className="group bg-white rounded-[36px] overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
  >

    <div className="overflow-hidden">

      <img
        src={place.image}
        alt={place.name}
        className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
      />

      <div className="absolute mt-4 ml-4 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium">
        {place.category}
      </div>

    </div>

    <div className="p-8">

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-3xl font-bold">
            {place.name}
          </h3>

          <p className="text-yellow-500 mt-2">
            ★★★★★
            <span className="text-neutral-500 ml-2">
              4.9
            </span>
          </p>

        </div>

      </div>

      <div className="mt-6 grid gap-3 text-neutral-600">

        <p>😊 {place.mood}</p>
        <p>💰 {place.budget}</p>
        <p>👥 {place.company}</p>
        <p>🕒 {place.time}</p>

      </div>

      <Link
        href={`/place/${place.id}`}
        className="inline-flex items-center gap-2 mt-8 font-semibold"
      >
        Подробнее

        <span className="group-hover:translate-x-1 transition">
          →
        </span>

      </Link>

    </div>

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