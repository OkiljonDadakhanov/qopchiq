import YandexMap from "@/components/yandex-maps";
import type { Place } from "@/types/place";

const testPlaces: Place[] = [
  {
    id: "1",
    label: "Sahar osh",
    text: "Osh bor",
    latitude: 41.3125,
    longitude: 69.2817,
  },
  {
    id: "2",
    label: "Brew Brothers",
    text: "Open until midnight — try the cold brew!",
    latitude: 41.3201,
    longitude: 69.2454,
  },
  {
    id: "3",
    label: "Latte House",
    text: "Student-friendly café with Wi-Fi",
    latitude: 41.3058,
    longitude: 69.2704,
  },
];

export default function TestPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">☕ Café Locations</h1>
      <YandexMap places={testPlaces} />
    </main>
  );
}
