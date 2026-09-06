"use client";

import { useEffect } from "react";

const DOG_FRIENDLY_PLACE_NAMES = new Set([
  "Севкабель Порт",
]);

export default function DogFriendlyMapEnhancer() {
  useEffect(() => {
    const enhancePopups = () => {
      document
        .querySelectorAll<HTMLElement>(".alma-popup")
        .forEach((popup) => {
          if (popup.dataset.dogFriendlyChecked === "true") return;

          const title = popup
            .querySelector<HTMLElement>(".alma-popup-title")
            ?.textContent?.trim();

          if (!title || !DOG_FRIENDLY_PLACE_NAMES.has(title)) {
            popup.dataset.dogFriendlyChecked = "true";
            return;
          }

          const tags = popup.querySelector<HTMLElement>(".alma-popup-tags");

          if (tags && !tags.querySelector("[data-dog-friendly-badge]")) {
            const badge = document.createElement("span");
            badge.dataset.dogFriendlyBadge = "true";
            badge.textContent = "🐾 Можно с собакой";
            badge.title = "Dog Friendly";
            badge.style.fontWeight = "600";
            tags.appendChild(badge);
          }

          popup.dataset.dogFriendlyChecked = "true";
        });
    };

    enhancePopups();

    const observer = new MutationObserver(enhancePopups);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
