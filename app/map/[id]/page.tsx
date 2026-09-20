"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { events, isEventActive } from "@/data/events";

export default function EventPage() {
  const params = useParams();
  const event = events.find((item) => item.id === String(params.id));

  if (!event || !isEventActive(event)) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 pb-20 pt-32">
        <div className="mx-auto max-w-3xl">
          <Link href="/map" className="text-sm font-semibold">← События</Link>
          <h1 className="mt-8 text-4xl font-bold">Событие завершилось или ещё не началось</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] pb-20 pt-28 text-black sm:pt-32">
      <article className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link href="/map" className="text-sm font-semibold text-black/60">← Все события</Link>
        <div className="mt-6 overflow-hidden rounded-[30px] bg-white p-6 shadow-[0_18px_55px_rgba(0,0,0,.06)] sm:p-10">
          <div className="-mx-6 -mt-6 mb-7 h-[260px] overflow-hidden sm:-mx-10 sm:-mt-10 sm:h-[360px]">
            <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
          </div>
          <span className="rounded-full bg-[#f1eee9] px-3 py-1.5 text-xs font-semibold">{event.category}</span>
          <p className="mt-10 text-sm font-semibold text-neutral-600">{event.date} · {event.place}</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(34px,6vw,64px)] font-bold leading-[1.02] tracking-[-.04em]">{event.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-700">{event.note}</p>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[20px] bg-[#f7f4ef] p-4"><p className="text-xs text-neutral-500">Когда</p><p className="mt-1 font-semibold">{event.date}</p></div>
            <div className="rounded-[20px] bg-[#f7f4ef] p-4"><p className="text-xs text-neutral-500">Где</p><p className="mt-1 font-semibold">{event.place}</p></div>
            <div className="rounded-[20px] bg-[#f7f4ef] p-4"><p className="text-xs text-neutral-500">Категория</p><p className="mt-1 font-semibold">{event.category}</p></div>
          </div>
          <p className="mt-8 border-t border-black/10 pt-5 text-xs leading-5 text-neutral-500">ALMA проверяет актуальность событий и обновляет информацию.</p>
        </div>
      </article>
    </main>
  );
}
