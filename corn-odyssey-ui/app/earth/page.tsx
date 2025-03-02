"use client";

import dynamic from "next/dynamic";

// Import Earth component with dynamic import to avoid SSR issues
const EarthPage = dynamic(() => import("@/components/earth"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <p className="text-2xl">Loading Earth Page...</p>
    </div>
  ),
});

export default function Earth() {
  return <EarthPage />;
}