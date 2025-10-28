import { Suspense } from "react";
import FeedPageContentComponent from "@/components/FeedPageContent";

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <FeedPageContentComponent />
    </Suspense>
  );
}
