export type DogFriendlyPlace = {
  id: string;
  name: string;
  category: string;
  address: string;
  budget: string;
  district: string;
  dogSize: string;
  dogRules: string;
  dogPerks: string;
  sourceLabel: string;
  sourceUrl: string;
  verifiedAt: string;
  rating?: number;
  ratingScale?: number;
  ratingCount?: number;
  ratingSource?: string;
  imageUrl?: string;
  imageSourceUrl?: string;
};

export const dogFriendlyPlaces: DogFriendlyPlace[] = [
  {
    id: "pong",
    name: "Pong",
    category: "Ресторан",
    address: "ул. Ленина, 16/42",
    budget: "≈ 1800–2000 ₽",
    district: "Петроградский",
    dogSize: "Уточнить у заведения",
    dogRules: "Актуальные ресторанные источники отмечают Pong как pet-friendly. Ограничение по росту собаки в открытом источнике не указано — ALMA его не придумывает.",
    dogPerks: "Dog-friendly",
    sourceLabel: "Restorating · подборка Dog Friendly",
    sourceUrl: "https://www.restorating.ru/spb/best/dogs",
    verifiedAt: "07.09.2026",
    rating: 6.4,
    ratingScale: 10,
    ratingCount: 2,
    ratingSource: "Restoclub",
    imageUrl: "https://www.restoclub.ru/spb/place/pong",
    imageSourceUrl: "https://www.restoclub.ru/spb/place/pong",
  },
  {
    id: "berthold-centre",
    name: "Бертгольд Центр",
    category: "Городское пространство",
    address: "Гражданская ул., 13–15",
    budget: "Вход свободный",
    district: "Адмиралтейский",
    dogSize: "Без опубликованного ограничения",
    dogRules: "На официальном сайте центр пишет, что рад послушным домашним питомцам. Выгуливать животных на территории двора просят не разрешать.",
    dogPerks: "Можно с питомцем",
    sourceLabel: "Официальный сайт Бертгольд Центра",
    sourceUrl: "https://bertholdcentre.com/",
    verifiedAt: "07.09.2026",
    rating: 5.0,
    ratingScale: 5,
    ratingCount: 6524,
    ratingSource: "Яндекс Карты",
    imageUrl: "https://bertholdcentre.com/",
    imageSourceUrl: "https://bertholdcentre.com/",
  },
];
