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
    <div className="fixed bottom-4 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-[24px] border border-black/10 bg-white p-4 shadow-2xl sm:bottom-6">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-black/10 bg-white text-sm font-black tracking-[-.08em]">ALMA</div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-black">Установить ALMA</p>
          <p className="text-sm text-black/55">Открывай как обычное приложение с экрана телефона.</p>
        </div>
        <button onClick={install} className="rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white">
          Установить
        </button>
      </div>
      {showIosHelp ? (
        <p className="mt-3 rounded-2xl bg-black/[.04] px-4 py-3 text-sm leading-5 text-black/70">
          На iPhone: нажми «Поделиться» в Safari → «На экран Домой» → «Добавить».
        </p>
      ) : null}
    </div>
  );
}
