import { places as editorialPlaces } from "@/data/places";
import { coffeePlaces } from "@/data/coffeePlaces";
import { restaurantPlaces } from "@/data/restaurantPlaces";
import { dogFriendlyPlaces } from "@/data/dogFriendlyPlaces";
import { drivePlaces } from "@/data/drivePlaces";

export type MapPlace = {
  id: number;
  name: string;
  category: string;
  mood: string;
  budget: string;
  company: string[];
  duration: string;
  image: string;
  lat: number;
  lng: number;
  why: string;
  address: string;
  price: string;
  priceNote: string;
  detailHref: string;
  description?: string;
  gallery?: string[];
  rating?: number;
  ratingScale?: number;
  ratingCount?: number;
  ratingSource?: string;
  dogFriendly?: boolean;
  drive?: boolean;
  driveTags?: string[];
  babyCare?:
    | "Пеленальный столик"
    | "Комната матери и ребёнка"
    | "Детская комната"
    | "Детский стульчик";
  babyCareVerifiedAt?: string;
  menuUrl?: string;
  studentDiscount?: number;
  studentDiscountNote?: string;
  studentDiscountVerifiedAt?: string;
  studentDiscountEndsAt?: string;
  studentDiscountSourceUrl?: string;
};

const hasAlmaRating = (rating: number, scale = 5) =>
  scale === 5 && rating >= 4.5 && rating <= 5;

const demidovGallery = [
  "/images/demidov.jpg",
];

const basePlaces: MapPlace[] = editorialPlaces.map((place) => {
  const demidov = place.id === 4;
  return {
    id: place.id,
    name: place.name,
    category: place.category,
    mood: place.mood,
    budget: place.budget,
    company: place.company,
    duration: place.duration,
    image: demidov ? demidovGallery[0] : place.image,
    lat: place.lat,
    lng: place.lng,
    why: demidov
      ? "Увидеть один из самых выразительных особняков XIX века и интерьеры, связанные с именем Монферрана."
      : place.why,
    address: demidov
      ? "Большая Морская ул., 43, Санкт-Петербург"
      : place.address,
    price: place.price,
    priceNote: place.priceNote,
    detailHref: `/place/${place.id}`,
    description: demidov
      ? "Особняк П. Н. Демидова на Большой Морской улице, 43 построен в 1835–1840 годах по проекту Огюста Монферрана. Это памятник архитектуры с богатыми парадными интерьерами; сегодня здание связано с Посольством Италии. Доступ внутрь зависит от формата мероприятий и экскурсий, поэтому условия посещения лучше проверять заранее."
      : place.description,
    gallery: demidov ? demidovGallery : undefined,
    dogFriendly: place.name === "Севкабель Порт",
  };
});

const coffeeMapPlaces: MapPlace[] = coffeePlaces
  .filter((p) => hasAlmaRating(p.rating))
  .map((p, index) => {
    const id = 1001 + index;
    return {
      id,
      name: p.name,
      category: "Кофейня",
      mood: "Спокойно",
      budget: p.averageBill,
      company: ["Один", "Пара", "Друзья"],
      duration: "До 1 часа",
      image: p.image ?? "",
      lat: p.lat,
      lng: p.lng,
      why: `★ ${p.rating.toFixed(1)} / 5`,
      address: p.address,
      price: p.averageBill,
      priceNote: "Средний чек",
      detailHref: `/place/${id}`,
      rating: p.rating,
      ratingScale: 5,
      ratingCount: p.ratingCount,
      ratingSource: p.ratingSource,
      dogFriendly: Boolean(p.dogFriendly),
      menuUrl: p.menuUrl ?? p.website,
    };
  });

