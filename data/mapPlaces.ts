import { places as editorialPlaces } from "@/data/places";
import { coffeePlaces } from "@/data/coffeePlaces";
import { restaurantPlaces } from "@/data/restaurantPlaces";
import { dogFriendlyPlaces } from "@/data/dogFriendlyPlaces";
import { drivePlaces } from "@/data/drivePlaces";

export type MapPlace = {
  id: number; name: string; category: string; mood: string; budget: string; company: string[]; duration: string; image: string; lat: number; lng: number; why: string; address: string; price: string; priceNote: string; detailHref: string;
  rating?: number; ratingScale?: number; ratingCount?: number; ratingSource?: string; dogFriendly?: boolean; drive?: boolean; driveTags?: string[];
  babyCare?: "Пеленальный столик" | "Комната матери и ребёнка" | "Детская комната";
  babyCareVerifiedAt?: string;
};

const hasAlmaRating = (rating: number, scale = 5) => scale === 5 && rating >= 4.5 && rating <= 5;

const basePlaces: MapPlace[] = editorialPlaces.map((place) => ({ id:place.id,name:place.name,category:place.category,mood:place.mood,budget:place.budget,company:place.company,duration:place.duration,image:place.image,lat:place.lat,lng:place.lng,why:place.why,address:place.address,price:place.price,priceNote:place.priceNote,detailHref:`/place/${place.id}`,dogFriendly:place.name === "Севкабель Порт" }));

const coffeeMapPlaces: MapPlace[] = coffeePlaces.filter((p)=>hasAlmaRating(p.rating)).map((p,index)=>{const id=1001+index;return { id,name:p.name,category:"Кофейня",mood:"Спокойно",budget:p.priceNote?"300–1500 ₽":"До 1500 ₽",company:["Один","Пара","Друзья"],duration:"До 1 часа",image:p.image??"",lat:p.lat,lng:p.lng,why:`★ ${p.rating.toFixed(1)} / 5`,address:p.address,price:p.priceNote??"Цена уточняется",priceNote:"Кофе и напитки",detailHref:`/place/${id}`,rating:p.rating,ratingScale:5,ratingCount:p.ratingCount,ratingSource:p.ratingSource,dogFriendly:Boolean(p.dogFriendly) }});

const restaurantMapPlaces: MapPlace[] = restaurantPlaces.filter((p)=>hasAlmaRating(p.rating)).map((p,index)=>{const id=2001+index;return { id,name:p.name,category:"Ресторан",mood:"Вкусно поесть",budget:p.averageBill??"1500–5000 ₽",company:["Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:p.lat,lng:p.lng,why:`★ ${p.rating.toFixed(1)} / 5`,address:p.address,price:p.averageBill??"Чек уточняется",priceNote:"Средний чек",detailHref:`/place/${id}`,rating:p.rating,ratingScale:5,ratingCount:p.ratingCount,ratingSource:p.ratingSource,dogFriendly:Boolean(p.dogFriendly),babyCare:p.babyCare,babyCareVerifiedAt:p.babyCareVerifiedAt }});

const dogMapPlaces: MapPlace[] = dogFriendlyPlaces.filter((p)=>hasAlmaRating(p.rating,p.ratingScale)).filter((d)=>![...basePlaces,...coffeeMapPlaces,...restaurantMapPlaces].some((p)=>p.name.toLowerCase()===d.name.toLowerCase())).map((p,index)=>{const id=3001+index;return { id,name:p.name,category:p.category,mood:"С питомцем",budget:p.budget,company:["Один","Пара","Друзья","Семья"],duration:"1–2 часа",image:"",lat:p.lat,lng:p.lng,why:`🐾 Dog Friendly · ★ ${p.rating.toFixed(1)} / 5`,address:p.address,price:p.budget,priceNote:"Условия посещения",detailHref:`/place/${id}`,rating:p.rating,ratingScale:5,ratingCount:p.ratingCount,ratingSource:p.ratingSource,dogFriendly:true }});

const driveMapPlaces: MapPlace[] = drivePlaces.filter((p)=>hasAlmaRating(p.rating,p.ratingScale)).map((p)=>({ id:p.id,name:p.name,category:p.category,mood:"Драйв",budget:p.price,company:["Один","Пара","Друзья"],duration:"2–4 часа",image:"",lat:p.lat,lng:p.lng,why:p.note,address:p.address,price:p.price,priceNote:"Ориентир по чеку",detailHref:`/place/${p.id}`,rating:p.rating,ratingScale:5,ratingCount:p.ratingCount,ratingSource:p.ratingSource,drive:true,driveTags:p.tags }));

export const mapPlaces: MapPlace[] = [...basePlaces,...coffeeMapPlaces,...restaurantMapPlaces,...dogMapPlaces,...driveMapPlaces];
