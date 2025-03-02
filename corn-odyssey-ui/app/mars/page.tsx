"use client";

import dynamic from "next/dynamic";

// Import Mars component with dynamic import to avoid SSR issues
const MarsPage = dynamic(() => import("@/components/mars"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <p className="text-2xl">Loading Mars Page...</p>
    </div>
  ),
});

export default function Mars() {
  return <MarsPage />;
}