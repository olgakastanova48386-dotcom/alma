import Header from "../components/Header";
import Link from "next/link";
import { places } from "../data/places";

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f4ef]">

{/* Hero */}
<section className="relative overflow-hidden bg-gradient-to-b from-[#fdfbf8] to-[#f7f4ef]">
  <div className="max-w-7xl mx-auto px-8 py-28 lg:py-36">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      <div>

        <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm shadow-md text-neutral-600">
          ✨ Открой Санкт-Петербург по-новому
        </span>

        <h1 className="mt-8 text-5xl md:text-6xl xl:text-7xl font-bold leading-tight text-neutral-900">
          Места,
          <br />
          в которые
          <br />
          хочется возвращаться
        </h1>

        <p className="mt-8 text-xl leading-9 text-neutral-600 max-w-xl">
          ALMA помогает находить уютные кофейни,
          атмосферные рестораны, красивые парки
          и секретные места Санкт-Петербурга.
        </p>

        <div className="flex flex-wrap gap-4 mt-12">

          <Link
            href="/map"
            className="rounded-full bg-black text-white px-8 py-4 hover:scale-105 transition-all duration-300"
          >
            Исследовать город
          </Link>

          <Link
            href="/collections"
            className="rounded-full bg-white border border-neutral-300 px-8 py-4 hover:bg-black hover:text-white transition-all duration-300"
          >
            Подборки
          </Link>

        </div>

        <div className="flex gap-12 mt-16">

          <div>
            <p className="text-3xl font-bold">150+</p>
            <span className="text-neutral-500">мест</span>
          </div>

          <div>
            <p className="text-3xl font-bold">40+</p>
            <span className="text-neutral-500">кофеен</span>
          </div>

          <div>
            <p className="text-3xl font-bold">60+</p>
            <span className="text-neutral-500">ресторанов</span>
          </div>

        </div>

      </div>

      <div className="relative">

        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-[#efe6dc] blur-3xl opacity-70"></div>

        <img
          src="https://images.unsplash.com/photo-1520637836862-4d197d17c90a?q=80&w=1600&auto=format&fit=crop"
          alt="Санкт-Петербург"
          className="relative rounded-[40px] shadow-2xl w-full h-[720px] object-cover hover:scale-[1.02] transition duration-700"
        />

      </div>

    </div>

  </div>
</section>
{/* Категории */}
<section className="pb-24">
  <div className="max-w-7xl mx-auto px-8">

    <h2 className="text-4xl font-bold text-center mb-12">
      Что вы ищете сегодня?
    </h2>

    <div className="grid md:grid-cols-3 gap-8">

      <Link
        href="/map"
        className="group bg-white rounded-[32px] p-10 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
      >
        <div className="text-5xl mb-6">☕</div>

        <h3 className="text-2xl font-bold">
          Кофейни
        </h3>

        <p className="mt-4 text-neutral-600">
          Найдите уютное место для работы,
          встречи или отдыха.
        </p>

        <span className="inline-block mt-8 font-semibold group-hover:translate-x-1 transition">
          Смотреть →
        </span>
      </Link>

      <Link
        href="/map"
        className="group bg-white rounded-[32px] p-10 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
      >
        <div className="text-5xl mb-6">🍽️</div>

        <h3 className="text-2xl font-bold">
          Рестораны
        </h3>

        <p className="mt-4 text-neutral-600">
          Для свиданий, семейных ужинов
          и особых вечеров.
        </p>

        <span className="inline-block mt-8 font-semibold group-hover:translate-x-1 transition">
          Смотреть →
        </span>
      </Link>

      <Link
        href="/map"
        className="group bg-white rounded-[32px] p-10 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
      >
        <div className="text-5xl mb-6">🌳</div>

        <h3 className="text-2xl font-bold">
          Парки
        </h3>

        <p className="mt-4 text-neutral-600">
          Лучшие места для прогулок
          и отдыха на свежем воздухе.
        </p>

        <span className="inline-block mt-8 font-semibold group-hover:translate-x-1 transition">
          Смотреть →
        </span>
      </Link>

    </div>

  </div>
</section>
<section className="py-20">
  <div className="max-w-7xl mx-auto px-8">

    <h2 className="text-4xl font-bold mb-10">
      Что ищем сегодня?
    </h2>

    <div className="grid md:grid-cols-3 gap-6">

      <Link
        href="/collections"
        className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition"
      >
        <div className="text-5xl mb-4">☕</div>
        <h3 className="text-2xl font-bold">
          Кофейни
        </h3>
        <p className="mt-3 text-neutral-600">
          Лучшие места для кофе и отдыха.
        </p>
      </Link>

      <Link
        href="/collections"
        className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition"
      >
        <div className="text-5xl mb-4">🍽️</div>
        <h3 className="text-2xl font-bold">
          Рестораны
        </h3>
        <p className="mt-3 text-neutral-600">
          Для свиданий и уютных вечеров.
        </p>
      </Link>

      <Link
        href="/map"
        className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition"
      >
        <div className="text-5xl mb-4">🌳</div>
        <h3 className="text-2xl font-bold">
          Парки
        </h3>
        <p className="mt-3 text-neutral-600">
          Лучшие места для прогулок.
        </p>
      </Link>

    </div>
  </div>
</section>

        {/* Популярные места */}
        <section className="pb-28">

          <div className="max-w-7xl mx-auto px-8">

            <h2 className="text-5xl font-bold mb-14">
              Популярные места
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

              {places.map((place) => (

                <div
                  key={place.id}
                  className="bg-white rounded-[35px] overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                >

                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-8">

                    <p className="text-sm text-neutral-500">
                      {place.category}
                    </p>

                    <h3 className="text-3xl font-bold mt-3">
                      {place.name}
                    </h3>

                    <div className="mt-6 space-y-3 text-neutral-600">
                      <p>😊 {place.mood}</p>
                      <p>💰 {place.budget}</p>
                      <p>👥 {place.company}</p>
                      <p>🕒 {place.time}</p>
                    </div>

                    <Link
                      href={`/place/${place.id}`}
                      className="inline-flex mt-8 rounded-full bg-black text-white px-6 py-3 hover:scale-105 transition"
                    >
                      Подробнее →
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>

      </main>

    </>
  );
}