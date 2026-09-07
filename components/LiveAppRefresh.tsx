"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const REFRESH_EVENT = "alma:data-updated";
const HIDDEN_RELOAD_AFTER_MS = 30_000;

export default function LiveAppRefresh() {
  const router = useRouter();
  const hiddenAt = useRef<number | null>(null);
  const refreshing = useRef(false);

  useEffect(() => {
    const refreshSoft = () => {
      if (refreshing.current) return;
      refreshing.current = true;
      router.refresh();
      window.setTimeout(() => {
        refreshing.current = false;
      }, 700);
    };

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      try {
        const input = args[0];
        const init = args[1];
        const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
        const requestUrl = input instanceof Request ? input.url : String(input);
        const sameOrigin = requestUrl.startsWith("/") || requestUrl.startsWith(window.location.origin);
        if (sameOrigin && response.ok && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
          window.dispatchEvent(new Event(REFRESH_EVENT));
        }
      } catch {}
      return response;
    };

    const onDataUpdated = () => {
      window.setTimeout(refreshSoft, 80);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenAt.current = Date.now();
        return;
      }
      const wasHiddenFor = hiddenAt.current ? Date.now() - hiddenAt.current : 0;
      hiddenAt.current = null;
      if (wasHiddenFor >= HIDDEN_RELOAD_AFTER_MS) {
        window.location.reload();
      } else {
        refreshSoft();
      }
    };

    const onFocus = () => refreshSoft();
    const onOnline = () => window.location.reload();
    const onStorage = () => refreshSoft();

    window.addEventListener(REFRESH_EVENT, onDataUpdated);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);
    window.addEventListener("storage", onStorage);

    let registration: ServiceWorkerRegistration | null = null;
    let updateTimer: number | null = null;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          registration = reg;
          reg.update().catch(() => undefined);
          updateTimer = window.setInterval(() => reg.update().catch(() => undefined), 5 * 60_000);
          if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
          reg.addEventListener("updatefound", () => {
            const worker = reg.installing;
            if (!worker) return;
            worker.addEventListener("statechange", () => {
              if (worker.state === "installed" && navigator.serviceWorker.controller) {
                worker.postMessage({ type: "SKIP_WAITING" });
              }
            });
          });
        })
        .catch(() => undefined);

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }

    return () => {
      window.fetch = originalFetch;
      window.removeEventListener(REFRESH_EVENT, onDataUpdated);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("storage", onStorage);
      if (updateTimer) window.clearInterval(updateTimer);
      registration = null;
    };
  }, [router]);

  return null;
}
