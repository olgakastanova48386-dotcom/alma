import { places as editorialPlaces } from "@/data/places";
import { coffeePlaces } from "@/data/coffeePlaces";
import { restaurantPlaces } from "@/data/restaurantPlaces";
import { dogFriendlyPlaces } from "@/data/dogFriendlyPlaces";
import { drivePlaces } from "@/data/drivePlaces";

export type MapPlace = {
  id: number; name: string; category: string; mood: string; budget: string; company: string[]; duration: string; image: string; lat: number; lng: number; why: string; address: string; price: string; priceNote: string; detailHref: string;
  description?: string; gallery?: string[];
  rating?: number; ratingScale?: number; ratingCount?: number; ratingSource?: string; dogFriendly?: boolean; drive?: boolean; driveTags?: string[];
  babyCare?: "Пеленальный столик" | "Комната матери и ребёнка" | "Детская комната";
  babyCareVerifiedAt?: string;
};

const hasAlmaRating = (rating: number, scale = 5) => scale === 5 && rating >= 4.5 && rating <= 5;

const demidovGallery = [
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/%D0%9E%D0%B4%D0%B8%D0%BD_%D0%B8%D0%B7_%D0%B7%D0%B0%D0%BB%D0%BE%D0%B2_%D0%BE%D1%81%D0%BE%D0%B1%D0%BD%D1%8F%D0%BA%D0%B0.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/%D0%91._%D0%9C%D0%BE%D1%80%D1%81%D0%BA%D0%B0%D1%8F%2C_43_08.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/%D0%91._%D0%9C%D0%BE%D1%80%D1%81%D0%BA%D0%B0%D1%8F%2C_43_06.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/%D0%9B%D0%B8%D1%84%D1%82._%D0%94%D0%BE%D0%BC_%D0%9F.%D0%9D._%D0%94%D0%B5%D0%BC%D0%B8%D0%B4%D0%BE%D0%B2%D0%B0.jpg",
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
    why: demidov ? "Увидеть один из самых выразительных особняков XIX века и интерьеры, связанные с именем Монферрана." : place.why,
    address: demidov ? "Большая Морская ул., 43, Санкт-Петербург" : place.address,
    price: place.price,
    priceNote: place.priceNote,
    detailHref: `/place/${place.id}`,
    description: demidov ? "Особняк П. Н. Демидова на Большой Морской улице, 43 построен в 1835–1840 годах по проекту Огюста Монферрана. Это памятник архитектуры с богатыми парадными интерьерами; сегодня здание связано с Посольством Италии. Доступ внутрь зависит от формата мероприятий и экскурсий, поэтому условия посещения лучше проверять заранее." : place.description,
    gallery: demidov ? demidovGallery : undefined,
    dogFriendly: place.name === "Севкабель Порт",
  };
});

const coffeeMapPlaces: MapPlace[] = coffeePlaces.filter((p)=>hasAlmaRating(p.rating)).map((p,index)=>{const id=1001+index;return { id,name:p.name,category:"Кофейня",mood:"Спокойно",budget:p.priceNote?"300–1500 ₽":"До 1500 ₽",company:["Один","Пара","Друзья"],duration:"До 1 часа",image:p.image??"",lat:p.lat,lng:p.lng,why:`★ ${p.rating.toFixed(1)} / 5`,address:p.address,price:p.priceNote??"Цена уточняется",priceNote:"Кофе и напитки",detailHref:`/place/${id}`,rating:p.rating,ratingScale:5,ratingCount:p.ratingCount,ratingSource:p.ratingSource,dogFriendly:Boolean(p.dogFriendly) }});

const restaurantMapPlaces: MapPlace[] = restaurantPlaces.filter((p)=>hasAlmaRating(p.rating)).map((p,index)=>{const id=2001+index;return { id,name:p.name,category:"Ресторан",mood:"Вкусно поесть",budget:p.averageBill??"1500–5000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:p.lat,lng:p.lng,why:`★ ${p.rating.toFixed(1)} / 5`,address:p.address,price:p.averageBill??"Чек уточняется",priceNote:"Средний чек",detailHref:`/place/${id}`,rating:p.rating,ratingScale:5,ratingCount:p.ratingCount,ratingSource:p.ratingSource,dogFriendly:Boolean(p.dogFriendly),babyCare:p.babyCare,babyCareVerifiedAt:p.babyCareVerifiedAt }});

const dogMapPlaces: MapPlace[] = dogFriendlyPlaces.filter((p)=>hasAlmaRating(p.rating,p.ratingScale)).filter((d)=>![...basePlaces,...coffeeMapPlaces,...restaurantMapPlaces].some((p)=>p.name.toLowerCase()===d.name.toLowerCase())).map((p,index)=>{const id=3001+index;return { id,name:p.name,category:p.category,mood:"С питомцем",budget:p.budget,company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:p.lat,lng:p.lng,why:`🐾 Dog Friendly · ★ ${p.rating.toFixed(1)} / 5`,address:p.address,price:p.budget,priceNote:"Условия посещения",detailHref:`/place/${id}`,rating:p.rating,ratingScale:5,ratingCount:p.ratingCount,ratingSource:p.ratingSource,dogFriendly:true }});

const driveMapPlaces: MapPlace[] = drivePlaces.filter((p)=>hasAlmaRating(p.rating,p.ratingScale)).map((p)=>({ id:p.id,name:p.name,category:p.category,mood:"Драйв",budget:p.price,company:["Один","Пара","Друзья"],duration:"2–4 часа",image:p.image,lat:p.lat,lng:p.lng,why:p.note,address:p.address,price:p.price,priceNote:"Ориентир по стоимости",detailHref:`/place/${p.id}`,rating:p.rating,ratingScale:5,ratingCount:p.ratingCount,ratingSource:p.ratingSource,drive:true,driveTags:p.tags }));

const photoMapPlaces: MapPlace[] = [
  { id:5001,name:"Дом Бака",category:"Фотолокация",mood:"Вдохновиться",budget:"Бесплатно",company:["Один","Пара","Друзья"],duration:"До 1 часа",image:"https://cdnstatic.rg.ru/uploads/images/2024/11/12/photo_2024-11-11_17-14-13_ac3.jpg",lat:59.944086,lng:30.357996,why:"Воздушные галереи, исторический двор и выразительная архитектура.",address:"Кирочная ул., 24",price:"Бесплатно",priceNote:"Доступ во двор может зависеть от правил дома",detailHref:"/place/5001",rating:4.9,ratingScale:5,ratingCount:1445,ratingSource:"Яндекс Карты" },
  { id:5002,name:"Ракета",category:"Падел-клуб",mood:"Драйв",budget:"Цена уточняется",company:["Один","Пара","Друзья"],duration:"1–2 часа",image:"/images/падл адрес ракета кожевенная линия, 27.jpg",lat:59.923057,lng:30.248787,why:"Падел-корты в индустриальном интерьере с сильной геометрией кадра.",address:"Кожевенная линия, 27, корп. 1",price:"Цена уточняется",priceNote:"Стоимость зависит от времени и формата игры",detailHref:"/place/5002",rating:5,ratingScale:5,ratingCount:12,ratingSource:"2ГИС",drive:true,driveTags:["Активный отдых","С друзьями"] },
];

export const mapPlaces: MapPlace[] = [...basePlaces,...coffeeMapPlaces,...restaurantMapPlaces,...dogMapPlaces,...driveMapPlaces,...photoMapPlaces];
