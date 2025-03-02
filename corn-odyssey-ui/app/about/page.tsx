"use client";

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

export default function About() {
  return <AboutPage />;
}