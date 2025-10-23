"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, SlidersHorizontal, Heart, Map } from "lucide-react";

import BottomNavigation from "@/components/bottom-navigation";
import { fetchProducts, type ProductQuery } from "@/api/services/products";
import type { Product } from "@/types/product";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value);

const dietOptions = {
  vegetarian: { label: "Vegetarian", icon: "🌱" },
  vegan: { label: "Vegan", icon: "🥬" },
} as const

const foodTypes = {
  meals: { label: "Meals", icon: "🍽️" },
  bakery: { label: "Bakery", icon: "🥐" },
  groceries: { label: "Groceries", icon: "🛒" },
  plants: { label: "Plants", icon: "🌸" },
  cosmetics: { label: "Cosmetics", icon: "💄" },
  other: { label: "Other", icon: "🔘" },
} as const

const buildPickupWindow = (product: Product) => {
  if (!product.pickupStartTime && !product.pickupEndTime) return null;
  const start = product.pickupStartTime ?? "";
  const end = product.pickupEndTime ?? "";
  if (!start) return end ? `Pickup until ${end}` : null;
  if (!end) return `Pickup after ${start}`;
  return `${start} - ${end}`;
};

export default function FeedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const showUnavailable = searchParams.get("showUnavailable") === "true";

  const selectedFoodTypes = useMemo(() => {
    const raw = searchParams.getAll("foodType");
    if (raw.length) return raw;
    const fromSingle = searchParams.get("foodTypes") || searchParams.get("food_type");
    return fromSingle ? fromSingle.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedDietary = useMemo(() => {
    const raw = searchParams.getAll("dietary");
    if (raw.length) return raw;
    const fallback =
      searchParams.getAll("dietaryPreferences") || searchParams.getAll("diet") || [];
    if (fallback.length) return fallback;
    const fromSingle = searchParams.get("dietaryPreferences") || searchParams.get("dietary_pref");
    return fromSingle ? fromSingle.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      "feed-products",
      {
        showUnavailable,
        foodType: [...selectedFoodTypes].sort().join(","),
        dietary: [...selectedDietary].sort().join(","),
      },
    ],
    queryFn: async () => {
      const params: ProductQuery = {};
      if (showUnavailable) {
        params.includeInactive = true;
      } else {
        params.status = "available";
      }
      if (selectedFoodTypes.length) {
        params.foodType = selectedFoodTypes;
      }
      if (selectedDietary.length) {
        params.dietary = selectedDietary;
      }

      const response = await fetchProducts(params);
      return response.products;
    },
    staleTime: 1000 * 60,
  });

  const offers = useMemo(() => data ?? [], [data]);

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-white shadow-2xl">
        <header className="px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-30">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold">Offers</h1>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                router.push(`/filters${params.toString() ? `?${params.toString()}` : ""}`);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <SlidersHorizontal className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Tashkent, +/- 5km</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-36">
          <div className="px-6 py-6 space-y-6">
            {isLoading || isFetching ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                <span className="font-medium">Loading fresh offers…</span>
              </div>
            ) : null}

            {isError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 space-y-3">
                <p className="font-semibold">Unable to load offers</p>
                <p className="text-sm">{error instanceof Error ? error.message : "Please try again later."}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00B14F] rounded-lg hover:bg-[#009940]"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {!isLoading && !isError && offers.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-600">
                <p className="font-semibold">No offers are available right now.</p>
                <p className="text-sm mt-2">Check back soon to see new rescue packs from nearby businesses.</p>
              </div>
            ) : null}

            {offers.map((offer) => {
              const coverImage = offer.images?.[0] ?? "/placeholder.svg";
              const pickup = buildPickupWindow(offer);
              const businessName = offer.business?.name ?? "Partner";
              const businessAvatar = offer.business?.avatar ?? null;
              const dietBadges = (offer.dietaryPreferences ?? []).map((diet) => dietOptions[diet as keyof typeof dietOptions]);
              const foodBadge = offer.foodType ? foodTypes[offer.foodType] : undefined;

              return (
                <div
                  key={offer._id}
                  onClick={() => router.push(`/restaurant/${offer._id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition hover:shadow-md"
                >
                  <div className="relative h-48">
                    <img src={coverImage} alt={offer.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
                      {offer.stock > 10 ? "10+ LEFT" : `${offer.stock} LEFT`}
                    </div>
                    <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
                      <Heart className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-3 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                      {businessAvatar ? (
                        <img src={businessAvatar} alt={businessName} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                          {businessName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white px-4 py-2 rounded-full shadow-md">
                      <span className="text-gray-400 line-through text-sm">{formatPrice(offer.originalPrice)} UZS</span>
                      <span className="text-lg font-bold ml-2">{formatPrice(offer.discountPrice)} UZS</span>
                    </div>
                  </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-lg">{offer.title}</h3>
                      <p className="text-sm text-gray-600">{offer.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        {foodBadge ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1">
                            <span>{foodBadge.icon}</span>
                            <span>{foodBadge.label}</span>
                          </span>
                        ) : null}
                        {dietBadges.map((diet) =>
                          diet ? (
                            <span
                              key={diet.label}
                              className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1"
                            >
                              <span>{diet.icon}</span>
                              <span>{diet.label}</span>
                            </span>
                          ) : null
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span>👥</span>
                        <span>{businessName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📦</span>
                        <span>{offer.quantity.amount} {offer.quantity.unit}</span>
                      </div>
                      {pickup ? (
                        <div className="flex items-center gap-1">
                          <span>🕐</span>
                          <span>{pickup}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <button
          onClick={() => router.push("/map")}
          className="fixed bottom-24 right-6 w-16 h-16 bg-[#00B14F] rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-[#00c85a] transition max-w-md"
        >
          <Map className="w-7 h-7 text-white" />
        </button>

        <BottomNavigation />
      </div>
    </div>
  );
}
