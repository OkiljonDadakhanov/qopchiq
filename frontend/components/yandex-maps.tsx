"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import type { Place } from "@/types/place";

interface YandexMapProps {
  places: Place[];
}

export default function YandexMap({ places }: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 🔹 Initialize the map once the script is ready
  useEffect(() => {
    if (!isScriptLoaded) return;
    if (!mapRef.current) return;

    const loadMap = async () => {
      try {
        // @ts-ignore
        await window.ymaps.ready();

        // @ts-ignore
        const map = new window.ymaps.Map(mapRef.current, {
          center: [41.311081, 69.240562], // Tashkent
          zoom: 12,
          controls: ["zoomControl", "fullscreenControl"],
        });

        // Add placemarks
        places.forEach((p) => {
          // @ts-ignore
          const mark = new window.ymaps.Placemark(
            [p.latitude, p.longitude],
            { balloonContent: `<strong>${p.label}</strong><br>${p.text}` },
            { preset: "islands#redIcon" }
          );
          map.geoObjects.add(mark);
        });
      } catch (e) {
        console.error("Failed to initialize map:", e);
      }
    };

    loadMap();
  }, [isScriptLoaded, places]);

  return (
    <>
      <Script
        src={`https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAP_KEY}&lang=en_US`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("✅ Yandex Maps script loaded");
          setIsScriptLoaded(true);
        }}
        onError={(e) => console.error("❌ Failed to load Yandex script:", e)}
      />
      <div
        ref={mapRef}
        className="w-full h-[500px] rounded-lg border border-gray-200"
      />
    </>
  );
}
