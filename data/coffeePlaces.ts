export type CoffeePlace = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  ratingCount: number;
  ratingSource: "Яндекс Карты";
  ratingUpdated: string;
  hours: string;
  phone?: string;
  website?: string;
  averageBill: string;
  dogFriendly?: string;
  note: string;
  image?: string;
  imageSource?: string;
  menuUrl?: string;
};

export const coffeePlaces: CoffeePlace[] = [
  {
    id: "skuratov-vosstaniya-35",
    name: "Skuratov Coffee",
    address: "ул. Восстания, 35, Санкт-Петербург",
    lat: 59.939082,
    lng: 30.360883,
    rating: 4.9,
    ratingCount: 1916,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    hours: "Ежедневно 06:55–23:05",
    phone: "+7 921 589-78-42",
    website: "https://skuratovcoffee.ru/spb",
    averageBill: "≈ 550 ₽",
    dogFriendly: "Можно с собакой — сеть сообщает, что любит собак",
    note: "Спешелти-кофе и спокойная рабочая атмосфера в центре города.",
    image:
      "https://static.tildacdn.com/tild3931-3737-4438-a662-343365396166/0jpadZgVxcI.jpg",
    imageSource: "Официальный сайт Skuratov Coffee",
  },
  {
    id: "sibaristica-obvodny-199",
    name: "Sibaristica",
    address: "наб. Обводного канала, 199–201К, Санкт-Петербург",
    lat: 59.909571,
    lng: 30.284229,
    rating: 5.0,
    ratingCount: 3903,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    hours: "Пн–Пт 08:30–21:00 · Сб–Вс 10:00–21:00",
    phone: "+7 812 309-42-16",
    website: "https://sibaristica.com",
    averageBill: "≈ 600 ₽",
    dogFriendly: "Можно с собакой",
    note: "Большой выбор зерна и альтернативных способов заваривания.",
    image:
      "https://sibaristica.com/local/templates/amt_main/img/static/info/02.jpg",
    imageSource: "Официальный сайт Sibaristica",
  },
  {
    id: "character-fontanka-109",
    name: "Character Coffee",
    address: "наб. реки Фонтанки, 109, Санкт-Петербург",
    lat: 59.922896,
    lng: 30.319174,
    rating: 5.0,
    ratingCount: 1925,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    hours: "Пн–Пт 09:00–21:00 · Сб–Вс 10:00–21:00",
    averageBill: "≈ 700 ₽",
    dogFriendly: "Можно с собакой, в том числе внутри",
    note: "Уютная кофейня на Фонтанке с десертами и завтраками.",
    image:
      "https://s1.afisha.ru/mediastorage/52/49/bb70cf721e524ce2aad30ef84952.jpg",
    imageSource: "Афиша Рестораны",
    menuUrl: "https://www.afisha.ru/spb/restaurant/kharakter-kofe-76326/",
  },
  {
    id: "surf-g34",
    name: "Surf Coffee × G34",
    address: "Гороховая ул., 34, Санкт-Петербург",
    lat: 59.929096,
    lng: 30.321698,
    rating: 4.9,
    ratingCount: 1079,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    hours: "Ежедневно 09:00–22:00",
    phone: "+7 931 315-12-62",
    website:
      "https://www.surfcoffee.ru/surf-coffee-stores/surf-spb-gorokhovaya34",
    averageBill: "≈ 250 ₽",
    dogFriendly: "Можно с собакой, в том числе внутри",
    note: "Один из самых узнаваемых Surf-спотов Петербурга в историческом центре.",
    image:
      "https://static.tildacdn.com/tild6438-3134-4333-b534-373738343236/g341.jpg",
    imageSource: "Официальный сайт Surf Coffee",
  },
  {
    id: "gotcha-suvorovsky-40",
    name: "Gotcha!",
    address: "Суворовский пр., 40, Санкт-Петербург",
    lat: 59.941466,
    lng: 30.380053,
    rating: 5.0,
    ratingCount: 984,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    hours: "Время работы рекомендуем проверить перед визитом",
    phone: "+7 908 175-49-89",
    website: "https://gotchabrewbar.ru/",
    averageBill: "≈ 650 ₽",
    note: "Спешелти-кофейня с открытой барной стойкой и локальной кухней.",
    image:
      "https://static.tildacdn.com/tild3466-3239-4363-b335-373836323939/photo_2024-12-23_13-.jpg",
    imageSource: "Официальный сайт Gotcha!",
  },
  {
    id: "humbl-ligovsky-58",
    name: "Humbl Cookies",
    address: "Лиговский проспект, 58, Санкт-Петербург",
    lat: 59.923958,
    lng: 30.357113,
    rating: 5.0,
    ratingCount: 2967,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    hours: "Ежедневно 12:00–22:00",
    phone: "+7 981 038-65-83",
    website: "https://delivery.humblcookies.com/",
    averageBill: "≈ 900 ₽",
    note: "Кофе и крупное печенье в стиле New York cookies.",
    image:
      "https://avatars.mds.yandex.net/get-altay/16789805/2a000001994dae206a3e1951065fe77ba84f/L_height",
    imageSource: "Яндекс Карты",
  },
  {
    id: "british-bro-kamennoostrovsky-45",
    name: "British Bro Coffee",
    address: "Каменноостровский пр., 45, Санкт-Петербург",
    lat: 59.968754,
    lng: 30.309122,
    rating: 5.0,
    ratingCount: 1346,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    hours:
      "Открывается с 08:00, актуальное закрытие лучше проверить перед визитом",
    phone: "+7 921 925-12-14",
    website: "https://britishbro.ru",
    averageBill: "≈ 1450 ₽",
    dogFriendly: "Можно с собакой до 35 см",
    note: "Популярная кофейня рядом с Петроградской.",
    image:
      "https://img.restoclub.ru/uploads/place/f/9/1/8/f9185d2475cf9bca6e2545db2a8f36fd_w1230_h820--no-cut.webp?v=3",
    imageSource: "Restoclub",
  },
  {
    id: "civil-volynsky-8",
    name: "Civil (CVL)",
    address: "Волынский пер., 8, Санкт-Петербург",
    lat: 59.938477,
    lng: 30.321797,
    rating: 5.0,
    ratingCount: 2621,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    hours: "Пн–Чт, Вс 09:00–20:00 · Пт–Сб 09:00–21:00",
    phone: "+7 812 317-71-11",
    website: "https://cvlcoffee.ru",
    averageBill: "≈ 950 ₽",
    dogFriendly: "Можно с животными",
    note: "Спешелти-кофейня и завтраки весь день в центре Петербурга.",
    image:
      "https://avatars.mds.yandex.net/get-altay/4303558/2a00000178a0ee90a6fe8f847de88bf5c517/L_height",
    imageSource: "Яндекс Карты",
  },
  {
    id: "sokol-gorokhovaya-27",
    name: "Sokol Coffee",
    address: "Гороховая ул., 27, Санкт-Петербург",
    lat: 59.930621,
    lng: 30.318392,
    rating: 5.0,
    ratingCount: 3413,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    hours: "Ежедневно до 23:00",
    phone: "+7 965 099-76-88",
    averageBill: "≈ 300 ₽",
    dogFriendly: "Можно с собакой",
    note: "Кофейня с фирменными рисунками на стаканах и высоким рейтингом.",
    image:
      "https://avatars.mds.yandex.net/get-altay/9753788/2a00000189645b1dc7aaf0918970a04f85db/L_height",
    imageSource: "Яндекс Карты",
    menuUrl: "https://yandex.ru/maps/org/sokol_coffee/181531343256/menu/",
  },
  {
    id: "aj-ippodromny-1",
    name: "AJ Coffee Roasters",
    address: "Ипподромный пер., 1к1, Санкт-Петербург",
    lat: 60.000906,
    lng: 30.308969,
    rating: 5.0,
    ratingCount: 791,
    ratingSource: "Яндекс Карты",
    ratingUpdated: "07.09.2026",
    hours: "Ежедневно 09:00–22:00",
    phone: "+7 999 532-22-32",
    website: "https://ajcoffee.ru",
    averageBill: "500–700 ₽",
    dogFriendly: "Можно с животными",
    note: "Кофейня-обжарщик с завтраками, выпечкой и большим светлым залом.",
    image:
      "https://avatars.mds.yandex.net/get-altay/16403814/2a000001983bd626498a9b1d30ea9c490758/L_height",
    imageSource: "Яндекс Карты",
  },
];
