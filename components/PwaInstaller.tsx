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
    <div className="fixed bottom-[calc(7.25rem+env(safe-area-inset-bottom))] left-1/2 z-[300] w-[calc(100%-1.25rem)] max-w-md -translate-x-1/2 rounded-[24px] border-2 border-black bg-white p-3.5 shadow-[0_16px_50px_rgba(0,0,0,.32)] sm:bottom-6 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] border border-black/15 bg-white text-sm font-black tracking-[-.08em]">ALMA</div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold leading-tight text-black">Установить ALMA</p>
          <p className="mt-0.5 text-xs leading-4 text-black/65">Добавь на экран телефона.</p>
        </div>
        <button onClick={install} className="shrink-0 rounded-full bg-black px-4 py-3 text-sm font-bold text-white shadow-lg">
          Установить
        </button>
      </div>
      {showIosHelp ? (
        <p className="mt-3 rounded-2xl bg-black px-4 py-3 text-sm font-medium leading-5 text-white">
          На iPhone: нажми «Поделиться» в Safari → «На экран Домой» → «Добавить».
        </p>
      ) : null}
    </div>
  );
}
