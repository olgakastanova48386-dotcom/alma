import Link from "next/link";

const email = "olgakastanova48386@gmail.com";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-32 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
          ALMA · Правовая информация
        </p>

        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          Правовая информация
        </h1>

        <p className="mt-5 max-w-3xl text-neutral-600 text-base sm:text-lg leading-8">
          Здесь собраны правила использования ALMA, информация об обработке данных,
          пользовательском контенте, жалобах и порядке связи с владельцем сервиса.
        </p>

        <div className="mt-10 grid gap-5">
          <section className="rounded-[28px] bg-white border border-black/5 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">1. Владелец сервиса</h2>
            <div className="mt-4 text-neutral-600 leading-7 space-y-1">
              <p>ИП Прибыткова Ольга Алексеевна</p>
              <p>ИНН: 783827717569</p>
              <p>ОГРНИП: 323784700226902</p>
              <p>Дата государственной регистрации: 17.07.2023</p>
              <p>Регион: Санкт-Петербург, Российская Федерация</p>
              <p>
                Email для юридических обращений: {" "}
                <a className="underline" href={`mailto:${email}`}>{email}</a>
              </p>
            </div>
          </section>

          <section className="rounded-[28px] bg-white border border-black/5 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">2. Статус информации ALMA</h2>
            <div className="mt-4 text-neutral-600 leading-7 space-y-4">
              <p>
                ALMA — информационный сервис о местах Санкт-Петербурга. Если прямо не
                указано иное, ALMA не является владельцем, продавцом или исполнителем
                услуг конкретного заведения и не заключает договор от его имени.
              </p>
              <p>
                Цены, рейтинги, часы работы, программы, правила посещения и условия
                Dog Friendly могут меняться. Перед поездкой пользователь должен
                проверить критичную для него информацию у соответствующего заведения.
              </p>
              <p>
                Там, где возможно, ALMA указывает дату проверки и источник сведений,
                чтобы отделять проверенную редакцией информацию от пользовательских
                сообщений.
              </p>
            </div>
          </section>

          <section id="privacy" className="scroll-mt-32 rounded-[28px] bg-white border border-black/5 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">3. Персональные данные</h2>
            <div className="mt-4 text-neutral-600 leading-7 space-y-4">
              <p>
                Оператором персональных данных, обрабатываемых непосредственно ALMA,
                является ИП Прибыткова Ольга Алексеевна.
              </p>
              <p>
                На текущем этапе функциональность аккаунтов, публикации отзывов и
                пользовательских цен находится в разработке. До запуска таких функций
                ALMA не будет собирать данные через формы, которые ещё не введены в
                эксплуатацию.
              </p>
              <p>
                Перед запуском регистрации будет опубликована отдельная подробная
                Политика обработки персональных данных с перечнем целей обработки,
                категорий данных, сроков хранения, оснований обработки, получателей,
                используемых технических сервисов и порядка реализации прав субъекта.
              </p>
              <p>
                Для обращений по вопросам персональных данных используйте {" "}
                <a className="underline" href={`mailto:${email}`}>{email}</a>.
              </p>
            </div>
          </section>

          <section id="reviews" className="scroll-mt-32 rounded-[28px] bg-white border border-black/5 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">4. Отзывы и пользовательские цены</h2>
            <div className="mt-4 text-neutral-600 leading-7 space-y-4">
              <p>
                После запуска пользовательских публикаций автор будет отвечать за
                содержание своего отзыва или сообщения о цене и должен публиковать
                сведения добросовестно, без оскорблений, угроз, спама, незаконного
                контента и персональных данных третьих лиц без законного основания.
              </p>
              <p>
                Пользовательская цена не будет автоматически выдаваться за официальную
                цену заведения. ALMA будет отдельно обозначать источник и статус такой
                информации, а спорные сведения смогут направляться на проверку.
              </p>
              <p>
                ALMA оставляет за собой право скрыть или удалить материал, если есть
                основания полагать, что он нарушает закон, права третьих лиц или правила
                сервиса, а также запросить дополнительную проверку сведений.
              </p>
            </div>
          </section>

          <section id="complaints" className="scroll-mt-32 rounded-[28px] bg-white border border-black/5 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">5. Жалобы и исправление информации</h2>
            <div className="mt-4 text-neutral-600 leading-7 space-y-4">
              <p>
                Если вы обнаружили неверную цену, адрес, режим работы, рейтинг,
                Dog Friendly-правила, закрытое заведение или другую ошибку, сообщите об
                этом на {" "}
                <a className="underline" href={`mailto:${email}`}>{email}</a>.
              </p>
              <p>
                В обращении желательно указать название места, суть ошибки, ссылку на
                страницу ALMA и, при наличии, источник актуальной информации. Это
                ускорит проверку и корректировку данных.
              </p>
              <p>
                После запуска отзывов на сайте появится отдельная функция жалобы на
                пользовательский материал.
              </p>
            </div>
          </section>

          <section id="rightsholders" className="scroll-mt-32 rounded-[28px] bg-white border border-black/5 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">6. Правообладателям</h2>
            <div className="mt-4 text-neutral-600 leading-7 space-y-4">
              <p>
                Правообладатель может обратиться по вопросу фотографии, текста,
                товарного знака или иного объекта, размещённого в ALMA, по адресу {" "}
                <a className="underline" href={`mailto:${email}`}>{email}</a>.
              </p>
              <p>
                Укажите объект, страницу, основание обращения и способ связи. ALMA
                рассмотрит обращение и при наличии достаточных оснований ограничит
                доступ к спорному материалу или скорректирует его.
              </p>
            </div>
          </section>

          <section className="rounded-[28px] bg-[#111] text-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">7. Важно</h2>
            <p className="mt-4 text-white/70 leading-7">
              Этот раздел описывает текущую модель сервиса. При запуске аккаунтов,
              мобильного приложения, бронирования, платных функций или иных новых
              способов обработки данных документы ALMA должны обновляться до запуска
              соответствующей функции.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/" className="inline-flex rounded-full bg-black text-white px-5 py-3 text-sm font-medium">
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
