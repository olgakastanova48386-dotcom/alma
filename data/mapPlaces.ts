import { places as editorialPlaces } from "@/data/places";
import { coffeePlaces } from "@/data/coffeePlaces";
import { confirmedSafetyPlaces, restaurantPlaces } from "@/data/restaurantPlaces";
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
  babyCareDetails?: string[];
  menuUrl?: string;
  studentDiscount?: number;
  studentDiscountNote?: string;
  studentDiscountVerifiedAt?: string;
  studentDiscountEndsAt?: string;
  studentDiscountSourceUrl?: string;
  safePlace?: boolean;
  safePlaceCode?: string;
  safePlaceHelp?: string;
  safePlaceVerifiedAt?: string;
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
    id: 5003,
    name: "Кафе Зингер",
    category: "Кафе",
    mood: "Вдохновиться",
    budget: "≈ 1 000–2 500 ₽",
    company: ["Один", "Пара", "Друзья", "Семья"],
    duration: "До 1 часа",
    image: "/images/кафе зингер.jpg",
    lat: 59.9358,
    lng: 30.325875,
    why: "Арочные окна с видом на Казанский собор — одна из самых узнаваемых фотолокаций Невского проспекта.",
    address: "Невский проспект, 28, Санкт-Петербург",
    price: "≈ 1 000–2 500 ₽",
    priceNote: "Средний чек",
    detailHref: "/place/5003",
    rating: 5,
    ratingScale: 5,
    ratingCount: 5178,
    ratingSource: "Яндекс Карты",
  },
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
    name: "Падел-клуб «Ракета»",
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


const familyMapPlaces: MapPlace[] = [
  {
    id: 7001, name: "Игристые", category: "Ресторан", mood: "Вкусно поесть",
    budget: "≈ 1 000–2 500 ₽", company: ["Пара","Друзья","Семья"], duration: "1–2 часа",
    image: "", lat: 59.92725, lng: 30.31668,
    why: "👶 Детская комната и детские стульчики · проверено 20.09.2026",
    address: "пер. Гривцова, 13/11, Санкт-Петербург", price: "≈ 1 000–2 500 ₽", priceNote: "Средний чек",
    detailHref: "/place/7001", rating: 4.5, ratingScale: 5, ratingCount: 195, ratingSource: "Google",
    babyCare: "Детская комната", babyCareDetails: ["Детская комната", "Детские стульчики"], babyCareVerifiedAt: "20.09.2026",
  },
  {
    id: 7002, name: "Kira", category: "Ресторан", mood: "Вкусно поесть",
    budget: "≈ 3 000–4 000 ₽", company: ["Пара","Друзья","Семья"], duration: "1–2 часа",
    image: "", lat: 59.9393, lng: 30.3901,
    why: "👶 Детская комната и детские стульчики · проверено 20.09.2026",
    address: "Кирочная ул., 67, стр. 2, Санкт-Петербург", price: "≈ 3 000–4 000 ₽", priceNote: "Средний чек",
    detailHref: "/place/7002",
    babyCare: "Детская комната", babyCareDetails: ["Детская комната", "Детские стульчики"], babyCareVerifiedAt: "20.09.2026",
  },
  {
    id: 7003, name: "Вкусновица", category: "Ресторан", mood: "Вкусно поесть",
    budget: "≈ 1 500–2 000 ₽", company: ["Пара","Друзья","Семья"], duration: "1–2 часа",
    image: "", lat: 59.940151, lng: 30.418366,
    why: "👶 Детская комната и детские стульчики · проверено 20.09.2026",
    address: "Брантовская дорога, 3, ТРЦ «Охта Молл», Санкт-Петербург", price: "≈ 1 500–2 000 ₽", priceNote: "Средний чек",
    detailHref: "/place/7003", rating: 4.5, ratingScale: 5, ratingCount: 851, ratingSource: "Google",
    babyCare: "Детская комната", babyCareDetails: ["Детская комната", "Детские стульчики"], babyCareVerifiedAt: "20.09.2026",
  },
  {
    id: 7004, name: "Птичий двор", category: "Ресторан", mood: "Вкусно поесть",
    budget: "≈ 1 000–4 000 ₽", company: ["Пара","Друзья","Семья"], duration: "1–2 часа",
    image: "", lat: 59.986281, lng: 30.20357,
    why: "👶 Детская комната и детские стульчики · проверено 20.09.2026",
    address: "ул. Савушкина, 126, ТЦ Atlantic City, Санкт-Петербург", price: "≈ 1 000–4 000 ₽", priceNote: "Средний чек",
    detailHref: "/place/7004", rating: 4.3, ratingScale: 5, ratingCount: 527, ratingSource: "Google",
    babyCare: "Детская комната", babyCareDetails: ["Детская комната", "Детские стульчики"], babyCareVerifiedAt: "20.09.2026",
  },
  {
    id: 7005, name: "ТРЦ Галерея", category: "Городское пространство", mood: "С семьёй",
    budget: "Бесплатно", company: ["Один","Пара","Друзья","Семья"], duration: "1–2 часа",
    image: "", lat: 59.9278, lng: 30.3601,
    why: "👶 Комнаты матери и ребёнка с пеленальными столиками · проверено 20.09.2026",
    address: "Лиговский проспект, 30А, Санкт-Петербург", price: "Бесплатно", priceNote: "Детские сервисы",
    detailHref: "/place/7005",
    babyCare: "Комната матери и ребёнка", babyCareDetails: ["Комната матери и ребёнка", "Пеленальный столик", "Детская зона на фудкорте"], babyCareVerifiedAt: "20.09.2026",
  },
];