const restaurantMapPlaces: MapPlace[] = restaurantPlaces
  .filter((p) => hasAlmaRating(p.rating))
  .map((p, index) => {
    const id = 2001 + index;
    return {
      id,
      name: p.name,
      category: "Ресторан",
      mood: "Вкусно поесть",
      budget: p.averageBill ?? "1500–5000 ₽",
      company: ["Пара", "Друзья", "Семья"],
      duration: "1–2 часа",
      image: p.image ?? "",
      lat: p.lat,
      lng: p.lng,
      why: `★ ${p.rating.toFixed(1)} / 5`,
      address: p.address,
      price: p.averageBill ?? "Чек уточняется",
      priceNote: "Средний чек",
      detailHref: `/place/${id}`,
      rating: p.rating,
      ratingScale: 5,
      ratingCount: p.ratingCount,
      ratingSource: p.ratingSource,
      dogFriendly: Boolean(p.dogFriendly),
      babyCare: p.babyCare,
      babyCareVerifiedAt: p.babyCareVerifiedAt,
      menuUrl: p.website ?? p.sourceUrl,
    };
  });

const dogMapPlaces: MapPlace[] = dogFriendlyPlaces
  .filter((p) => hasAlmaRating(p.rating, p.ratingScale))
  .filter(
    (d) =>
      ![...basePlaces, ...coffeeMapPlaces, ...restaurantMapPlaces].some(
        (p) => p.name.toLowerCase() === d.name.toLowerCase(),
      ),
  )
  .map((p, index) => {
    const id = 3001 + index;
    return {
      id,
      name: p.name,
      category: p.category,
      mood: "С питомцем",
      budget: p.budget,
      company: ["Один", "Пара", "Друзья", "Семья"],
      duration: "1–2 часа",
      image: p.imageUrl ?? "",
      lat: p.lat,
      lng: p.lng,
      why: `🐾 Dog Friendly · ★ ${p.rating.toFixed(1)} / 5`,
      address: p.address,
      price: p.budget,
      priceNote:
        p.category === "Городское пространство"
          ? "Стоимость посещения"
          : "Средний чек",
      detailHref: `/place/${id}`,
      rating: p.rating,
      ratingScale: 5,
      ratingCount: p.ratingCount,
      ratingSource: p.ratingSource,
      dogFriendly: true,
      babyCare: p.babyCare,
      menuUrl:
        p.category === "Городское пространство" ? undefined : p.sourceUrl,
    };
  });

const driveMapPlaces: MapPlace[] = drivePlaces
  .filter((p) => hasAlmaRating(p.rating, p.ratingScale))
  .map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    mood: "Драйв",
    budget: p.price,
    company: ["Один", "Пара", "Друзья"],
    duration: "2–4 часа",
    image: p.image,
    lat: p.lat,
    lng: p.lng,
    why: p.note,
    address: p.address,
    price: p.price,
    priceNote: "Ориентир по стоимости",
    detailHref: `/place/${p.id}`,
    rating: p.rating,
    ratingScale: 5,
    ratingCount: p.ratingCount,
    ratingSource: p.ratingSource,
    drive: true,
    driveTags: p.tags,
  }));

const photoMapPlaces: MapPlace[] = [
  {
    id: 5001,
    name: "Дом Бака",
    category: "Фотолокация",
    mood: "Вдохновиться",
    budget: "Бесплатно",
    company: ["Один", "Пара", "Друзья"],
    duration: "До 1 часа",
    image: "/place-images/5001.jpg",
    lat: 59.944086,
    lng: 30.357996,
    why: "Воздушные галереи, исторический двор и выразительная архитектура.",
    address: "Кирочная ул., 24",
    price: "Бесплатно",
    priceNote: "Доступ во двор может зависеть от правил дома",
    detailHref: "/place/5001",
    rating: 4.9,
    ratingScale: 5,
    ratingCount: 1445,
    ratingSource: "Яндекс Карты",
  },
  {
    id: 5002,
    name: "Ракета",
    category: "Падел-клуб",
    mood: "Драйв",
    budget: "Цена уточняется",
    company: ["Один", "Пара", "Друзья"],
    duration: "1–2 часа",
    image: "/images/падл адрес ракета кожевенная линия, 27.jpg",
    lat: 59.923057,
    lng: 30.248787,
    why: "Падел-корты в индустриальном интерьере с сильной геометрией кадра.",
    address: "Кожевенная линия, 27, корп. 1",
    price: "Цена уточняется",
    priceNote: "Стоимость зависит от времени и формата игры",
    detailHref: "/place/5002",
    rating: 5,
    ratingScale: 5,
    ratingCount: 12,
    ratingSource: "2ГИС",
    drive: true,
    driveTags: ["Активный отдых", "С друзьями"],
  },
];

