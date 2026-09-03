export default function CollectionsPage() {
  const collections = [
    {
      emoji: "❤️",
      title: "Для свидания",
      places: "7 мест",
      color: "bg-pink-100",
    },
    {
      emoji: "🌿",
      title: "Перезагрузиться",
      places: "5 мест",
      color: "bg-green-100",
    },
    {
      emoji: "🎉",
      title: "Для компании",
      places: "10 мест",
      color: "bg-orange-100",
    },
    {
      emoji: "☕",
      title: "Уютные кофейни",
      places: "12 мест",
      color: "bg-amber-100",
    },
    {
      emoji: "🌇",
      title: "Красивый закат",
      places: "6 мест",
      color: "bg-sky-100",
    },
    {
      emoji: "🍷",
      title: "Вечерние бары",
      places: "9 мест",
      color: "bg-violet-100",
    },
  ];
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-8 py-20">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold">
          Подборки
        </h1>

        <p className="text-neutral-500 mt-4 mb-14 text-lg">
          Выбирай готовые маршруты под своё настроение.
        </p>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {collections.map((collection) => (

            <div
              key={collection.title}
              className="group bg-white rounded-[32px] p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${collection.color}`}
              >
                {collection.emoji}
              </div>

              <h2 className="text-2xl font-bold mt-6">
                {collection.title}
              </h2>

              <p className="text-neutral-500 mt-2">
                {collection.places}
              </p>

              <button
                className="mt-8 rounded-full bg-black text-white px-6 py-3 hover:scale-105 transition"
              >
                Смотреть →
              </button>

            </div>

          ))}

        </div>

      </div>
    </main>
  );
}