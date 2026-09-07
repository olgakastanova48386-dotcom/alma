"use client";

import { useEffect } from "react";

function cleanRouteText(root: HTMLElement) {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".alma-route-actions").forEach((el) => el.remove());
  const text = clone.innerText
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const url = window.location.href;
  return `${text}\n\nОткрыть маршрут в ALMA:\n${url}\n`;
}

export default function RouteSaveMobileFix() {
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button") as HTMLButtonElement | null;
      if (!button || !button.textContent?.includes("Сохранить на телефон")) return;

      const route = document.querySelector(".alma-purchased-route") as HTMLElement | null;
      if (!route) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const text = cleanRouteText(route);
      const file = new File([text], "alma-route.txt", { type: "text/plain;charset=utf-8" });

      try {
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: "Мой маршрут ALMA",
            text: "Сохрани маршрут ALMA на телефон",
            files: [file],
          });
          return;
        }
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return;
      }

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "alma-route.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
