export type RestaurantPlace = {
  id: number;
  name: string;
  rating: number;
  ratingCount: number;
  ratingSource: string;
  ratingUpdated: string;
  address: string;
  lat: number;
  lng: number;
  averageBill?: string;
  phone?: string;
  website?: string;
  dogFriendly?: string;
  note: string;
  sourceUrl: string;
};

export const restaurantPlaces: RestaurantPlace[] = [
  { id: 1, name: "Duo Gastrobar", rating: 4.9, ratingCount: 6614, ratingSource: "Яндекс Карты", ratingUpdated: "07.09.2026", address: "Кирочная ул., 8Б", lat: 59.9442, lng: 30.3527, averageBill: "1800–2000 ₽", phone: "+7 (921) 994-54-43", website: "https://duobar.ru", note: "Авторская кухня, сезонные продукты и завтраки. Ежедневно с 09:00; вс–чт до 00:00, пт–сб до 01:00.", sourceUrl: "https://yandex.com/maps/org/duo_gastrobar/1139174868/" },
  { id: 2, name: "Birch", rating: 5.0, ratingCount: 10173, ratingSource: "Яндекс Карты", ratingUpdated: "07.09.2026", address: "Кирочная ул., 3", lat: 59.9439, lng: 30.3508, averageBill: "от 2500 ₽", phone: "+7 (911) 920-31-65", website: "https://birchrestaurants.com/saintpetersburg", note: "Гастро-бистро Арслана Бердиева с современными интерпретациями блюд разных кухонь мира. Вт–вс 16:30–23:00.", sourceUrl: "https://yandex.com/maps/org/birch/40571415653/" },
  { id: 3, name: "Joli", rating: 5.0, ratingCount: 3501, ratingSource: "Яндекс Карты", ratingUpdated: "07.09.2026", address: "ул. Восстания, 45Б", lat: 59.941426, lng: 30.36188, phone: "+7 (931) 380-22-06", website: "https://atelierfamily.ru/joli-grand-bistrot", note: "Grand Bistrot с французским настроением, собственной пекарней и цветочной лавкой. Ежедневно 09:00–00:00.", sourceUrl: "https://yandex.com/maps/org/joli/224542522414/" },
  { id: 4, name: "Банщики", rating: 5.0, ratingCount: 8053, ratingSource: "Яндекс Карты", ratingUpdated: "07.09.2026", address: "Дегтярная ул., 1А", lat: 59.9303, lng: 30.3702, averageBill: "2500–3500 ₽", phone: "+7 (921) 941-17-44", dogFriendly: "Можно с собакой", note: "Русская кухня в современном прочтении. Входит в Ultima Guide.", sourceUrl: "https://yandex.com/maps/org/banshchiki/153291089798/" },
  { id: 5, name: "Koza Strekoza", rating: 5.0, ratingCount: 7509, ratingSource: "Яндекс Карты", ratingUpdated: "07.09.2026", address: "Ленинский пр., 100к1, этаж 2", lat: 59.853271, lng: 30.220045, averageBill: "1500–2500 ₽", phone: "+7 (812) 456-89-89", dogFriendly: "С собаками до 35 см", note: "Большой семейный ресторан с разнообразным меню и pet-friendly правилами.", sourceUrl: "https://yandex.com/maps/org/koza_strekoza/73884195916/" },
  { id: 6, name: "Mario Trattoria", rating: 5.0, ratingCount: 4477, ratingSource: "Яндекс Карты", ratingUpdated: "07.09.2026", address: "Адмиралтейский пр., 8", lat: 59.9361, lng: 30.3097, averageBill: "от 1650 ₽", phone: "+7 (812) 646-47-41", note: "Итальянская траттория рядом с Исаакиевской площадью: паста, пицца и классика Италии.", sourceUrl: "https://yandex.com/maps/org/mario_trattoriya/172406332031/" },
  { id: 7, name: "Eli-Shumeli", rating: 5.0, ratingCount: 2494, ratingSource: "Яндекс Карты", ratingUpdated: "07.09.2026", address: "наб. реки Мойки, 44", lat: 59.9353, lng: 30.3198, averageBill: "от 700 ₽", phone: "+7 (812) 908-25-28", website: "https://elishumeli.ru", note: "Грузинский ресторан в центре города с большим выбором традиционных блюд.", sourceUrl: "https://yandex.com/maps/org/yeli_shumeli/70189682604/" },
  { id: 8, name: "Ресторан 995", rating: 5.0, ratingCount: 524, ratingSource: "Яндекс Карты", ratingUpdated: "07.09.2026", address: "ул. Челюскина, 2", lat: 59.941249, lng: 30.194991, phone: "+7 (995) 598-29-29", website: "https://995.rest", note: "Кавказская кухня: хинкали, хачапури, шашлык и грузинские блюда.", sourceUrl: "https://yandex.com/maps/org/restoran_995/160797686569/" },
  { id: 9, name: "Tillander", rating: 5.0, ratingCount: 107, ratingSource: "Яндекс Карты", ratingUpdated: "07.09.2026", address: "Большая Морская ул., 28/13", lat: 59.9339, lng: 30.3134, averageBill: "1200–2500 ₽", phone: "+7 (812) 409-60-10", website: "https://tillander.ru", note: "Ресторан в центре Петербурга с европейским меню и спокойной атмосферой.", sourceUrl: "https://yandex.com/maps/org/tillander/175040689362/" },
  { id: 10, name: "Salone pasta&bar", rating: 5.0, ratingCount: 7007, ratingSource: "Яндекс Карты", ratingUpdated: "07.09.2026", address: "наб. реки Фонтанки, 30", lat: 59.93877, lng: 30.343563, phone: "+7 (921) 777-06-23", website: "https://atelierfamily.ru/salone-pasta-and-bar", note: "Итальянский ресторан с культом свежей пасты, которую пастайоло лепят вручную прямо в зале. Вс–чт 12:00–00:00, пт–сб 12:00–02:00.", sourceUrl: "https://yandex.com/maps/2/saint-petersburg/search/Salone%20pasta%26bar/" },
];