const studentDiscountPlaces: MapPlace[] = [
  {
    id: 6001,
    name: "Meren Coffee",
    category: "Кофейня",
    mood: "Спокойно",
    budget: "≈ 300–500 ₽",
    company: ["Один", "Пара", "Друзья"],
    duration: "До 1 часа",
    image: "https://static.tildacdn.com/tild3634-6531-4934-b332-383734386365/merencoffee.jpg",
    lat: 59.9257,
    lng: 30.3867,
    why: "🎓 Скидка студентам 20% · подтверждено ALMA",
    address: "Тележная ул., 32, Санкт-Петербург",
    price: "≈ 300–500 ₽",
    priceNote: "Средний чек",
    detailHref: "/place/6001",
    rating: 5.0,
    ratingScale: 5,
    ratingCount: 948,
    ratingSource: "Яндекс Карты",
    studentDiscount: 20,
    studentDiscountNote: "Покажи студенческий / подтверди обучение и получи скидку 20%.",
    studentDiscountVerifiedAt: "18.09.2026",
    studentDiscountSourceUrl: "https://merencoffee.ru/",
    menuUrl: "https://merencoffee.ru/",
  },
  {
    id: 6002,
    name: "Сказки Шахерезады",
    category: "Ресторан",
    mood: "Вкусно поесть",
    budget: "≈ 1 000–1 500 ₽",
    company: ["Один", "Пара", "Друзья"],
    duration: "1–2 часа",
    image: "https://skazkishaherezady.ru/wp-content/uploads/2022/09/zal.jpg",
    lat: 59.8519,
    lng: 30.3219,
    why: "🎓 Скидка студентам 20% · подтверждено ALMA",
    address: "Московский пр., 193, Санкт-Петербург",
    price: "≈ 1 000–1 500 ₽",
    priceNote: "Средний чек",
    detailHref: "/place/6002",
    studentDiscount: 20,
    studentDiscountNote: "−20% при предъявлении студенческого билета. Действует в любое время работы кафе.",
    studentDiscountVerifiedAt: "18.09.2026",
    studentDiscountSourceUrl: "https://skazkishaherezady.ru/studentam_skidka",
  },
  {
    id: 6003,
    name: "Сказки Шахерезады",
    category: "Ресторан",
    mood: "Вкусно поесть",
    budget: "≈ 1 000–1 500 ₽",
    company: ["Один", "Пара", "Друзья"],
    duration: "1–2 часа",
    image: "https://skazkishaherezady.ru/wp-content/uploads/2022/09/zal.jpg",
    lat: 59.8513,
    lng: 30.2686,
    why: "🎓 Скидка студентам 20% · подтверждено ALMA",
    address: "Ленинский пр., 161, Санкт-Петербург",
    price: "≈ 1 000–1 500 ₽",
    priceNote: "Средний чек",
    detailHref: "/place/6003",
    studentDiscount: 20,
    studentDiscountNote: "−20% при предъявлении студенческого билета. Действует в любое время работы кафе.",
    studentDiscountVerifiedAt: "18.09.2026",
    studentDiscountSourceUrl: "https://skazkishaherezady.ru/studentam_skidka",
  },
  {
    id: 6004, name: "Кофейная роща", category: "Кофейня", mood: "Спокойно",
    budget: "≈ 300–500 ₽", company: ["Один","Пара","Друзья"], duration: "До 1 часа",
    image: "https://avatars.mds.yandex.net/get-altay/13206613/2a00000190c52b8a93c7d9b30c6c07b490d8/XXXL", lat: 59.9693, lng: 30.3166,
    why: "🎓 Скидка студентам 7% · подтверждено ALMA",
    address: "ул. Рентгена, 15/31, Санкт-Петербург", price: "≈ 300–500 ₽", priceNote: "Средний чек",
    detailHref: "/place/6004", studentDiscount: 7,
    studentDiscountNote: "−7% на кофе при предъявлении студенческого билета.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://kofejnaja-roscha.clients.site/",
  },
  {
    id: 6005, name: "Good Itea", category: "Кафе", mood: "Вкусно поесть",
    budget: "≈ 500–800 ₽", company: ["Один","Пара","Друзья"], duration: "До 1 часа",
    image: "https://avatars.mds.yandex.net/get-altay/13719816/2a00000191c5528c45b35d12f1a7e72546dc/XXXL", lat: 59.9264, lng: 30.3189,
    why: "🎓 Скидка студентам 10% · подтверждено ALMA",
    address: "Гороховая ул., 45, Санкт-Петербург", price: "≈ 500–800 ₽", priceNote: "Средний чек",
    detailHref: "/place/6005", studentDiscount: 10,
    studentDiscountNote: "−10% при предъявлении студенческого билета. Акция заявлена до 01.12.2026.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountEndsAt: "01.12.2026",
    studentDiscountSourceUrl: "https://good-itea.clients.site/",
  },
  {
    id: 6006, name: "Пышечка", category: "Пышечная", mood: "Вкусно поесть",
    budget: "≈ 200–400 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "https://avatars.mds.yandex.net/get-altay/14020851/2a00000192d87515b2f632b613e908ad95c8/XXXL", lat: 59.9261, lng: 30.3201,
    why: "🎓 Скидка студентам 10% · подтверждено ALMA",
    address: "наб. канала Грибоедова, 56–58, Санкт-Петербург", price: "≈ 200–400 ₽", priceNote: "Средний чек",
    detailHref: "/place/6006", studentDiscount: 10,
    studentDiscountNote: "−10% при предъявлении студенческого билета. Условия лучше уточнить перед заказом.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://kudago.com/spb/list/studencheskij-kontent-samyie/",
  },
  {
    id: 6007, name: "Pho’n’Roll", category: "Ресторан", mood: "Вкусно поесть",
    budget: "≈ 900–1 500 ₽", company: ["Один", "Пара", "Друзья"], duration: "1–2 часа",
    image: "/place-images/6007.jpg", lat: 59.9369, lng: 30.3526,
    why: "🎓 Скидка студентам 10% · подтверждено ALMA",
    address: "ул. Жуковского, Санкт-Петербург", price: "≈ 900–1 500 ₽", priceNote: "Средний чек",
    detailHref: "/place/6007", studentDiscount: 10,
    studentDiscountNote: "−10% на основное меню по студенческому. Не действует на ланчи и специальные предложения.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://tomesto.ru/spb/promos/ostalnye/skidka-ot-10-dlya-studentov",
  },
  {
    id: 6008, name: "Pho’n’Roll Антелово", category: "Кафе", mood: "Вкусно поесть",
    budget: "≈ 700–1 200 ₽", company: ["Один", "Пара", "Друзья"], duration: "1–2 часа",
    image: "/place-images/6008.jpg", lat: 59.9627, lng: 30.4438,
    why: "🎓 Скидка студентам 15% · подтверждено ALMA",
    address: "Чудская ул., Санкт-Петербург", price: "≈ 700–1 200 ₽", priceNote: "Средний чек",
    detailHref: "/place/6008", studentDiscount: 15,
    studentDiscountNote: "−15% на основное меню по студенческому. Не действует на ланчи и специальные предложения.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://tomesto.ru/spb/promos/ostalnye/skidka-ot-10-dlya-studentov",
  },
  {
    id: 6009, name: "Такояки", category: "Кафе", mood: "Вкусно поесть",
    budget: "≈ 500–900 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6009.jpg", lat: 59.9327, lng: 30.3474,
    why: "🎓 Есть скидка студентам · подтверждено ALMA",
    address: "Санкт-Петербург, Центральный район", price: "≈ 500–900 ₽", priceNote: "Средний чек",
    detailHref: "/place/6009", studentDiscount: 10,
    studentDiscountNote: "Скидка для студентов по студенческому билету. Процент и условия уточни перед заказом.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6010, name: "Vлаvаше — центр", category: "Быстрое питание", mood: "Вкусно поесть",
    budget: "≈ 350–550 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6010.jpg", lat: 59.9276, lng: 30.3471,
    why: "🎓 Есть скидка студентам · подтверждено ALMA",
    address: "Санкт-Петербург, Центральный район", price: "≈ 350–550 ₽", priceNote: "Средний чек",
    detailHref: "/place/6010", studentDiscount: 10,
    studentDiscountNote: "Скидка для студентов и военнослужащих. Покажи студенческий; точные условия уточни на кассе.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6011, name: "Vлаvаше — Петроградская", category: "Быстрое питание", mood: "Вкусно поесть",
    budget: "≈ 350–550 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6011.jpg", lat: 59.9662, lng: 30.3115,
    why: "🎓 Есть скидка студентам · подтверждено ALMA",
    address: "Санкт-Петербург, Петроградский район", price: "≈ 350–550 ₽", priceNote: "Средний чек",
    detailHref: "/place/6011", studentDiscount: 10,
    studentDiscountNote: "Скидка для студентов и военнослужащих. Покажи студенческий; точные условия уточни на кассе.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6012, name: "Vлаvаше — Васильевский остров", category: "Быстрое питание", mood: "Вкусно поесть",
    budget: "≈ 350–550 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6012.jpg", lat: 59.9427, lng: 30.2784,
    why: "🎓 Есть скидка студентам · подтверждено ALMA",
    address: "Санкт-Петербург, Василеостровский район", price: "≈ 350–550 ₽", priceNote: "Средний чек",
    detailHref: "/place/6012", studentDiscount: 10,
    studentDiscountNote: "Скидка для студентов и военнослужащих. Покажи студенческий; точные условия уточни на кассе.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6013, name: "Шаверно — Салова", category: "Быстрое питание", mood: "Вкусно поесть",
    budget: "≈ 350–450 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6013.jpg", lat: 59.8839, lng: 30.3662,
    why: "🎓 Есть скидка студентам · подтверждено ALMA",
    address: "ул. Салова, 61, Санкт-Петербург", price: "≈ 350–450 ₽", priceNote: "Средний чек",
    detailHref: "/place/6013", studentDiscount: 10,
    studentDiscountNote: "Скидка для студентов по студенческому билету. Точные условия уточни на кассе.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6014, name: "Шаверно — Пулковская", category: "Быстрое питание", mood: "Вкусно поесть",
    budget: "≈ 350–450 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6014.jpg", lat: 59.8422, lng: 30.3494,
    why: "🎓 Есть скидка студентам · подтверждено ALMA",
    address: "Пулковская ул., 10, Санкт-Петербург", price: "≈ 350–450 ₽", priceNote: "Средний чек",
    detailHref: "/place/6014", studentDiscount: 10,
    studentDiscountNote: "Скидка для студентов по студенческому билету. Точные условия уточни на кассе.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6015, name: "Шаверно — Парнас", category: "Быстрое питание", mood: "Вкусно поесть",
    budget: "≈ 350–450 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6015.jpg", lat: 60.0677, lng: 30.3333,
    why: "🎓 Есть скидка студентам · подтверждено ALMA",
    address: "ул. Фёдора Абрамова, 8, Санкт-Петербург", price: "≈ 350–450 ₽", priceNote: "Средний чек",
    detailHref: "/place/6015", studentDiscount: 10,
    studentDiscountNote: "Скидка для студентов по студенческому билету. Точные условия уточни на кассе.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6016, name: "Uppetit — центр", category: "Кафе", mood: "Вкусно поесть",
    budget: "≈ 290–390 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6016.jpg", lat: 59.9344, lng: 30.3351,
    why: "🎓 Скидка студентам 10% · подтверждено ALMA",
    address: "Санкт-Петербург, Центральный район", price: "≈ 290–390 ₽", priceNote: "Средний чек",
    detailHref: "/place/6016", studentDiscount: 10,
    studentDiscountNote: "−10% для студентов при предъявлении студенческого билета.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6017, name: "Uppetit — Московский район", category: "Кафе", mood: "Вкусно поесть",
    budget: "≈ 290–390 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6017.jpg", lat: 59.8791, lng: 30.3191,
    why: "🎓 Скидка студентам 10% · подтверждено ALMA",
    address: "Санкт-Петербург, Московский район", price: "≈ 290–390 ₽", priceNote: "Средний чек",
    detailHref: "/place/6017", studentDiscount: 10,
    studentDiscountNote: "−10% для студентов при предъявлении студенческого билета.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6018, name: "Wahaha — центр", category: "Кофейня", mood: "Спокойно",
    budget: "≈ 400–700 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6018.jpg", lat: 59.9293, lng: 30.3391,
    why: "🎓 Есть скидка студентам · подтверждено ALMA",
    address: "Санкт-Петербург, Центральный район", price: "≈ 400–700 ₽", priceNote: "Средний чек",
    detailHref: "/place/6018", studentDiscount: 10,
    studentDiscountNote: "Скидка на напитки для студентов. Покажи студенческий; процент уточни перед заказом.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6019, name: "Wahaha — Васильевский остров", category: "Кофейня", mood: "Спокойно",
    budget: "от 200 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6019.jpg", lat: 59.9434, lng: 30.2846,
    why: "🎓 Есть скидка студентам · подтверждено ALMA",
    address: "Санкт-Петербург, Василеостровский район", price: "от 200 ₽", priceNote: "Средний чек",
    detailHref: "/place/6019", studentDiscount: 10,
    studentDiscountNote: "Скидка на напитки для студентов. Покажи студенческий; процент уточни перед заказом.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
  {
    id: 6020, name: "РестоШава", category: "Быстрое питание", mood: "Вкусно поесть",
    budget: "≈ 400–600 ₽", company: ["Один", "Пара", "Друзья"], duration: "До 1 часа",
    image: "/place-images/6020.jpg", lat: 59.9196, lng: 30.3555,
    why: "🎓 Есть скидка студентам · подтверждено ALMA",
    address: "Санкт-Петербург, Центральный район", price: "≈ 400–600 ₽", priceNote: "Средний чек",
    detailHref: "/place/6020", studentDiscount: 10,
    studentDiscountNote: "Скидка для студентов по студенческому билету. Процент и условия уточни на кассе.",
    studentDiscountVerifiedAt: "18.09.2026", studentDiscountSourceUrl: "https://yandex.ru/maps/discovery/podborka_eda_skidka-dlya-studentov_sankt-peterburg-2/",
  },
];

export const mapPlaces: MapPlace[] = [
  ...basePlaces,
  ...coffeeMapPlaces,
  ...restaurantMapPlaces,
  ...dogMapPlaces,
  ...driveMapPlaces,
  ...photoMapPlaces,
  ...studentDiscountPlaces,
];