const moreFamilyMapPlaces: MapPlace[] = [
  { id: 7006, name: "Баклажан · Галерея", category: "Ресторан", mood: "Вкусно поесть", budget: "≈ 1 500–3 000 ₽", company: ["Пара","Друзья","Семья"], duration: "1–2 часа", image: "", lat: 59.9275, lng: 30.3602, why: "👶 Детская комната, детские стульчики и няня", address: "Лиговский пр., 30А, ТРЦ «Галерея», 4 этаж", price: "≈ 1 500–3 000 ₽", priceNote: "Средний чек", detailHref: "/place/7006", babyCare: "Детская комната", babyCareDetails: ["Детская комната","Детские стульчики","Няня"], babyCareVerifiedAt: "20.09.2026" },
  { id: 7007, name: "Дети на кухне · Московский рынок", category: "Ресторан", mood: "Вкусно поесть", budget: "≈ 1 500–2 000 ₽", company: ["Пара","Друзья","Семья"], duration: "1–2 часа", image: "", lat: 59.8797, lng: 30.3186, why: "👶 Детская комната и детские стульчики", address: "ул. Решетникова, 12, Московский рынок", price: "≈ 1 500–2 000 ₽", priceNote: "Средний чек", detailHref: "/place/7007", babyCare: "Детская комната", babyCareDetails: ["Детская комната","Детские стульчики","Детское меню"], babyCareVerifiedAt: "20.09.2026" },
  { id: 7008, name: "Пахвала · Охта Молл", category: "Ресторан", mood: "Вкусно поесть", budget: "≈ 1 500–3 000 ₽", company: ["Пара","Друзья","Семья"], duration: "1–2 часа", image: "", lat: 59.9420, lng: 30.4178, why: "👶 Детская комната, стульчики и няня по выходным", address: "Брантовская дорога, 3, ТРЦ «Охта Молл»", price: "≈ 1 500–3 000 ₽", priceNote: "Средний чек", detailHref: "/place/7008", babyCare: "Детская комната", babyCareDetails: ["Детская комната","Детские стульчики","Няня по выходным","Детское меню"], babyCareVerifiedAt: "20.09.2026" },
  { id: 7009, name: "Матисов", category: "Ресторан", mood: "Вкусно поесть", budget: "≈ 1 500–3 000 ₽", company: ["Пара","Друзья","Семья"], duration: "1–2 часа", image: "", lat: 59.8478, lng: 30.1467, why: "👶 Детская комната, стульчики и няня", address: "ул. Адмирала Трибуца, Санкт-Петербург", price: "≈ 1 500–3 000 ₽", priceNote: "Средний чек", detailHref: "/place/7009", babyCare: "Детская комната", babyCareDetails: ["Детская комната","Детские стульчики","Няня","Детское меню"], babyCareVerifiedAt: "20.09.2026" },
  { id: 7010, name: "Хачо и Пури", category: "Ресторан", mood: "Вкусно поесть", budget: "≈ 1 000–2 500 ₽", company: ["Пара","Друзья","Семья"], duration: "1–2 часа", image: "", lat: 59.9085, lng: 30.4810, why: "👶 Детская комната и стульчики", address: "Европейский проспект, Санкт-Петербург", price: "≈ 1 000–2 500 ₽", priceNote: "Средний чек", detailHref: "/place/7010", babyCare: "Детская комната", babyCareDetails: ["Детская комната","Детские стульчики","Детское меню"], babyCareVerifiedAt: "20.09.2026" },
  { id: 7011, name: "ТРК Питер Радуга", category: "Городское пространство", mood: "С семьёй", budget: "Бесплатно", company: ["Один","Пара","Друзья","Семья"], duration: "1–2 часа", image: "", lat: 59.8694, lng: 30.3494, why: "👶 Комнаты матери и ребёнка", address: "просп. Космонавтов, 14", price: "Бесплатно", priceNote: "Семейные сервисы", detailHref: "/place/7011", babyCare: "Комната матери и ребёнка", babyCareDetails: ["Комната матери и ребёнка","Детская площадка"], babyCareVerifiedAt: "20.09.2026" },
  { id: 7012, name: "ТРК Сити Молл", category: "Городское пространство", mood: "С семьёй", budget: "Бесплатно", company: ["Один","Пара","Друзья","Семья"], duration: "1–2 часа", image: "", lat: 60.0086, lng: 30.3004, why: "👶 Комната матери и ребёнка", address: "Коломяжский пр., 17/2", price: "Бесплатно", priceNote: "Семейные сервисы", detailHref: "/place/7012", babyCare: "Комната матери и ребёнка", babyCareDetails: ["Комната матери и ребёнка"], babyCareVerifiedAt: "20.09.2026" },
  { id: 7013, name: "ТРК Академ-Парк", category: "Городское пространство", mood: "С семьёй", budget: "Бесплатно", company: ["Один","Пара","Друзья","Семья"], duration: "1–2 часа", image: "", lat: 60.0120, lng: 30.3968, why: "👶 Комната матери и ребёнка", address: "Гражданский пр., 41, лит. Б, корп. 2", price: "Бесплатно", priceNote: "Семейные сервисы", detailHref: "/place/7013", babyCare: "Комната матери и ребёнка", babyCareDetails: ["Комната матери и ребёнка"], babyCareVerifiedAt: "20.09.2026" },
];

