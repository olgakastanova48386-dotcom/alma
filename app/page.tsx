import Header from "../components/Header";
import Link from "next/link";
import { places } from "../data/places";

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f4ef]">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-8 pt-40 pb-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <div>

              <p className="uppercase tracking-[0.45em] text-neutral-500 text-sm">
                ALMA
              </p>

              <h1 className="mt-6 text-6xl xl:text-7xl font-bold leading-[1.05]">
                Найди место,
                <br />
                которое подходит
                <br />
                именно тебе
              </h1>

              <p className="mt-8 text-xl text-neutral-600 leading-9 max-w-xl">
                Уютные кофейни, атмосферные рестораны,
                лучшие бары, красивые парки и секретные
                места Санкт-Петербурга.
              </p>

              <div className="flex gap-5 mt-12">

                <Link
                  href="/map"
                  className="rounded-full bg-black text-white px-8 py-4 hover:scale-105 transition"
                >
                  Начать поиск
                </Link>

                <Link
                  href="/collections"
                  className="rounded-full border border-black px-8 py-4 hover:bg-black hover:text-white transition"
                >
                  Подборки
                </Link>

              </div>

            </div>

            <div className="rounded-[45px] overflow-hidden shadow-2xl">

              <img
                src="https://picsum.photos/900/700"
                alt="Санкт-Петербург"
                className="w-full h-[700px] object-cover hover:scale-105 transition duration-700"
              />

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