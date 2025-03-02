"use client";

import { useEffect, useState } from "react";
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

// Import AI Chatbot component with dynamic import
const AICornHusker = dynamic(() => import("@/components/AICornHusker"), {
  ssr: false,
});

export default function Mars() {
  // Use state to ensure components are rendered client-side
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <MarsPage />
      <AICornHusker theme="mars" />
    </>
  );
}