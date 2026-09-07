"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function detectStandalone() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

function detectIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function PwaInstaller() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [isIos] = useState(detectIos);
  const [isStandalone] = useState(detectStandalone);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (isStandalone || (!promptEvent && !isIos)) return null;

  async function install() {
    if (promptEvent) {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") setPromptEvent(null);
      return;
    }
    setShowIosHelp(true);
  }

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-[200] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-[28px] border-2 border-black bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,.28)] sm:bottom-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] border border-black/15 bg-white text-base font-black tracking-[-.08em]">ALMA</div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold leading-tight text-black">Установить ALMA</p>
            <p className="mt-1 text-sm leading-5 text-black/65">Добавь ALMA на экран телефона и открывай как приложение.</p>
          </div>
        </div>
        <button onClick={install} className="w-full shrink-0 rounded-full bg-black px-5 py-3.5 text-base font-bold text-white shadow-lg sm:w-auto">
          Установить ALMA
        </button>
      </div>
      {showIosHelp ? (
        <p className="mt-4 rounded-2xl bg-black px-4 py-3 text-sm font-medium leading-5 text-white">
          На iPhone: нажми «Поделиться» в Safari → «На экран Домой» → «Добавить».
        </p>
      ) : null}
    </div>
  );
}
