"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { mapPlaces } from "@/data/mapPlaces";

type Zone = { name:string; image:string; area:string; category:string; note:string; best:string; tall?:boolean; premium?:boolean };

const zones: Zone[] = [
 {name:"Дом Бака",image:"https://cdnstatic.rg.ru/uploads/images/2024/11/12/photo_2024-11-11_17-14-13_ac3.jpg",area:"Кирочная улица",category:"Архитектура",note:"Воздушные галереи, старый двор и тот самый петербургский кадр вверх.",best:"Мягкий дневной свет",tall:true},
 {name:"Мозаичный дворик",image:"https://www.atorus.ru/sites/default/files/styles/amp_1200x675_16_9/public/2024-07/%D0%9C%D0%BE%D0%B7%D0%B0%D0%B8%D1%87%D0%BD%D1%8B%D0%B9%20%D0%B4%D0%B2%D0%BE%D1%80%D0%B8%D0%BA%20%D0%B2%20%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3%D0%B5.%20%D0%A4%D0%BE%D1%82%D0%BE%20Visit%20Peterburg.jpg.webp?itok=qCIirRA3",area:"ул. Чайковского, 2/7",category:"Необычные",note:"Цвет, мозаика и детали — особенно хорош, когда Петербург серый.",best:"Днём"},
 {name:"Севкабель Порт",image:"https://www.atorus.ru/sites/default/files/styles/article_width/public/2023-08/%D0%A1%D0%B5%D0%B2%D0%BA%D0%B0%D0%B1%D0%B5%D0%BB%D1%8C_DJI_0074-HDR.jpg.webp?itok=QQR016F8",area:"Кожевенная линия",category:"Закат",note:"Индустриальный берег, вода и большое небо. Здесь кадр делает свет.",best:"За час до заката",tall:true,premium:true},
 {name:"Ракета",image:"/images/падл адрес ракета кожевенная линия, 27.jpg",area:"Кожевенная линия, 27",category:"Необычные",note:"Падел-корты в индустриальном интерьере с люстрами, сеткой и сильной геометрией кадра.",best:"Днём или вечером · в помещении",premium:true},
 {name:"Новая Голландия",image:"https://4traveler.me/sites/default/files/user_images/travel/St.pt/konnogvard/DSC07708.jpg",area:"остров Новая Голландия",category:"Романтика",note:"Кирпич, вода и спокойная геометрия для городских кадров вдвоём.",best:"Вечер",premium:true},
 {name:"Поцелуев мост",image:"/images/kisses-bridge.jpg",area:"набережная Мойки",category:"Романтика",note:"Вода, перспектива и классический Петербург без музейного ощущения.",best:"Золотой час",tall:true},
 {name:"Исаакиевская площадь",image:"/images/isaac.jpg",area:"Адмиралтейский район",category:"Архитектура",note:"Масштаб, колонны и длинные линии — место для более кинематографичного кадра.",best:"Раннее утро",premium:true},
];

const filters=["Все","Романтика","Архитектура","Закат","Необычные"];

