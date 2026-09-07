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
    <div className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] left-1/2 z-[300] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-[22px] bg-white/95 p-3 shadow-[0_8px_22px_rgba(0,0,0,.16)] backdrop-blur sm:bottom-6 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-black/[.04] text-sm font-black tracking-[-.08em]">ALMA</div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold leading-tight text-black">Установить ALMA</p>
          <p className="mt-0.5 text-[12px] leading-4 text-black/60">Добавь на экран телефона.</p>
        </div>
        <button onClick={install} className="shrink-0 rounded-full bg-black px-4 py-2.5 text-[13px] font-bold text-white shadow-sm">
          Установить
        </button>
      </div>
      {showIosHelp ? (
        <p className="mt-2.5 rounded-2xl bg-black/[.05] px-3.5 py-2.5 text-[12px] font-medium leading-4 text-black/75">
          На iPhone: «Поделиться» → «На экран Домой» → «Добавить».
        </p>
      ) : null}
    </div>
  );
}
