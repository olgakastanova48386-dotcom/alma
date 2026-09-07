import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ALMA",
    short_name: "ALMA",
    description: "Места и готовые маршруты Санкт-Петербурга под твоё настроение.",
    start_url: "/?source=app",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    orientation: "portrait",
    lang: "ru",
    icons: [
      { src: "/alma-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/alma-icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Удиви меня", short_name: "Удиви", url: "/surprise" },
      { name: "Карта ALMA", short_name: "Карта", url: "/map" },
      { name: "Профиль", short_name: "Профиль", url: "/profile" },
    ],
  };
}