export default function PhotozonesPage(){
 const [filter,setFilter]=useState("Все");
 const shown=useMemo(()=>filter==="Все"?zones:zones.filter(z=>z.category===filter),[filter]);
 const mapHref=(name:string)=>{const normalized=name.toLowerCase();const match=mapPlaces.find(p=>p.name.toLowerCase()===normalized||p.name.toLowerCase().includes(normalized)||normalized.includes(p.name.toLowerCase()));return match?`/map?place=${match.id}`:"/map"};
 return <main className="min-h-screen bg-[#f4f0e9] pt-24 sm:pt-28 pb-24 text-black">
  <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
   <div className="border-b border-black/10 pb-8 sm:pb-12 lg:grid lg:grid-cols-[1.25fr_.75fr] lg:items-end lg:gap-16">
    <div><h1 className="max-w-4xl text-[48px] sm:text-7xl lg:text-[92px] font-bold leading-[.88] tracking-[-.055em]">Город как<br/><span className="font-serif italic font-normal">в сохранёнках.</span></h1></div>
    <div className="mt-7 lg:mt-0"><p className="max-w-md text-base sm:text-lg leading-7 text-neutral-600">Не список достопримечательностей, а места, ради которых хочется достать камеру. Выбирай настроение — ALMA подскажет, где получится тот самый кадр.</p><div className="mt-5"><Link href="/photozones/add" className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">＋ Предложить фотолокацию</Link></div><p className="mt-4 text-xs text-neutral-400">Фотографии используются как иллюстрация локаций. Для заведений ALMA публикует только подтверждённые данные.</p></div>
   </div>

   <div className="sticky top-[76px] z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-4 bg-[#f4f0e9]/95 backdrop-blur flex gap-2 overflow-x-auto">
    {filters.map(x=><button key={x} onClick={()=>setFilter(x)} className={`shrink-0 rounded-full px-4 py-2.5 text-sm transition ${filter===x?"bg-black text-white":"bg-white border border-black/10 hover:border-black/30"}`}>{x}</button>)}
   </div>

   <div className="mt-3 columns-2 lg:columns-3 gap-3 sm:gap-5 [column-fill:_balance]">
    {shown.map((z)=><article key={z.name} className="group relative mb-3 sm:mb-5 break-inside-avoid overflow-hidden rounded-[18px] sm:rounded-[28px] bg-neutral-200">
      <Link href={mapHref(z.name)} aria-label={`${z.name} на карте ALMA`} className="block"><div className={`${z.tall?"aspect-[3/5]":"aspect-[4/5]"} relative`}><img src={z.image} alt={z.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/5"/><div className="absolute left-3 top-3 sm:left-4 sm:top-4 flex gap-2"><span className="rounded-full bg-white/90 backdrop-blur px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs">{z.category}</span>{z.premium&&<span className="rounded-full bg-black/75 backdrop-blur px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs text-white">ALMA+</span>}</div><div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-6 text-white"><p className="hidden sm:block text-xs text-white/55">{z.area}</p><h2 className="text-lg sm:text-3xl font-bold leading-tight sm:mt-1">{z.name}</h2><p className="hidden sm:block mt-2 max-w-sm text-sm leading-5 text-white/70">{z.note}</p><div className="mt-2.5 sm:mt-4 flex items-center justify-between gap-2"><span className="text-[10px] sm:text-xs text-white/65">◷ {z.best}</span><span className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full bg-white text-black">↗</span></div></div></div></Link>
    </article>)}
   </div>

   <div className="mt-12 sm:mt-20 grid lg:grid-cols-2 gap-4 sm:gap-6">
    <div className="rounded-[28px] sm:rounded-[38px] bg-black p-6 sm:p-10 text-white"><p className="text-xs uppercase tracking-[.2em] text-white/45">ALMA+ · PHOTO GUIDE</p><h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">Не просто адрес.<br/>Готовый кадр.</h2><p className="mt-4 max-w-lg text-sm sm:text-base leading-7 text-white/60">В полном фотогиде откроем точную точку съёмки, лучший свет, ракурс, подсказку по образу и несколько кадров рядом — чтобы не искать всё по отдельности.</p><div className="mt-7 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-white/10 px-3 py-2">Точная точка</span><span className="rounded-full bg-white/10 px-3 py-2">Лучшее время</span><span className="rounded-full bg-white/10 px-3 py-2">Ракурс</span><span className="rounded-full bg-white/10 px-3 py-2">Что надеть</span></div></div>
    <div className="rounded-[28px] sm:rounded-[38px] bg-[#ddd4c8] p-6 sm:p-10 flex flex-col justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-black/40">Фото + прогулка</p><h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">Собрать целый день вокруг кадра</h2><p className="mt-4 max-w-lg text-sm sm:text-base leading-7 text-black/55">Фототочка может стать короткой остановкой между главными местами — без городского марафона.</p></div><Link href="/surprise" className="mt-8 self-start rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white">✦ Собрать маршрут</Link></div>
   </div>
  </section>
 </main>;
}
