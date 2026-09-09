"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const MAX_FILE_SIZE = 1_500_000;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function AddPhotozonePage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function selectFile(selectedFile: File | null) {
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }
    if (!ALLOWED_FILE_TYPES.has(selectedFile.type)) {
      setFile(null);
      setError("Выбери фотографию в формате JPG, PNG или WEBP.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("Размер фотографии не должен превышать 1,5 МБ.");
      return;
    }

    setFile(selectedFile);
  }

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
              Спасибо!
            </h1>
            <p className="mt-4 text-neutral-500 leading-7">
              Фотолокация отправлена на проверку ALMA.
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
          ← Все фотолокации
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
            <span className="text-sm font-semibold">Название фотолокации</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              required
              placeholder="Например, двор с аркой на Петроградской"
              className="mt-2 w-full rounded-[18px] border border-black/10 bg-[#faf9f7] px-4 py-4 outline-none focus:border-black/30"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold">Адрес или ориентир</span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={240}
              required
              placeholder="Улица, номер дома или понятный ориентир"
              className="mt-2 w-full rounded-[18px] border border-black/10 bg-[#faf9f7] px-4 py-4 outline-none focus:border-black/30"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold">Фотография места</span>
            <span className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-black/20 bg-[#faf9f7] px-4 py-5 text-center transition hover:border-black/40 hover:bg-[#f7f5f1]">
              <span className="text-2xl" aria-hidden="true">📷</span>
              <span className="mt-2 text-sm font-semibold">
                {file ? "Выбрать другую фотографию" : "Выбрать фотографию"}
              </span>
              <span className="mt-1 text-xs text-neutral-400">
                JPG, PNG или WEBP · до 1,5 МБ
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={(event) => selectFile(event.target.files?.[0] || null)}
                className="sr-only"
              />
            </span>
          </label>

          {preview && (
            <div className="mt-4 overflow-hidden rounded-[22px] border border-black/5 bg-neutral-100">
              <img src={preview} alt="Предпросмотр фотографии" className="max-h-[420px] w-full object-cover" />
            </div>
          )}

          <label className="mt-5 block">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold">Комментарий</span>
              <span className="text-xs text-neutral-400">Необязательно</span>
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={700}
              rows={5}
              placeholder="Например, когда лучше приходить и откуда снимать"
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