const verifiedFamilyExpansion: MapPlace[] = [
  { id:7014,name:"ЛЕТО",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8518,lng:30.3214,why:"👶 Большая детская комната и детское меню",address:"Московский район, Санкт-Петербург",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7014",babyCare:"Детская комната",babyCareDetails:["Большая детская комната","Детское меню","Семейные мастер-классы"],babyCareVerifiedAt:"20.09.2026" },
  { id:7015,name:"NEVESOMOST",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 2 000–4 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.9587,lng:30.3159,why:"👶 Игровая комната с няней и детское меню",address:"Санкт-Петербург",price:"≈ 2 000–4 000 ₽",priceNote:"Средний чек",detailHref:"/place/7015",babyCare:"Детская комната",babyCareDetails:["Игровая комната","Няня","Детское меню"],babyCareVerifiedAt:"20.09.2026" },
  { id:7016,name:"Гуси-Лебеди",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:60.0087,lng:30.3003,why:"👶 Оборудованная детская комната с няней",address:"Коломяжский проспект, Санкт-Петербург",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7016",babyCare:"Детская комната",babyCareDetails:["Детская комната","Няня","Развивающие занятия"],babyCareVerifiedAt:"20.09.2026" },
  { id:7017,name:"Большая кухня · Галерея",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.9277,lng:30.3603,why:"👶 Просторная детская комната",address:"Лиговский пр., 30А, ТРЦ «Галерея»",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7017",babyCare:"Детская комната",babyCareDetails:["Детская комната"],babyCareVerifiedAt:"20.09.2026" },
];
const officialFamilyPlaces: MapPlace[] = [
  { id:7018,name:"Маймун",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 000–5 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.9388,lng:30.2145,why:"👶 Отдельная детская комната и детское меню",address:"ул. Кораблестроителей, 14",price:"≈ 1 000–5 000 ₽",priceNote:"Средний чек",detailHref:"/place/7018",babyCare:"Детская комната",babyCareDetails:["Детская комната","Детское меню","Мастер-классы"],babyCareVerifiedAt:"20.09.2026" },
  { id:7019,name:"Сули Гули",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 2 000–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.83195,lng:30.50085,why:"👶 Детская комната с няней и пеленальная комната",address:"Тепловозная ул., 31, ТРК «Порт Находка», 4 этаж",price:"≈ 2 000–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7019",babyCare:"Комната матери и ребёнка",babyCareDetails:["Детская комната","Няня","Пеленальная комната","Детское меню"],babyCareVerifiedAt:"20.09.2026" },
  { id:7020,name:"Ларисуваннухочу",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:60.012,lng:30.4037,why:"👶 Просторная детская комната с аниматором",address:"пр. Науки, 14, корп. 1, лит. А",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7020",babyCare:"Детская комната",babyCareDetails:["Детская комната","Аниматор","Детское меню","Мастер-классы"],babyCareVerifiedAt:"20.09.2026" },
  { id:7021,name:"Двор Помидор",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.868921,lng:30.350265,why:"👶 Детская и пеленальная комнаты, стульчики для кормления",address:"пр. Космонавтов, 14, ТРК «Питер Радуга», атриум, 2 этаж",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7021",babyCare:"Комната матери и ребёнка",babyCareDetails:["Детская комната","Пеленальная комната","Детские стульчики","Няня","Детское меню"],babyCareVerifiedAt:"20.09.2026" },
  { id:7022,name:"Баклажан · Горьковская",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.956185,lng:30.314743,why:"👶 Большая детская комната с сухим бассейном",address:"Александровский парк, 4/3, лит. А, ТЦ «Великан Парк», 4 этаж",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7022",babyCare:"Детская комната",babyCareDetails:["Детская комната","Сухой бассейн","Детское меню","Мастер-классы"],babyCareVerifiedAt:"20.09.2026" },
  { id:7023,name:"Москва",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 2 000–4 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.9317,lng:30.3592,why:"👶 Большая тематическая детская комната и детское меню",address:"Невский пр., 114, ТК «Невский центр», 6 этаж",price:"≈ 2 000–4 000 ₽",priceNote:"Средний чек",detailHref:"/place/7023",babyCare:"Детская комната",babyCareDetails:["Большая детская комната","Детское меню","Мастер-классы"],babyCareVerifiedAt:"20.09.2026" },
];
const familyFinalSeven: MapPlace[] = [
  { id:7024,name:"Любимый",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.9486,lng:30.4758,why:"👶 Игровая комната, няня, стульчики и детское меню",address:"Индустриальный проспект, Санкт-Петербург",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7024",babyCare:"Детская комната",babyCareDetails:["Игровая комната","Няня","Детские стульчики","Детское меню"],babyCareVerifiedAt:"20.09.2026" },
  { id:7025,name:"Bellostro",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.9872,lng:30.3198,why:"👶 Семейный ресторан с детской комнатой",address:"Белоостровская ул., 9, Санкт-Петербург",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7025",babyCare:"Детская комната",babyCareDetails:["Детская комната","Детское меню"],babyCareVerifiedAt:"20.09.2026" },
  { id:7026,name:"Папаша Клаусс",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.9819,lng:30.2119,why:"👶 Детская комната и аниматор по расписанию",address:"Приморский пр., 72, ТРК «Питерлэнд», 4 этаж",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7026",babyCare:"Детская комната",babyCareDetails:["Детская комната","Аниматор по расписанию"],babyCareVerifiedAt:"20.09.2026" },
  { id:7027,name:"МамаLыgа · Ленинский",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8547,lng:30.2035,why:"👶 Детская комната, пеленальный столик и стульчики",address:"Ленинский пр., 84/1, Санкт-Петербург",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7027",babyCare:"Пеленальный столик",babyCareDetails:["Детская комната","Пеленальный столик","Детские стульчики","Детское меню"],babyCareVerifiedAt:"20.09.2026" },
  { id:7028,name:"Сказка · Репино",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 2 000–4 000 ₽",company:["Пара","Друзья","Семья"],duration:"2–4 часа",image:"",lat:60.169,lng:29.864,why:"👶 Просторная детская комната и семейные активности",address:"Репино, Санкт-Петербург",price:"≈ 2 000–4 000 ₽",priceNote:"Средний чек",detailHref:"/place/7028",babyCare:"Детская комната",babyCareDetails:["Детская комната","Игрушки","Детские мастер-классы"],babyCareVerifiedAt:"20.09.2026" },
  { id:7029,name:"Айлеви",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.95,lng:30.31,why:"👶 Бесплатная детская комната для гостей",address:"Санкт-Петербург",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7029",babyCare:"Детская комната",babyCareDetails:["Детская комната","Игрушки","Настольные игры","Развивающие материалы","Детское меню"],babyCareVerifiedAt:"20.09.2026" },
  { id:7030,name:"Моменты",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 500–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.86,lng:30.22,why:"👶 Детская комната и отдельная зона для мам с малышами",address:"Санкт-Петербург",price:"≈ 1 500–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/7030",babyCare:"Комната матери и ребёнка",babyCareDetails:["Детская комната","Комната матери и ребёнка","Пеленальный столик"],babyCareVerifiedAt:"20.09.2026" },
];
const novoselyeRatedPlaces: MapPlace[] = [
  { id:8001,name:"ПхалиХинкали",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8094,lng:30.073,why:"★ 5.0 / 5 · подходит по рейтингу ALMA",address:"Красносельское ш., 2, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8001",rating:5.0,ratingScale:5,ratingCount:794,ratingSource:"Яндекс Карты" },
  { id:8002,name:"Baggins Coffee · Красносельское ш.",category:"Кофейня",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8095,lng:30.0732,why:"★ 5.0 / 5 · подходит по рейтингу ALMA",address:"Красносельское ш., 2, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8002",rating:5.0,ratingScale:5,ratingCount:30,ratingSource:"Яндекс Карты" },
  { id:8003,name:"Кур Крыло",category:"Фастфуд",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8096,lng:30.0733,why:"★ 5.0 / 5 · подходит по рейтингу ALMA",address:"Красносельское ш., 2, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8003",rating:5.0,ratingScale:5,ratingCount:189,ratingSource:"Яндекс Карты" },
  { id:8004,name:"Baggins Coffee · Невская",category:"Кофейня",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8099,lng:30.086,why:"★ 5.0 / 5 · подходит по рейтингу ALMA",address:"Невская ул., 4, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8004",rating:5.0,ratingScale:5,ratingCount:326,ratingSource:"Яндекс Карты" },
  { id:8005,name:"Etlon coffee",category:"Кофейня",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8102,lng:30.0836,why:"★ 5.0 / 5 · подходит по рейтингу ALMA",address:"Невская ул., 6, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8005",rating:5.0,ratingScale:5,ratingCount:229,ratingSource:"Яндекс Карты" },
  { id:8006,name:"Zerno",category:"Кофейня",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.809132,lng:30.082775,why:"★ 5.0 / 5 · подходит по рейтингу ALMA",address:"бульвар Белых Ночей, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8006",rating:5.0,ratingScale:5,ratingCount:182,ratingSource:"Яндекс Карты" },
  { id:8007,name:"Catalina",category:"Кофейня",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8097,lng:30.088,why:"★ 5.0 / 5 · подходит по рейтингу ALMA",address:"Невская ул., 1, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8007",rating:5.0,ratingScale:5,ratingCount:67,ratingSource:"Яндекс Карты" },
  { id:8008,name:"Кофейные ноты",category:"Кафе",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.811,lng:30.0805,why:"★ 4.7 / 5 · подходит по рейтингу ALMA",address:"Питерский пр., 7, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8008",rating:4.7,ratingScale:5,ratingCount:57,ratingSource:"Яндекс Карты" },
  { id:8009,name:"Детройт",category:"Кафе",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8087,lng:30.0815,why:"★ 4.9 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8009",rating:4.9,ratingScale:5,ratingCount:116,ratingSource:"Яндекс Карты" },
  { id:8010,name:"Forma",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.81,lng:30.079,why:"★ 4.9 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8010",rating:4.9,ratingScale:5,ratingCount:251,ratingSource:"Яндекс Карты" },
  { id:8011,name:"Luna Lounge",category:"Бар",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8082,lng:30.0798,why:"★ 4.8 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8011",rating:4.8,ratingScale:5,ratingCount:258,ratingSource:"Яндекс Карты" },
  { id:8012,name:"Важная рыба",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8107,lng:30.085,why:"★ 4.8 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8012",rating:4.8,ratingScale:5,ratingCount:142,ratingSource:"Яндекс Карты" },
  { id:8013,name:"Madam Cho",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8091,lng:30.087,why:"★ 4.8 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8013",rating:4.8,ratingScale:5,ratingCount:576,ratingSource:"Яндекс Карты" },
  { id:8014,name:"Wish Bubble Tea",category:"Кафе",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8104,lng:30.0863,why:"★ 4.8 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8014",rating:4.8,ratingScale:5,ratingCount:126,ratingSource:"Яндекс Карты" },
  { id:8015,name:"Смокинг Лаунж",category:"Бар",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8094,lng:30.0844,why:"★ 4.8 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8015",rating:4.8,ratingScale:5,ratingCount:101,ratingSource:"Яндекс Карты" },
  { id:8016,name:"Хлеб и Эклер",category:"Кофейня",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8088,lng:30.082,why:"★ 5.0 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8016",rating:5.0,ratingScale:5,ratingCount:35,ratingSource:"Яндекс Карты" },
  { id:8017,name:"Чуду",category:"Кафе",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8093,lng:30.081,why:"★ 4.8 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8017",rating:4.8,ratingScale:5,ratingCount:343,ratingSource:"Яндекс Карты" },
  { id:8018,name:"Лаваш Микс",category:"Кафе",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8089,lng:30.08,why:"★ 4.8 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8018",rating:4.8,ratingScale:5,ratingCount:326,ratingSource:"Яндекс Карты" },
  { id:8019,name:"Домашний Очаг",category:"Кафе",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.808785,lng:30.073827,why:"★ 4.8 / 5 · подходит по рейтингу ALMA",address:"Центральная ул., 1, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8019",rating:4.8,ratingScale:5,ratingCount:411,ratingSource:"Яндекс Карты" },
  { id:8020,name:"Man_Gurman",category:"Кафе",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8096,lng:30.0785,why:"★ 4.9 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8020",rating:4.9,ratingScale:5,ratingCount:0,ratingSource:"Яндекс Карты" },
  { id:8021,name:"Будет Вкусно",category:"Кафе",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8098,lng:30.0778,why:"★ 4.8 / 5 · подходит по рейтингу ALMA",address:"Новоселье, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8021",rating:4.8,ratingScale:5,ratingCount:0,ratingSource:"Яндекс Карты" },
];

const novoselyeActivities: MapPlace[] = [
  { id:8022,name:"New Gym",category:"Спорт",mood:"Активно",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8101,lng:30.0819,why:"★ 5.0 / 5 · 103 оценки · подходит по рейтингу ALMA",address:"Адмиралтейская ул., 1, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Абонемент / разовое посещение",detailHref:"/place/8022",rating:5,ratingScale:5,ratingCount:103,ratingSource:"Яндекс Карты" },
  { id:8023,name:"Кидкорт",category:"Развлечения",mood:"Активно",budget:"Цена уточняется",company:["Семья"],duration:"1–2 часа",image:"",lat:59.8089,lng:30.0767,why:"★ 5.0 / 5 · 218 оценок · детский спортивно-развлекательный центр",address:"Красносельское ш., 9, ТЦ «Центральный», Новоселье",price:"Цена уточняется",priceNote:"Занятия и посещение",detailHref:"/place/8023",rating:5,ratingScale:5,ratingCount:218,ratingSource:"Яндекс Карты" },
  { id:8024,name:"Etalon Space",category:"Спорт",mood:"Активно",budget:"Цена уточняется",company:["Один","Пара","Семья"],duration:"1–2 часа",image:"",lat:59.8089,lng:30.0768,why:"★ высокий рейтинг · 271 отзыв · фитнес, йога и танцы",address:"Красносельское ш., 9, ТЦ «Центральный», Новоселье",price:"Цена уточняется",priceNote:"Фитнес и занятия",detailHref:"/place/8024",rating:5,ratingScale:5,ratingCount:271,ratingSource:"Яндекс Карты" },
  { id:8025,name:"Ледовая арена Новоселье",category:"Спорт",mood:"Активно",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8098,lng:30.0855,why:"★ 4.7 / 5 · 706 оценок · проходит порог ALMA",address:"Центральная ул., 5, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Каток",detailHref:"/place/8025",rating:4.7,ratingScale:5,ratingCount:706,ratingSource:"Google" },
  { id:8026,name:"ФШ Юниор Новоселье",category:"Спорт",mood:"Активно",budget:"Цена уточняется",company:["Семья"],duration:"1–2 часа",image:"",lat:59.8097,lng:30.0854,why:"★ 5.0 / 5 · 20 оценок · футбольная школа",address:"Центральная ул., строение 5, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Спортивные занятия",detailHref:"/place/8026",rating:5,ratingScale:5,ratingCount:20,ratingSource:"Google" },
  { id:8027,name:"Центр детского развития 1+1",category:"Развлечения",mood:"С семьёй",budget:"Цена уточняется",company:["Семья"],duration:"1–2 часа",image:"",lat:59.8092,lng:30.0748,why:"★ 5.0 / 5 · проходит порог ALMA",address:"Красносельское ш., 6, Новоселье",price:"Цена уточняется",priceNote:"Детские занятия",detailHref:"/place/8027",rating:5,ratingScale:5,ratingCount:7,ratingSource:"Google" },
  { id:8028,name:"Saint Ghetto",category:"Спорт",mood:"Активно",budget:"Цена уточняется",company:["Один","Друзья"],duration:"1–2 часа",image:"",lat:59.8079,lng:30.0719,why:"★ 4.9 / 5 · спортивный зал · Хорошее место 2026",address:"Красносельское ш., 16, Новоселье",price:"Цена уточняется",priceNote:"Спортивный зал",detailHref:"/place/8028",rating:4.9,ratingScale:5,ratingCount:25,ratingSource:"Яндекс Карты" },
  { id:8029,name:"Avanti",category:"Спорт",mood:"Активно",budget:"Цена уточняется",company:["Один","Пара","Семья"],duration:"1–2 часа",image:"",lat:59.8079,lng:30.0718,why:"★ 4.6 / 5 · 45 оценок · танцевальная школа",address:"Красносельское ш., 16, Новоселье",price:"Цена уточняется",priceNote:"Танцевальные занятия",detailHref:"/place/8029",rating:4.6,ratingScale:5,ratingCount:45,ratingSource:"Яндекс Карты" },
];

const novoselyeMoreRatedPlaces: MapPlace[] = [
  { id:8030,name:"Кидкорт · Адмиралтейская",category:"Спорт",mood:"Активно",budget:"Цена уточняется",company:["Семья"],duration:"1–2 часа",image:"",lat:59.8112,lng:30.0839,why:"★ 4.8 / 5 · 18 оценок · проходит порог ALMA",address:"Адмиралтейская ул., 6, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Детский клуб физического развития",detailHref:"/place/8030",rating:4.8,ratingScale:5,ratingCount:18,ratingSource:"2ГИС" },
  { id:8031,name:"Джеб",category:"Спорт",mood:"Активно",budget:"Цена уточняется",company:["Один","Друзья"],duration:"1–2 часа",image:"",lat:59.8108,lng:30.0807,why:"★ 4.6 / 5 · проходит порог ALMA",address:"Питерский пр., 7, Новоселье, Ленинградская область",price:"Цена уточняется",priceNote:"Спортивный клуб",detailHref:"/place/8031",rating:4.6,ratingScale:5,ratingCount:7,ratingSource:"2ГИС" },
  { id:8032,name:"СелебриУм",category:"Развлечения",mood:"С семьёй",budget:"Цена уточняется",company:["Семья"],duration:"1–2 часа",image:"",lat:59.8095,lng:30.0731,why:"★ 4.5 / 5 · 21 оценка · проходит порог ALMA",address:"Красносельское ш., 2, ОДЦ «Графит», Новоселье",price:"Цена уточняется",priceNote:"Детские занятия",detailHref:"/place/8032",rating:4.5,ratingScale:5,ratingCount:21,ratingSource:"2ГИС" },
];
const strelnaPlaces: MapPlace[] = [
  { id:8101,name:"Дача Линдстрема",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8558,lng:30.0609,why:"★ 4.6 / 5 · проходит порог ALMA",address:"ул. Глинки, 7, лит. А, Стрельна",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8101",rating:4.6,ratingScale:5,ratingCount:204,ratingSource:"Google" },
  { id:8102,name:"Славянский дворик",category:"Кафе",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8529,lng:30.0603,why:"★ 4.6 / 5 · проходит порог ALMA",address:"Фронтовая ул., 3, лит. У, Стрельна",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8102",rating:4.6,ratingScale:5,ratingCount:520,ratingSource:"Google" },
  { id:8103,name:"Орловский парк",category:"Парк",mood:"Погулять",budget:"Бесплатно",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8498,lng:30.0540,why:"★ 4.5 / 5 · исторический парк у Орловского пруда",address:"Санкт-Петербургское ш., 78, Стрельна",price:"Бесплатно",priceNote:"Прогулка",detailHref:"/place/8103",rating:4.5,ratingScale:5,ratingCount:1249,ratingSource:"Google" },
  { id:8104,name:"Русская Версалия",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8539,lng:30.0474,why:"★ 4.5 / 5 · проходит порог ALMA",address:"Берёзовая ал., 3, Стрельна",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8104",rating:4.5,ratingScale:5,ratingCount:8,ratingSource:"Google" },
  { id:8105,name:"Дворец Петра I в Стрельне",category:"Достопримечательность",mood:"Узнать новое",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8489,lng:30.0412,why:"★ 4.7 / 5 · историческая усадьба Петра I",address:"ул. Больничная Горка, 2, Стрельна",price:"Цена уточняется",priceNote:"Билет",detailHref:"/place/8105",rating:4.7,ratingScale:5,ratingCount:641,ratingSource:"Google" },
  { id:8106,name:"Яхт-Клуб · Стрельна",category:"Ресторан",mood:"Романтика",budget:"Цена уточняется",company:["Пара","Друзья"],duration:"1–2 часа",image:"",lat:59.8575,lng:30.0340,why:"★ 4.6 / 5 · ресторан у воды",address:"Портовая ул., 25, Стрельна",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8106",rating:4.6,ratingScale:5,ratingCount:10,ratingSource:"Google" },
  { id:8107,name:"Фруктовый сад и огород Стрельны",category:"Парк",mood:"Погулять",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8497,lng:30.0405,why:"Исторический садово-огородный комплекс усадьбы Петра I",address:"Стрельна, Санкт-Петербург",price:"Цена уточняется",priceNote:"Режим посещения уточняется",detailHref:"/place/8107" },
];
const southWestCorridorPlaces: MapPlace[] = [
  { id:8110,name:"Ресторан Стрельна",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 1 000–1 500 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8534,lng:30.0590,why:"★ 5.0 / 5 · 2297 оценок · у воды, можно с собакой",address:"Санкт-Петербургское ш., 58А, Стрельна",price:"≈ 1 000–1 500 ₽",priceNote:"Средний чек",detailHref:"/place/8110",rating:5,ratingScale:5,ratingCount:2297,ratingSource:"Яндекс Карты",dogFriendly:true },
  { id:8111,name:"Усадьба Стрелингоф",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8518,lng:30.0645,why:"★ 4.8 / 5 · 184 оценки · проходит порог ALMA",address:"Стрельна, Санкт-Петербург",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8111",rating:4.8,ratingScale:5,ratingCount:184,ratingSource:"Restaurant Guru" },
  { id:8112,name:"Парк Сосновая Поляна",category:"Парк",mood:"Погулять",budget:"Бесплатно",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8345,lng:30.1840,why:"★ 4.5 / 5 · 2822 оценки · большая прогулочная точка между Стрельной и Петербургом",address:"Сосновая Поляна, Санкт-Петербург",price:"Бесплатно",priceNote:"Прогулка",detailHref:"/place/8112",rating:4.5,ratingScale:5,ratingCount:2822,ratingSource:"Google" },
  { id:8113,name:"Евразия · Петергофское шоссе",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8508,lng:30.1539,why:"★ 4.7 / 5 · 1068 оценок · проходит порог ALMA",address:"Петергофское ш., 51А, Санкт-Петербург",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8113",rating:4.7,ratingScale:5,ratingCount:1068,ratingSource:"Google" },
  { id:8114,name:"Tangiers Lounge Pearl",category:"Ресторан",mood:"Вечером",budget:"Цена уточняется",company:["Пара","Друзья"],duration:"1–2 часа",image:"",lat:59.8560,lng:30.1640,why:"★ 5.0 / 5 · 595 оценок · проходит порог ALMA",address:"ул. Катерников, 8 лит. А, Санкт-Петербург",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8114",rating:5,ratingScale:5,ratingCount:595,ratingSource:"Google" },
  { id:8115,name:"Philibert · Матисов канал",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8537,lng:30.1745,why:"★ 4.5 / 5 · 442 оценки · проходит порог ALMA",address:"наб. Матисова канала, 5 стр. 1, Санкт-Петербург",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8115",rating:4.5,ratingScale:5,ratingCount:442,ratingSource:"Google" },
  { id:8116,name:"Cernovar · Балтийская Жемчужина",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Пара","Друзья"],duration:"1–2 часа",image:"",lat:59.8542,lng:30.1736,why:"★ 4.7 / 5 · 668 оценок · проходит порог ALMA",address:"ул. Адмирала Трибуца, 7, Санкт-Петербург",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8116",rating:4.7,ratingScale:5,ratingCount:668,ratingSource:"Google" },
];
const southWestCorridorMorePlaces: MapPlace[] = [
  { id:8117,name:"Friends Market",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8479,lng:30.1248,why:"★ 4.9 / 5 · 340 отзывов · проходит порог ALMA",address:"Петергофское ш., 84 к19, Санкт-Петербург",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8117",rating:4.9,ratingScale:5,ratingCount:340,ratingSource:"Яндекс Карты" },
  { id:8118,name:"Британские пекарни · Жемчужная Плаза",category:"Кофейня",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8510,lng:30.1543,why:"★ 4.8 / 5 · 543 оценки · проходит порог ALMA",address:"Петергофское ш., 51, ТРЦ «Жемчужная Плаза», Санкт-Петербург",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8118",rating:4.8,ratingScale:5,ratingCount:543,ratingSource:"2ГИС" },
  { id:8119,name:"Marseille",category:"Ресторан",mood:"Вкусно поесть",budget:"До 1 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8560,lng:30.1910,why:"★ 4.8 / 5 · проходит порог ALMA",address:"Петергофское ш., 17 к1, Санкт-Петербург",price:"До 1 000 ₽",priceNote:"Средний чек",detailHref:"/place/8119",rating:4.8,ratingScale:5,ratingSource:"Allcafe" },
  { id:8120,name:"Matisov · Адмирала Трибуца",category:"Ресторан",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8539,lng:30.1737,why:"★ 4.6 / 5 · 246 отзывов · проходит порог ALMA",address:"ул. Адмирала Трибуца, 7, Санкт-Петербург",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8120",rating:4.6,ratingScale:5,ratingCount:246,ratingSource:"Google" },
  { id:8121,name:"Не горюй",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 3 000–4 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8540,lng:30.1738,why:"★ 4.5 / 5 · 362 отзыва · проходит порог ALMA",address:"ул. Адмирала Трибуца, 7 лит. А, Санкт-Петербург",price:"≈ 3 000–4 000 ₽",priceNote:"Средний чек",detailHref:"/place/8121",rating:4.5,ratingScale:5,ratingCount:362,ratingSource:"Google" },
  { id:8122,name:"Шаверма Просто Вася",category:"Фастфуд",mood:"Вкусно поесть",budget:"Цена уточняется",company:["Один","Пара","Друзья"],duration:"До 1 часа",image:"",lat:59.8506,lng:30.1530,why:"★ 4.7 / 5 · 294 оценки · проходит порог ALMA",address:"Петергофское ш., 51Н, Санкт-Петербург",price:"Цена уточняется",priceNote:"Средний чек уточняется",detailHref:"/place/8122",rating:4.7,ratingScale:5,ratingCount:294,ratingSource:"Totadres" },
];
const southWestGreenCorridorPlaces: MapPlace[] = [
  { id:8123,name:"Демидовский парк",category:"Парк",mood:"Погулять",budget:"Бесплатно",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8338,lng:30.1748,why:"Исторический пейзажный парк XVIII века на Петергофской дороге",address:"Сосновая Поляна, Санкт-Петербург",price:"Бесплатно",priceNote:"Прогулка",detailHref:"/place/8123" },
  { id:8124,name:"Полежаевский парк",category:"Парк",mood:"Погулять",budget:"Бесплатно",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8408,lng:30.1907,why:"Большой зелёный парк на пути от Стрельны к городской части Петербурга",address:"Красносельский район, Санкт-Петербург",price:"Бесплатно",priceNote:"Прогулка",detailHref:"/place/8124" },
  { id:8125,name:"Южно-Приморский парк",category:"Парк",mood:"Погулять",budget:"Бесплатно",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8537,lng:30.1966,why:"Зелёная прогулочная точка юго-запада Петербурга",address:"Петергофское шоссе, Санкт-Петербург",price:"Бесплатно",priceNote:"Прогулка",detailHref:"/place/8125" },
  { id:8126,name:"Новознаменка",category:"Парк",mood:"Погулять",budget:"Бесплатно",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8498,lng:30.1660,why:"Историческая усадебная территория вдоль Петергофской дороги",address:"Петергофское шоссе, Санкт-Петербург",price:"Бесплатно",priceNote:"Прогулка",detailHref:"/place/8126" },
];
const ulyankaAvtovoPlaces: MapPlace[] = [
  { id:8127,name:"Парк Александрино",category:"Парк",mood:"Погулять",budget:"Бесплатно",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8377,lng:30.2144,why:"★ 4.6 / 5 · 5047 оценок · проходит порог ALMA",address:"парк Александрино, Санкт-Петербург",price:"Бесплатно",priceNote:"Прогулка",detailHref:"/place/8127",rating:4.6,ratingScale:5,ratingCount:5047,ratingSource:"Google" },
  { id:8128,name:"Усадьба Кирьяново",category:"Достопримечательность",mood:"Узнать новое",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"До 1 часа",image:"",lat:59.8794,lng:30.2598,why:"★ 4.6 / 5 · историческая усадьба на проспекте Стачек",address:"пр. Стачек, 45, Санкт-Петербург",price:"Цена уточняется",priceNote:"Режим посещения уточняется",detailHref:"/place/8128",rating:4.6,ratingScale:5,ratingCount:41,ratingSource:"Google" },
  { id:8129,name:"Музей «Анна Ахматова. Серебряный век»",category:"Музей",mood:"Узнать новое",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8676,lng:30.2687,why:"★ 4.5 / 5 · 78 оценок · проходит порог ALMA",address:"Автовская ул., 14, Санкт-Петербург",price:"Цена уточняется",priceNote:"Билет",detailHref:"/place/8129",rating:4.5,ratingScale:5,ratingCount:78,ratingSource:"Google" },
  { id:8130,name:"Кузу",category:"Ресторан",mood:"Вкусно поесть",budget:"≈ 2 000–3 000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8758,lng:30.2785,why:"★ 4.8 / 5 · 166 оценок · проходит порог ALMA",address:"Краснопутиловская ул., 14/12, Санкт-Петербург",price:"≈ 2 000–3 000 ₽",priceNote:"Средний чек",detailHref:"/place/8130",rating:4.8,ratingScale:5,ratingCount:166,ratingSource:"Google" },
  { id:8131,name:"Нарвская Застава",category:"Музей",mood:"Узнать новое",budget:"Цена уточняется",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.8927,lng:30.2706,why:"★ 4.5 / 5 · 75 оценок · проходит порог ALMA",address:"ул. Ивана Черных, 23, Санкт-Петербург",price:"Цена уточняется",priceNote:"Билет",detailHref:"/place/8131",rating:4.5,ratingScale:5,ratingCount:75,ratingSource:"Google" },
  { id:8132,name:"Екатерингофский парк",category:"Парк",mood:"Погулять",budget:"Бесплатно",company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:59.9001,lng:30.2694,why:"★ 4.7 / 5 · 1549 оценок · проходит порог ALMA",address:"наб. Бумажного канала, 10, Санкт-Петербург",price:"Бесплатно",priceNote:"Прогулка",detailHref:"/place/8132",rating:4.7,ratingScale:5,ratingCount:1549,ratingSource:"Google" },
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

const safetyCoordinates: Record<string, readonly [number, number]> = {
  "safe-bar-is-murino": [60.057817, 30.435288],
  "safe-morvax-murino": [59.917218, 30.346528],
  "safe-energia-v-rukakh-kudrovo": [59.916946, 30.517235],
  "safe-dom-kultury-kudrovo": [59.915571, 30.50376],
  "safe-dogs-haus-kudrovo": [59.90984, 30.509359],
  "safe-peterburgskie-pekarni-kudrovo": [59.911714, 30.520148],
  "safe-netrezvaya-utka-kudrovo": [59.907937, 30.51391],
  "safe-lv-coffee-kudrovo": [59.907852, 30.517112],
  "safe-vkafe-stroiteley-kudrovo": [59.909203, 30.521836],
  "safe-osipov-pro-kudrovo": [59.909204, 30.522348],
  "safe-vkafe-stolichnaya-kudrovo": [59.904512, 30.517645],
  "safe-mozhno-vse-kudrovo": [59.902848, 30.52296],
  "safe-gorod-koshek-kudrovo": [59.904561, 30.519475],
  "safe-kofe-da-yanino": [59.952299, 30.577386],
  "safe-lapa-lyubvi-murino": [59.802929, 30.375507],
  "safe-archer-wolf-novoselye": [59.809423, 30.094564],
  "safe-beerday-novoselye": [59.808742, 30.086739],
  "safe-gio-bistro-novoselye": [59.810205, 30.083569],
  "safe-domashniy-ochag-novoselye": [59.808785, 30.073827],
  "safe-alibi-novoselye": [59.81048, 30.078684],
  "safe-peterburgskie-pekarni-novoselye": [59.811895, 30.080657],
  "safe-atom-gaming-novoselye": [59.81258, 30.083252],
  "safe-vysokiy-gradus-murino": [60.041103, 30.453319],
  "safe-hm-wait-lounge-murino": [60.053381, 30.447157],
  "safe-pixel-cyber-lounge-murino": [60.053422, 30.451907],
  "safe-ekaterina-islamova-beauty-murino": [60.052514, 30.446576],
  "safe-kimori-murino": [60.051942, 30.447594],
  "safe-hairisma-murino": [60.052027, 30.431578],
  "safe-osipov-pro-murino": [60.052051, 30.427758],
  "safe-mesto-bistro-murino": [60.054804, 30.432162],
  "safe-hairisma-manikur-murino": [60.052405, 30.430581],
  "safe-velar-murino": [60.055969, 30.435075],
  "safe-malen-fit-murino": [60.056712, 30.432492],
  "safe-noce-pizza-wine-murino": [60.056456, 30.43817],
  "safe-restobar-1715-murino": [60.057246, 30.434698],
  "safe-golodnye-serdca-murino": [60.057528, 30.435072],
  "safe-par-studio-1-murino": [60.058364, 30.43402],
  "safe-alex-coffee-murino": [60.058, 30.436736],
  "safe-lavegint-murino": [60.058814, 30.433231],
};

const safetyMapPlaces: MapPlace[] = confirmedSafetyPlaces.flatMap((place, index) => {
  const coordinates = safetyCoordinates[place.id];
  if (!coordinates) return [];
  const [lat, lng] = coordinates;
  return [{
    id: 7001 + index,
    name: place.name,
    category: place.category,
    mood: "Спокойно",
    budget: "Бесплатно",
    company: ["Один", "Пара", "Друзья"],
    duration: "До 1 часа",
    image: "",
    lat,
    lng,
    why: "Подтверждённая точка проекта «Ключевое слово».",
    address: place.address,
    price: "Бесплатно",
    priceNote: "Помощь оказывают бесплатно",
    detailHref: `/place/${7001 + index}`,
    safePlace: true,
    safePlaceCode: place.safetySupport.codePhrase,
    safePlaceHelp: place.safetySupport.helpText,
    safePlaceVerifiedAt: place.safetySupport.verifiedAt,
  }];
});

export const mapPlaces: MapPlace[] = [
  ...basePlaces,
  ...coffeeMapPlaces,
  ...restaurantMapPlaces,
  ...dogMapPlaces,
  ...driveMapPlaces,
  ...photoMapPlaces,
  ...familyMapPlaces,
  ...moreFamilyMapPlaces,
  ...verifiedFamilyExpansion,
  ...officialFamilyPlaces,
  ...familyFinalSeven,
  ...novoselyeRatedPlaces,
  ...novoselyeActivities,
  ...novoselyeMoreRatedPlaces,
  ...strelnaPlaces,
  ...southWestCorridorPlaces,
  ...southWestCorridorMorePlaces,
  ...southWestGreenCorridorPlaces,
  ...ulyankaAvtovoPlaces,
  ...studentDiscountPlaces,
  ...safetyMapPlaces,
];
