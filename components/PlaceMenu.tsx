"use client";

import { useEffect, useMemo, useState } from "react";
import { getPlaceMenu } from "@/data/placeMenus";

type VoteState = { counts: Record<string, number>; selected: string[] };

export default function PlaceMenu({
  placeId,
  signedIn,
}: {
  placeId: number;
  signedIn: boolean;
}) {
  const menu = getPlaceMenu(placeId);
  const [votes, setVotes] = useState<VoteState>({ counts: {}, selected: [] });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!menu) return;
    fetch(`/api/menu-votes?placeId=${placeId}`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data)
          setVotes({
            counts: data.counts ?? {},
            selected: data.selected ?? [],
          });
      })
      .catch(() => null);
  }, [menu, placeId]);

  const items = useMemo(() => {
    if (!menu) return [];
    return menu.items
      .map((item, index) => ({
        ...item,
        index,
        votes: votes.counts[item.id] ?? 0,
      }))
      .sort((a, b) => b.votes - a.votes || a.index - b.index);
  }, [menu, votes.counts]);

  if (!menu) return null;

  async function toggleVote(itemId: string) {
    if (!signedIn) {
      setMessage("Войдите в аккаунт, чтобы отметить любимую позицию.");
      return;
    }
    const selected = votes.selected.includes(itemId);
    const response = await fetch("/api/menu-votes", {
      method: selected ? "DELETE" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId, itemId }),
    }).catch(() => null);
    if (!response?.ok) {
      setMessage("Не получилось сохранить выбор. Попробуйте ещё раз.");
      return;
    }
    const data = await response.json();
    setVotes({ counts: data.counts ?? {}, selected: data.selected ?? [] });
    setMessage(selected ? "Отметка снята." : "Добавили ваш голос 💛");
  }

  return (
    <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">
            Что заказать
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Меню и выбор гостей</h2>
        </div>
        <span className="text-right text-xs text-neutral-400">
          Проверено {menu.updatedAt}
        </span>
      </div>
      <p className="mt-2 text-sm leading-5 text-neutral-500">
        Нажмите на сердечко у понравившейся позиции. Самые любимые блюда
        поднимаются выше.
      </p>
      <div className="mt-5 space-y-2">
        {items.map((item, index) => {
          const selected = votes.selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleVote(item.id)}
              className="flex w-full items-center gap-3 rounded-2xl bg-[#f7f4ef] px-4 py-3 text-left transition hover:bg-[#efe9e0]"
            >
              <span className="w-5 text-center text-xs font-semibold text-neutral-400">
                {index < 3 && item.votes > 0 ? index + 1 : ""}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-neutral-900">
                  {item.name}
                </span>
                <span className="mt-0.5 block text-xs text-neutral-400">
                  {item.category}
                </span>
              </span>
              <span className="text-sm font-medium">{item.price}</span>
              <span
                className={`min-w-12 rounded-full px-2.5 py-1 text-center text-sm ${selected ? "bg-black text-white" : "bg-white text-neutral-600"}`}
              >
                {selected ? "♥" : "♡"} {item.votes}
              </span>
            </button>
          );
        })}
      </div>
      {message && (
        <p className="mt-3 text-center text-sm text-neutral-500">{message}</p>
      )}
      <p className="mt-4 text-xs leading-5 text-neutral-400">
        Цены могут измениться. Перед заказом уточните актуальность в заведении.
      </p>
    </section>
  );
}
