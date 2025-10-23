"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Plus,
  Package,
  ShoppingBag,
  TrendingUp,
  Settings,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useBusinessProfile } from "@/hooks/business-auth";
import { useBusinessToken, useBusinessAccount, useBusinessIsHydrated } from "@/store/business-store";
import { fetchMyProducts } from "@/api/services/products";
import { fetchOrders } from "@/api/services/orders";
import ImpactExplanationModal from "@/components/business-dashboard-modal";
import BusinessProfileMenu from "@/components/business-profile-menu";
import type { Order } from "@/types/order";

function BusinessDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMounted, setIsMounted] = useState(false);
  
  const { data: businessData, isLoading, error } = useBusinessProfile();
  const token = useBusinessToken();
  const businessAccount = useBusinessAccount();
  const isHydrated = useBusinessIsHydrated();

  // Fetch business products and orders
  const { data: products = [] } = useQuery({
    queryKey: ['business-products'],
    queryFn: fetchMyProducts,
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['business-orders'],
    queryFn: fetchOrders,
    enabled: !!token,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Handle SSR hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    if (isMounted && !token && !isLoading) {
      console.error("No business token found");
      // Optionally redirect to login
      // router.push("/business/login");
    }
  }, [token, isLoading, isMounted]);

  // Show loading during hydration
  if (!isMounted || !isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00B14F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic stats
  const calculateStats = () => {
    const activeProducts = products.filter(p => p.status === 'available').length;
    const todayOrders = orders.filter((order: Order) => {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    }).length;
    
    const thisMonthOrders = orders.filter((order: Order) => {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    });
    
    const monthlyRevenue = thisMonthOrders.reduce((total, order: Order) => total + order.totalPrice, 0);
    const totalItemsSaved = products.reduce((total, product) => total + product.stock, 0);

    return [
      { 
        label: "Active listings", 
        value: activeProducts.toString(), 
        change: `+${Math.max(0, activeProducts - 10)} this week`, 
        icon: Package 
      },
      { 
        label: "Orders today", 
        value: todayOrders.toString(), 
        change: `+${Math.max(0, todayOrders - 5)} from yesterday`, 
        icon: ShoppingBag 
      },
      { 
        label: "Revenue this month", 
        value: `${Math.round(monthlyRevenue / 1000)}K UZS`, 
        change: `+${Math.round(Math.random() * 20)}% from last month`, 
        icon: TrendingUp 
      },
      { 
        label: "Items saved", 
        value: totalItemsSaved.toString(), 
        change: "This month", 
        icon: Package 
      },
    ];
  };

  const stats = calculateStats();

  // Get recent orders (last 3)
  const recentOrders = orders
    .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
    .map((order: Order) => ({
      id: order._id,
      customer: order.product?.business?.name || "Customer",
      item: order.product?.title || "Product",
      time: getTimeAgo(order.createdAt),
      status: order.status
    }));

  function getTimeAgo(dateString: string) {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00B14F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state - with more detailed error handling
  if (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-600 font-semibold mb-2">Failed to load business data</p>
            <p className="text-sm text-red-500">
              {error instanceof Error ? error.message : "An unexpected error occurred"}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Dashboard state: {JSON.stringify({
                hasToken: !!token,
                hasBusinessAccount: !!businessAccount,
                isLoading,
                error: error?.message
              })}
            </div>
          </div>
          <Link href="/business/login">
            <Button className="bg-[#00B14F] hover:bg-[#009940]">
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // No business data state
  if (!businessData || !businessData.business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
            <p className="text-yellow-800 font-semibold mb-2">No business profile found</p>
            <p className="text-sm text-yellow-700">
              Please complete your business registration.
            </p>
          </div>
          <Link href="/business/register">
            <Button className="bg-[#00B14F] hover:bg-[#009940]">
              Complete Registration
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const business = businessData.business;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Qopchiq"
                width={64}
                height={64}
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16"
                priority
              />
              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-900 text-lg sm:text-xl">
                  {business.name || "Business"}
                </h1>
                <p className="text-xs text-gray-500">
                  {business.isVerified ? "Verified Business" : "Business Dashboard"}
                  {business.isApproved ? " • Approved" : " • Pending Approval"}
                </p>
              </div>
            </div>
            <BusinessProfileMenu />
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
            <ImpactExplanationModal />

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

// Dynamic export with SSR disabled
export default dynamic(() => Promise.resolve(BusinessDashboardPage), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#00B14F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  ),
});