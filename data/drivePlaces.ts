export type DriveTag = "Матчи" | "Живая музыка" | "Рок" | "С друзьями" | "Активный отдых";

export type DrivePlace = {
  id: number;
  name: string;
  category: string;
  tags: DriveTag[];
  rating: number;
  ratingScale: 5;
  ratingCount: number;
  ratingSource: string;
  ratingUpdated: string;
  address: string;
  lat: number;
  lng: number;
  price: string;
  note: string;
};

// ALMA публикует заведения только с подтвержденной оценкой 4.5–5.0 / 5.
// Наличие конкретного матча/концерта в конкретный день проверяется отдельно перед показом «Что сегодня».
export const drivePlaces: DrivePlace[] = [
  {
    id: 4001,
    name: "Ливерпуль",
    category: "Бар-клуб",
    tags: ["Матчи", "Живая музыка", "Рок", "С друзьями"],
    rating: 4.8,
    ratingScale: 5,
    ratingCount: 2656,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    address: "Санкт-Петербург",
    lat: 59.9343,
    lng: 30.3351,
    price: "1000–1500 ₽",
    note: "Живая музыка и рок-программа; в источнике указаны трансляции ключевых спортивных событий.",
  },
  {
    id: 4002,
    name: "Rock Pub",
    category: "Рок-паб",
    tags: ["Рок", "С друзьями"],
    rating: 4.9,
    ratingScale: 5,
    ratingCount: 4930,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    address: "Санкт-Петербург",
    lat: 59.9348,
    lng: 30.3289,
    price: "≈ 1300 ₽",
    note: "Рок-атмосфера, музыкальные видео, настольные игры и PlayStation.",
  },
  {
    id: 4003,
    name: "The Wall",
    category: "Спортбар",
    tags: ["Матчи", "С друзьями"],
    rating: 5.0,
    ratingScale: 5,
    ratingCount: 2560,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    address: "Большая Пушкарская улица, Санкт-Петербург",
    lat: 59.9602,
    lng: 30.3048,
    price: "≈ 700 ₽",
    note: "Фанатская атмосфера и спортивные трансляции; по пятницам и субботам бывает живая музыка.",
  },
  {
    id: 4004,
    name: "Tweed Bar",
    category: "Музыкальный бар",
    tags: ["Живая музыка", "С друзьями"],
    rating: 4.9,
    ratingScale: 5,
    ratingCount: 1005,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    address: "Санкт-Петербург",
    lat: 59.9346,
    lng: 30.3227,
    price: "от 1500 ₽",
    note: "Живые выступления: джаз, блюз и рок-н-ролл.",
  },
  {
    id: 4005,
    name: "Pit-Stop",
    category: "Картинг",
    tags: ["Активный отдых", "С друзьями"],
    rating: 5.0,
    ratingScale: 5,
    ratingCount: 1777,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    address: "Переκопская улица, 6-8, Санкт-Петербург",
    lat: 59.900422,
    lng: 30.268186,
    price: "Цена зависит от тарифа",
    note: "Картинг для активного отдыха: заезды, экипировка и трасса для компании или самостоятельного визита.",
  },
];
