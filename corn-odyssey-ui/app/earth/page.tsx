"use client";

import { useEffect, useState } from "react";
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

// Import AI Chatbot component with dynamic import
const AICornHusker = dynamic(() => import("@/components/AICornHusker"), {
  ssr: false,
});

export default function Earth() {
  // Use state to ensure components are rendered client-side
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <EarthPage />
      <AICornHusker theme="earth" />
    </>
  );
}