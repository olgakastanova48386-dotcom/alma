export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-36 px-8">
      <div className="max-w-5xl mx-auto">

        <p className="uppercase tracking-[0.4em] text-neutral-500 text-sm">
          О проекте
        </p>

        <h1 className="mt-6 text-6xl font-bold leading-tight">
          ALMA помогает
          <br />
          находить места,
          <br />
          которые подходят
          <br />
          именно тебе
        </h1>

        <div className="mt-12 space-y-8 text-lg text-neutral-600 leading-9">
          <p>
            Мы верим, что выбор места — это не просто поиск ближайшего кафе
            или ресторана. Настроение, атмосфера, музыка, интерьер и даже
            погода делают каждый визит особенным.
          </p>

          <p>
            ALMA объединяет красивые кофейни, рестораны, бары, парки и другие
            локации в одном приложении, чтобы каждый человек мог найти место,
            соответствующее своему настроению.
          </p>

          <p>
            Наша цель — создать современный городской гид, который помогает
            открывать новые впечатления и любимые места быстрее и проще.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">🎯 Миссия</h3>
            <p className="text-neutral-600">
              Помочь каждому человеку находить идеальные места для отдыха,
              работы и встреч.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">🌍 Идея</h3>
            <p className="text-neutral-600">
              Сделать поиск заведений максимально простым, красивым и
              вдохновляющим.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">💛 Ценность</h3>
            <p className="text-neutral-600">
              Каждое место должно приносить эмоции, а не быть случайным
              выбором.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}