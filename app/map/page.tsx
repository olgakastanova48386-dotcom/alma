"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { places } from "@/data/places";

declare global {
  interface Window {
    L: any;
  }
}

export default function MapPage() {
  const searchParams = useSearchParams();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  const markersRef = useRef<
    {
      id: number;
      marker: any;
    }[]
  >([]);

  const [leafletReady, setLeafletReady] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);

  const mood = searchParams.get("mood");
  const budget = searchParams.get("budget");
  const company = searchParams.get("company");
  const duration = searchParams.get("duration");
  const placeId = searchParams.get("place");

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const moodMatches =
        !mood || place.mood === mood;

      const budgetMatches =
        !budget || place.budget === budget;

      const companyMatches =
        !company || place.company.includes(company);

      const durationMatches =
        !duration || place.duration === duration;

      return (
        moodMatches &&
        budgetMatches &&
        companyMatches &&
        durationMatches
      );
    });
  }, [mood, budget, company, duration]);

  /*
   * Загружаем Leaflet.
   */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const existingCss = document.querySelector(
      'link[data-leaflet-css="true"]'
    );

    if (!existingCss) {
      const link = document.createElement("link");

      link.rel = "stylesheet";
      link.href =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

      link.setAttribute(
        "data-leaflet-css",
        "true"
      );

      document.head.appendChild(link);
    }

    if (window.L) {
      setLeafletReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[data-leaflet-js="true"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => {
          setLeafletReady(true);
        }
      );

      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

    script.async = true;

    script.setAttribute(
      "data-leaflet-js",
      "true"
    );

    script.onload = () => {
      setLeafletReady(true);
    };

    document.body.appendChild(script);
  }, []);

  /*
   * Создаём карту.
   */

  useEffect(() => {
    if (!leafletReady) return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    mapRef.current = window.L.map(
      mapContainerRef.current,
      {
        zoomControl: false,
        attributionControl: true,
      }
    ).setView(
      [59.9386, 30.3141],
      11
    );

    window.L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    ).addTo(mapRef.current);

    window.L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(mapRef.current);

    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);
  }, [leafletReady]);

  /*
   * Добавляем места на карту.
   */

  useEffect(() => {
    if (!leafletReady) return;
    if (!mapRef.current) return;

    markersRef.current.forEach(
      ({ marker }) => {
        marker.remove();
      }
    );

    markersRef.current = [];

    filteredPlaces.forEach((place) => {
      const markerIcon =
        window.L.divIcon({
          className:
            "alma-marker-wrapper",

          html: `
            <div class="alma-marker">
              <div class="alma-marker-dot"></div>
            </div>
          `,

          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -18],
        });

      const marker = window.L.marker(
        [place.lat, place.lng],
        {
          icon: markerIcon,
        }
      ).addTo(mapRef.current);

      /*
       * POPUP БЕЗ ФОТОГРАФИИ.
       */

      marker.bindPopup(
        `
          <div class="alma-popup">

            <div class="alma-popup-content">

              <div class="alma-popup-category">
                ${place.category}
              </div>

              <div class="alma-popup-title">
                ${place.name}
              </div>

              <div class="alma-popup-why">
                ${place.why}
              </div>

              <div class="alma-popup-price">

                <div class="alma-popup-price-info">

                  <span>
                    Стоимость
                  </span>

                  <small>
                    ${place.priceNote}
                  </small>

                </div>

                <strong>
                  ${place.price}
                </strong>

              </div>

              <div class="alma-popup-tags">

                <span>
                  ${place.mood}
                </span>

                <span>
                  ${place.duration}
                </span>

              </div>

              <a
                href="/place/${place.id}"
                class="alma-popup-button"
              >
                Подробнее →
              </a>

            </div>

          </div>
        `,
        {
          maxWidth: 330,
          minWidth: 300,
          className:
            "alma-leaflet-popup",
        }
      );

      marker.on(
        "click",
        () => {
          setSelectedPlace(place.id);
        }
      );

      markersRef.current.push({
        id: place.id,
        marker,
      });
    });
  }, [filteredPlaces, leafletReady]);

  /*
   * Перемещаем карту к выбранному месту.
   */

  const focusPlace = (
    place: (typeof places)[number]
  ) => {
    setSelectedPlace(place.id);

    if (!mapRef.current) return;

    mapRef.current.flyTo(
      [place.lat, place.lng],
      15,
      {
        duration: 1.1,
      }
    );

    const markerItem =
      markersRef.current.find(
        (item) =>
          item.id === place.id
      );

    if (markerItem) {
      setTimeout(() => {
        markerItem.marker.openPopup();
      }, 550);
    }
  };

  /*
   * Поддержка ссылки:
   * /map?place=9
   */

  useEffect(() => {
    if (!placeId) return;
    if (!leafletReady) return;
    if (!mapRef.current) return;

    if (
      markersRef.current.length === 0
    ) {
      return;
    }

    const numericId =
      Number(placeId);

    if (
      !Number.isFinite(numericId)
    ) {
      return;
    }

    const place = places.find(
      (item) =>
        item.id === numericId
    );

    if (!place) return;

    const markerExists =
      markersRef.current.some(
        (item) =>
          item.id === place.id
      );

    if (!markerExists) return;

    focusPlace(place);
  }, [
    placeId,
    leafletReady,
    filteredPlaces,
  ]);

  const hasFilters =
    mood ||
    budget ||
    company ||
    duration;

  return (
    <>
      <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-32 pb-10">

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">

          {/* TITLE */}

          <div className="mb-6 sm:mb-8">

            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
              ALMA · Санкт-Петербург
            </p>

            <div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

              <div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Карта мест
                </h1>

                <p className="mt-3 text-neutral-500 text-base sm:text-lg max-w-2xl">
                  Выбирай место по настроению,
                  компании и формату отдыха.
                </p>

              </div>

              <div className="inline-flex self-start lg:self-auto rounded-full bg-white border border-black/5 px-4 py-2.5 text-sm text-neutral-600 shadow-sm">

                Найдено:

                <span className="ml-1.5 font-semibold text-black">
                  {
                    filteredPlaces.length
                  }
                </span>

              </div>

            </div>

          </div>

          {/* ACTIVE FILTERS */}

          {hasFilters && (
            <div className="mb-5 flex flex-wrap gap-2">

              {mood && (
                <span className="rounded-full bg-black text-white px-4 py-2 text-sm">
                  {mood}
                </span>
              )}

              {budget && (
                <span className="rounded-full bg-white border border-black/5 px-4 py-2 text-sm">
                  {budget}
                </span>
              )}

              {company && (
                <span className="rounded-full bg-white border border-black/5 px-4 py-2 text-sm">
                  {company}
                </span>
              )}

              {duration && (
                <span className="rounded-full bg-white border border-black/5 px-4 py-2 text-sm">
                  {duration}
                </span>
              )}

              <a
                href="/map"
                className="rounded-full bg-white border border-black/5 px-4 py-2 text-sm text-neutral-500 hover:text-black transition"
              >
                Сбросить
              </a>

            </div>
          )}

          <section className="grid lg:grid-cols-[390px_minmax(0,1fr)] gap-5 lg:gap-6 items-stretch">

            {/* LEFT LIST */}

            <div className="order-2 lg:order-1 bg-white rounded-[28px] border border-black/5 shadow-sm overflow-hidden">

              <div className="px-5 sm:px-6 pt-6 pb-4 border-b border-black/5">

                <p className="font-semibold text-lg">
                  Подходящие места
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Нажми на место, чтобы найти его на карте.
                </p>

              </div>

              <div className="max-h-[700px] overflow-y-auto p-3">

                {filteredPlaces.length ===
                0 ? (

                  <div className="px-4 py-12 text-center">

                    <p className="text-lg font-semibold">
                      Ничего не нашли
                    </p>

                    <p className="mt-2 text-sm text-neutral-500 leading-6">
                      Попробуй изменить один из фильтров.
                    </p>

                    <a
                      href="/map"
                      className="inline-flex mt-5 rounded-full bg-black text-white px-5 py-3 text-sm font-medium"
                    >
                      Показать все места
                    </a>

                  </div>

                ) : (

                  filteredPlaces.map(
                    (place) => {
                      const active =
                        selectedPlace ===
                        place.id;

                      return (
                        <button
                          key={
                            place.id
                          }
                          type="button"
                          onClick={() =>
                            focusPlace(
                              place
                            )
                          }
                          className={`w-full text-left rounded-[22px] p-3 mb-2 transition-all duration-300 ${
                            active
                              ? "bg-black text-white"
                              : "hover:bg-[#f5f2ed]"
                          }`}
                        >

                          <div className="flex gap-3">

                            {/* PHOTO ONLY IN LIST */}

                            <div className="w-[94px] h-[92px] rounded-[17px] overflow-hidden shrink-0 bg-neutral-100">

                              <img
                                src={
                                  place.image
                                }
                                alt={
                                  place.name
                                }
                                className="w-full h-full object-cover"
                              />

                            </div>

                            <div className="min-w-0 flex-1 py-0.5">

                              <p
                                className={`text-[11px] uppercase tracking-[0.13em] ${
                                  active
                                    ? "text-white/50"
                                    : "text-neutral-400"
                                }`}
                              >
                                {
                                  place.category
                                }
                              </p>

                              <h2 className="mt-1 text-base font-semibold leading-5">
                                {
                                  place.name
                                }
                              </h2>

                              <div className="mt-3 flex flex-wrap gap-1.5">

                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs ${
                                    active
                                      ? "bg-white/10 text-white/80"
                                      : "bg-[#f3f1ed] text-neutral-600"
                                  }`}
                                >
                                  {
                                    place.mood
                                  }
                                </span>

                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    active
                                      ? "bg-white text-black"
                                      : "bg-black text-white"
                                  }`}
                                >
                                  {
                                    place.price
                                  }
                                </span>

                              </div>

                            </div>

                          </div>

                        </button>
                      );
                    }
                  )
                )}

              </div>

            </div>

            {/* MAP */}

            <div className="order-1 lg:order-2 relative">

              <div className="alma-map relative min-h-[560px] lg:min-h-[760px] rounded-[28px] overflow-hidden bg-[#ebe8e3] border border-black/5 shadow-sm">

                <div
                  ref={
                    mapContainerRef
                  }
                  className="absolute inset-0 z-0"
                />

                {!leafletReady && (
                  <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#ebe8e3]">

                    <div className="text-center">

                      <div className="mx-auto w-10 h-10 rounded-full border-2 border-black/15 border-t-black animate-spin" />

                      <p className="mt-4 text-sm text-neutral-500">
                        Загружаем карту…
                      </p>

                    </div>

                  </div>
                )}

                {/* ALMA BADGE */}

                <div className="absolute z-[500] left-4 bottom-4 rounded-full bg-black text-white px-4 py-2 text-sm font-semibold tracking-[0.12em] shadow-lg pointer-events-none">
                  alma
                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

      <style jsx global>{`

        /* MAP */

        .alma-map .leaflet-tile-pane {
          filter:
            grayscale(0.82)
            sepia(0.1)
            saturate(0.42)
            brightness(1.08)
            contrast(0.87);
        }

        .alma-map::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 350;
          border-radius: 27px;
          background:
            linear-gradient(
              180deg,
              rgba(250,248,244,0.05),
              rgba(246,242,236,0.13)
            );
        }

        .alma-map
        .leaflet-control-container {
          position: relative;
          z-index: 500;
        }

        /* ZOOM */

        .alma-map
        .leaflet-control-zoom {
          border: none !important;
          box-shadow:
            0 8px 30px
            rgba(0,0,0,0.1) !important;
          border-radius:
            15px !important;
          overflow: hidden;
        }

        .alma-map
        .leaflet-control-zoom a {
          width: 38px !important;
          height: 38px !important;
          line-height:
            38px !important;
          border: none !important;
          background:
            rgba(
              255,
              255,
              255,
              0.95
            ) !important;
          color: #111 !important;
          font-size:
            20px !important;
        }

        /* MARKERS */

        .alma-marker-wrapper {
          background: transparent;
          border: none;
        }

        .alma-marker {
          width: 36px;
          height: 36px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 999px;

          background:
            rgba(
              255,
              255,
              255,
              0.94
            );

          box-shadow:
            0 6px 18px
            rgba(0,0,0,0.2);

          transition:
            transform
            0.2s ease;
        }

        .alma-marker:hover {
          transform:
            scale(1.12);
        }

        .alma-marker-dot {
          width: 16px;
          height: 16px;

          border-radius: 999px;

          background: #111;

          border:
            3px solid white;
        }

        /* POPUP */

        .alma-leaflet-popup
        .leaflet-popup-content-wrapper {
          padding:
            0 !important;

          border-radius:
            26px !important;

          overflow: hidden;

          background:
            white !important;

          box-shadow:
            0 20px 60px
            rgba(0,0,0,0.22)
            !important;
        }

        .alma-leaflet-popup
        .leaflet-popup-content {
          margin:
            0 !important;

          width:
            320px !important;
        }

        .alma-leaflet-popup
        .leaflet-popup-tip {
          box-shadow:
            none !important;
        }

        .alma-popup {
          width: 100%;

          background: white;

          color: #111;

          overflow: hidden;
        }

        .alma-popup-content {
          padding: 22px;
        }

        .alma-popup-category {
          font-size: 10px;

          text-transform:
            uppercase;

          letter-spacing:
            0.14em;

          color: #999;
        }

        .alma-popup-title {
          margin-top: 6px;

          font-size: 24px;

          line-height: 1.1;

          font-weight: 700;
        }

        .alma-popup-why {
          margin-top: 10px;

          color: #666;

          font-size: 13px;

          line-height: 1.55;
        }

        /* PRICE */

        .alma-popup-price {
          margin-top: 18px;

          padding:
            13px 14px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 14px;

          border-radius:
            16px;

          background:
            #f3f1ed;
        }

        .alma-popup-price-info {
          display: flex;

          flex-direction:
            column;

          gap: 3px;

          min-width: 0;
        }

        .alma-popup-price span {
          font-size: 11px;

          color: #888;
        }

        .alma-popup-price small {
          font-size: 10px;

          line-height: 1.3;

          color: #777;
        }

        .alma-popup-price strong {
          flex-shrink: 0;

          font-size: 17px;

          white-space:
            nowrap;

          color: #111;
        }

        /* TAGS */

        .alma-popup-tags {
          display: flex;

          flex-wrap: wrap;

          gap: 6px;

          margin-top: 13px;
        }

        .alma-popup-tags span {
          display:
            inline-flex;

          padding:
            6px 10px;

          border-radius:
            999px;

          background:
            #f4f2ee;

          font-size: 11px;

          color: #555;
        }

        /* BUTTON */

        .alma-popup-button {
          display: flex;

          align-items: center;

          justify-content:
            center;

          margin-top: 15px;

          min-height: 44px;

          border-radius:
            999px;

          background: #111;

          color:
            white !important;

          font-size: 13px;

          font-weight: 600;

          text-decoration:
            none !important;

          transition:
            opacity
            0.2s ease,
            transform
            0.2s ease;
        }

        .alma-popup-button:hover {
          opacity: 0.85;

          transform:
            translateY(-1px);
        }

        /* CLOSE */

        .alma-leaflet-popup
        .leaflet-popup-close-button {
          width:
            30px !important;

          height:
            30px !important;

          top:
            9px !important;

          right:
            9px !important;

          display:
            flex !important;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            999px;

          background:
            #f3f1ed !important;

          color:
            #111 !important;

          font-size:
            19px !important;

          line-height:
            1 !important;

          z-index: 20;
        }

        /* MOBILE */

        @media (
          max-width: 640px
        ) {
          .alma-leaflet-popup
          .leaflet-popup-content {
            width:
              280px !important;
          }

          .alma-popup-content {
            padding: 19px;
          }

          .alma-popup-title {
            font-size: 21px;
          }
        }

      `}</style>
    </>
  );
}