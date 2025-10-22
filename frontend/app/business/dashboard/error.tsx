"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
    
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
          <p className="text-red-600 font-semibold mb-2">Dashboard Error</p>
          <p className="text-sm text-red-500">
            {error.message || "An unexpected error occurred"}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="bg-[#00B14F] hover:bg-[#009940]">
            Try Again
          </Button>
          <Link href="/business/login">
            <Button variant="outline">Return to Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
