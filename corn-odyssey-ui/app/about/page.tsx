"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import AboutPage with SSR disabled to prevent hydration issues
const AboutPage = dynamic(() => import("@/components/AboutPage"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

// Import AI Chatbot component with dynamic import
const AICornHusker = dynamic(() => import("@/components/AICornHusker"), {
  ssr: false,
});

export default function About() {
  // Use state to ensure components are rendered client-side
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AboutPage />
      <AICornHusker theme="space" />
    </>
  );
}