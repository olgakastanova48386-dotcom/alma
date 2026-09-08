"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

export default function AddPhotozonePage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Прикрепи фотографию локации.");
      return;
    }

    setSending(true);
    try {
      const body = new FormData();
      body.set("name", name);
      body.set("address", address);
      body.set("note", note);
      body.set("file", file);

      const response = await fetch("/api/photozone-submissions", {
        method: "POST",
        body,
        credentials: "include",
      });
      const data = await response.json();

      if (response.status === 401) {
        setError("Чтобы предложить фотолокацию, сначала войди в ALMA.");
        return;
      }
      if (!response.ok) throw new Error(data.error || "Не удалось отправить локацию.");

      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Не удалось отправить локацию.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen bg-[#f4f0e9] pt-28 pb-20 text-black">
        <section className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="rounded-[32px] bg-white p-7 sm:p-10 shadow-sm border border-black/5">
            <div className="text-4xl">✓</div>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight">
              Спасибо за фотолокацию
            </h1>
            <p className="mt-4 text-neutral-500 leading-7">
              Она отправлена на проверку ALMA. После модерации мы сможем добавить её в фотогид.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  setName("");
                  setAddress("");
                  setNote("");
                  setFile(null);
                }}
                className="rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white"
              >
                Добавить ещё
              </button>
              <Link
                href="/photozones"
                className="rounded-full border border-black/10 px-6 py-3.5 text-sm font-semibold"
              >
                Смотреть фотолокации
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f0e9] pt-24 sm:pt-28 pb-24 text-black">
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/photozones" className="text-sm text-neutral-500 hover:text-black">
          ← Фотозоны
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[.22em] text-neutral-400">
          ALMA · сообщество
        </p>
        <h1 className="mt-3 text-[42px] sm:text-6xl font-bold leading-[.98] tracking-tight">
          Знаешь красивую<br />фотолокацию?
        </h1>
        <p className="mt-5 max-w-2xl text-base sm:text-lg leading-7 text-neutral-500">
          Поделись местом, где получается красивый кадр. Укажи адрес, добавь фото и,
          если хочется, напиши короткую подсказку — например, когда лучше приходить
          или откуда снимать.
        </p>

        <form onSubmit={submit} className="mt-9 rounded-[30px] bg-white p-5 sm:p-8 border border-black/5 shadow-sm">
          <label className="block">
            <span className="text-sm font-semibold">Название места *</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              required
              placeholder="Например: двор с аркой на Петроградской"
              className="mt-2 w-full rounded-[18px] border border-black/10 bg-[#faf9f7] px-4 py-4 outline-none focus:border-black/30"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold">Адрес или ориентир *</span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={240}
              required
              placeholder="Улица, дом или понятный ориентир"
              className="mt-2 w-full rounded-[18px] border border-black/10 bg-[#faf9f7] px-4 py-4 outline-none focus:border-black/30"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold">Фото *</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-2 block w-full rounded-[18px] border border-dashed border-black/20 bg-[#faf9f7] px-4 py-5 text-sm"
            />
            <span className="mt-2 block text-xs text-neutral-400">JPG, PNG или WEBP · до 1,5 МБ</span>
          </label>

          {preview && (
            <div className="mt-4 overflow-hidden rounded-[22px] bg-neutral-100">
              <img src={preview} alt="Предпросмотр фотографии" className="max-h-[420px] w-full object-cover" />
            </div>
          )}

          <label className="mt-5 block">
            <span className="text-sm font-semibold">Подсказка или комментарий</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={700}
              rows={5}
              placeholder="Например: лучше приходить за час до заката, кадр красивее со стороны набережной."
              className="mt-2 w-full resize-none rounded-[18px] border border-black/10 bg-[#faf9f7] px-4 py-4 outline-none focus:border-black/30"
            />
            <span className="mt-2 block text-right text-xs text-neutral-400">{note.length}/700</span>
          </label>

          {error && (
            <div className="mt-5 rounded-[18px] bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
              {error.includes("войди") && (
                <>
                  {" "}
                  <Link href="/login" className="font-semibold underline">
                    Войти
                  </Link>
                </>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="mt-6 w-full rounded-full bg-black px-6 py-4 font-semibold text-white transition hover:opacity-85 disabled:opacity-50"
          >
            {sending ? "Отправляем…" : "Предложить фотолокацию"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-neutral-400">
            Локация не появляется на сайте автоматически — сначала мы её проверяем.
          </p>
        </form>
      </section>
    </main>
  );
}
