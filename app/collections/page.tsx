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
    <main className="min-h-screen bg-[#f7f4ef] pt-36 pb-20 px-8">

      <div className="max-w-7xl mx-auto">

        <p className="uppercase tracking-[0.45em] text-sm text-neutral-500">
          ALMA
        </p>

        <h1 className="text-6xl font-bold mt-6">
          Подборки
        </h1>

        <p className="text-xl text-neutral-500 mt-6 max-w-2xl leading-9">
          Мы собрали лучшие места Санкт-Петербурга по настроению,
          атмосфере и формату отдыха.
        </p>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-16">

          {collections.map((item) => (

            <div
              key={item.title}
              className={`${item.color} rounded-[35px] p-10 h-80 flex flex-col justify-between shadow-lg hover:scale-[1.03] transition duration-300 cursor-pointer`}
            >

              <div className="text-6xl">
                {item.emoji}
              </div>

              <div>

                <p className="text-lg text-neutral-500">
                  {item.places}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {item.title}
                </h2>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}