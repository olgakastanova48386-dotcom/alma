export type MenuItem = {
  id: string;
  name: string;
  price: string;
  category: string;
};

export type PlaceMenu = {
  placeId: number;
  updatedAt: string;
  sourceUrl: string;
  items: MenuItem[];
};

export const placeMenus: Record<number, PlaceMenu> = {
  1002: {
    placeId: 1002,
    updatedAt: "09.09.2026",
    sourceUrl: "https://www.restorating.ru/spb/catalogue/sibaristica",
    items: [
      { id: "cappuccino", name: "Капучино", price: "260 ₽", category: "Кофе" },
      {
        id: "double-cappuccino",
        name: "Дабл капучино",
        price: "300 ₽",
        category: "Кофе",
      },
      { id: "flat-white", name: "Флэт уайт", price: "280 ₽", category: "Кофе" },
      { id: "latte", name: "Латте", price: "310 ₽", category: "Кофе" },
      {
        id: "cheese-grits",
        name: "Сырный гритс со шпинатом и яйцом пашот",
        price: "320 ₽",
        category: "Завтраки",
      },
      {
        id: "oatmeal",
        name: "Овсяная каша с карамелью, бананом и пеканом",
        price: "320 ₽",
        category: "Завтраки",
      },
      {
        id: "english-breakfast",
        name: "Английский завтрак",
        price: "590 ₽",
        category: "Завтраки",
      },
      {
        id: "benedict",
        name: "Яйца бенедикт и хашбраун",
        price: "390 ₽",
        category: "Завтраки",
      },
      {
        id: "avocado-toast",
        name: "Тост с авокадо",
        price: "430 ₽",
        category: "Завтраки",
      },
      {
        id: "salmon-toast",
        name: "Тост с лососем и творожным кремом",
        price: "490 ₽",
        category: "Завтраки",
      },
      {
        id: "syrniki",
        name: "Сырники с ягодным кули и сметаной",
        price: "390 ₽",
        category: "Сладкое",
      },
    ],
  },
};

export function getPlaceMenu(placeId: number) {
  return placeMenus[placeId];
}
