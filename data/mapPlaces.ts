import { places as editorialPlaces } from "@/data/places";
import { coffeePlaces } from "@/data/coffeePlaces";
import { restaurantPlaces } from "@/data/restaurantPlaces";
import { dogFriendlyPlaces } from "@/data/dogFriendlyPlaces";

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
  rating?: number;
  ratingScale?: number;
  ratingCount?: number;
  ratingSource?: string;
  dogFriendly?: boolean;
};

const hasAlmaRating = (rating: number, scale = 5) => scale === 5 && rating >= 4.5 && rating <= 5;

const basePlaces: MapPlace[] = editorialPlaces.map((place) => ({
  id: place.id,
  name: place.name,
  category: place.category,
  mood: place.mood,
  budget: place.budget,
  company: place.company,
  duration: place.duration,
  image: place.image,
  lat: place.lat,
  lng: place.lng,
  why: place.why,
  address: place.address,
  price: place.price,
  priceNote: place.priceNote,
  detailHref: `/place/${place.id}`,
  dogFriendly: place.name === "Севкабель Порт",
}));

const coffeeMapPlaces: MapPlace[] = coffeePlaces
  .filter((place) => hasAlmaRating(place.rating))
  .map((place, index) => ({
    id: 1001 + index,
    name: place.name,
    category: "Кофейня",
    mood: "Спокойно",
    budget: place.priceNote ? "300–1500 ₽" : "До 1500 ₽",
    company: ["Один", "Пара", "Друзья"],
    duration: "До 1 часа",
    image: place.image ?? "",
    lat: place.lat,
    lng: place.lng,
    why: `★ ${place.rating.toFixed(1)} / 5`,
    address: place.address,
    price: place.priceNote ?? "Цена уточняется",
    priceNote: "Кофе и напитки",
    detailHref: "/coffee",
    rating: place.rating,
    ratingScale: 5,
    ratingCount: place.ratingCount,
    ratingSource: place.ratingSource,
    dogFriendly: Boolean(place.dogFriendly),
  }));

const restaurantMapPlaces: MapPlace[] = restaurantPlaces
  .filter((place) => hasAlmaRating(place.rating))
  .map((place, index) => ({
    id: 2001 + index,
    name: place.name,
    category: "Ресторан",
    mood: "Вкусно поесть",
    budget: place.averageBill ?? "1500–5000 ₽",
    company: ["Пара", "Друзья", "Семья"],
    duration: "1–2 часа",
    image: "",
    lat: place.lat,
    lng: place.lng,
    why: `★ ${place.rating.toFixed(1)} / 5`,
    address: place.address,
    price: place.averageBill ?? "Чек уточняется",
    priceNote: "Средний чек",
    detailHref: "/restaurants",
    rating: place.rating,
    ratingScale: 5,
    ratingCount: place.ratingCount,
    ratingSource: place.ratingSource,
    dogFriendly: Boolean(place.dogFriendly),
  }));

const dogMapPlaces: MapPlace[] = dogFriendlyPlaces
  .filter((place) => hasAlmaRating(place.rating, place.ratingScale))
  .filter((dogPlace) => {
    const alreadyExists = [...basePlaces, ...coffeeMapPlaces, ...restaurantMapPlaces].some(
      (place) => place.name.toLowerCase() === dogPlace.name.toLowerCase()
    );
    return !alreadyExists;
  })
  .map((place, index) => ({
    id: 3001 + index,
    name: place.name,
    category: place.category,
    mood: "С питомцем",
    budget: place.budget,
    company: ["Один", "Пара", "Друзья", "Семья"],
    duration: "1–2 часа",
    image: "",
    lat: place.lat,
    lng: place.lng,
    why: `🐾 Dog Friendly · ★ ${place.rating.toFixed(1)} / 5`,
    address: place.address,
    price: place.budget,
    priceNote: "Условия посещения",
    detailHref: "/dog-friendly",
    rating: place.rating,
    ratingScale: 5,
    ratingCount: place.ratingCount,
    ratingSource: place.ratingSource,
    dogFriendly: true,
  }));

export const mapPlaces: MapPlace[] = [
  ...basePlaces,
  ...coffeeMapPlaces,
  ...restaurantMapPlaces,
  ...dogMapPlaces,
];
