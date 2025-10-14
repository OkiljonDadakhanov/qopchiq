"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Package,
  ShoppingBag,
  TrendingUp,
  LogOut,
  Eye,
  User,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useFetchBusinessProfile } from "@/hooks/business";
import { useBusinessLogout } from "@/hooks/business-auth";
import { useCustomToast } from "@/components/custom-toast";

export default function BusinessDashboardPage() {

  const toast = useCustomToast();
  const { data: business, isPending, isFetching } = useFetchBusinessProfile();
  const logoutMutation = useBusinessLogout();

  const businessName = useMemo(() => {
    if (business?.name) return business.name;
    if (business?.email) return business.email.split("@")[0];
    return "Your business";
  }, [business]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Signed out", "You have been signed out of your business account.");
    } catch (error: any) {
      console.error("Business logout failed:", error);
      toast.error("Logout failed", error?.message || "We couldn't sign you out. Please try again.");
    }
  };

  const stats = [
    { label: "Active listings", value: "12", change: "+2 this week", icon: Package },
    { label: "Orders today", value: "8", change: "+3 from yesterday", icon: ShoppingBag },
    { label: "Revenue this month", value: "1.2M UZS", change: "+15% from last month", icon: TrendingUp },
    { label: "Items saved", value: "156", change: "This month", icon: Package },
  ];

  const recentOrders = [
    { id: "1", customer: "Akmal K.", item: "Surprise bag", time: "10 mins ago", status: "pending" },
    { id: "2", customer: "Dilnoza S.", item: "Bakery box", time: "25 mins ago", status: "ready" },
    { id: "3", customer: "Jasur M.", item: "Lunch combo", time: "1 hour ago", status: "completed" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              {/* ✅ Bigger, responsive logo */}
              <Image
                src="/logo.png"
                alt="Qopchiq"
                width={64}
                height={64}
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16"
              />
              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-900 text-lg sm:text-xl">
                  {businessName}
                </h1>
                <p className="text-xs text-gray-500">
                  {isPending || isFetching ? "Syncing details..." : "Business Dashboard"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/business/profile">
                <Button variant="ghost" size="sm" className="p-2 sm:p-3">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="p-2 sm:p-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#00B14F]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.change}</div>
            </div>
          ))}
        </div>

        {(isPending || isFetching) && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8" role="status">
            <Loader2 className="h-4 w-4 animate-spin text-[#00B14F]" />
            Updating your latest stats...
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                Quick actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Link href="/business/listings/new">
                  <Button className="w-full bg-[#00B14F] hover:bg-[#009940] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add listing
                  </Button>
                </Link>
                <Link href="/business/listings">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-gray-300 hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View all listings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Recent orders
                </h2>
                <Link
                  href="/business/orders"
                  className="text-sm text-[#00B14F] hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-gray-50"
                  >
                    <div className="mb-2 sm:mb-0">
                      <div className="font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-600">{order.item}</div>
                      <div className="text-xs text-gray-500 mt-1">{order.time}</div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "ready"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-4">Your impact</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">156 kg</div>
                  <div className="text-sm text-gray-600">Food waste prevented</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">312 kg</div>
                  <div className="text-sm text-gray-600">CO₂ emissions saved</div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Tips for success</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#00B14F]">•</span>
                  <span>Update your listings daily for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00B14F]">•</span>
                  <span>Respond to orders within 15 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00B14F]">•</span>
                  <span>Add photos to increase sales by 40%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
