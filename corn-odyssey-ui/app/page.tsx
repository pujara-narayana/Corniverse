"use client";
import { useState, useEffect, useRef } from "react";
import SpaceScene from "@/components/SpaceScene";
import Link from "next/link";
import dynamic from "next/dynamic";
import "../app/cursor-styles.css"; // Adjusted path

// Import AI Chatbot component with dynamic import
const AICornHusker = dynamic(() => import("@/components/AICornHusker"), {
  ssr: false,
});

export default function Home() {
  const [immersive, setImmersive] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Generate stars for background
  useEffect(() => {
    const generateStars = () => {
      const starCount = 100;
      const newStars = [];
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 1 + Math.random() * 2,
          delay: Math.random() * 2
        });
      }
      
      setStars(newStars);
    };
    
    generateStars();
  }, []);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Update cursor position directly for smoother movement
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  
  // Calculate opacity based on scroll
  const homepageOpacity = Math.max(0, 1 - scrollPosition / 600);
  const spaceSceneOpacity = Math.min(1, (scrollPosition - 300) / 300);
  
  // Begin Journey function
  const beginJourney = () => {
    setImmersive(true);
    window.scrollTo({
      top: 800,
      behavior: 'smooth'
    });
  };
  
  if (!mounted) return null;
  
  return (
    <main className="rocket-cursor relative w-full">
      {/* Custom cursor */}
      <div 
        ref={cursorRef}
        className={`custom-cursor ${isClicking ? 'clicking' : ''}`}
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
      ></div>
      
      {/* AI Chatbot */}
      <AICornHusker theme="space" />
      
      {/* Stars background */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star fixed"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            zIndex: 0
          }}
        />
      ))}
      
      {/* Homepage Section - First screen */}
      <section 
        className="relative h-screen bg-black flex flex-col justify-center items-center"
        style={{ 
          opacity: homepageOpacity,
          visibility: homepageOpacity > 0.1 ? 'visible' : 'hidden',
        }}
      >
        <div className="text-center px-4 max-w-4xl mx-auto z-10">
          <h1 className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 tracking-tight">
            CORN ODYSSEY 2100
          </h1>
          <p className="text-2xl mb-8 text-blue-200">
            Explore the future of agriculture across our solar system
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <button 
              onClick={beginJourney}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Begin Cosmic Journey
            </button>
            
            <Link href="/about">
              <button className="px-8 py-4 rounded-full bg-transparent border-2 border-blue-500 text-blue-400 font-bold text-lg transition-all hover:bg-blue-900 hover:bg-opacity-30">
                Learn More
              </button>
            </Link>
          </div>
          
          <div className="mt-12 flex gap-8 justify-center">
            <Link href="/earth">
              <div className="group relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-600 transition-transform hover:scale-105 cursor-pointer">
                <img 
                  src="/textures/earth.jpg" 
                  alt="Earth" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold">Earth</span>
                </div>
              </div>
            </Link>
            
            <Link href="/mars">
              <div className="group relative w-36 h-36 rounded-full overflow-hidden border-4 border-red-600 transition-transform hover:scale-105 cursor-pointer">
                <img 
                  src="/textures/mars.jpg" 
                  alt="Mars" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold">Mars</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-gray-400 text-sm mb-2">Scroll to Explore</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
            </svg>
          </div>
        </div>
      </section>
      
      {/* SpaceScene Section - Second screen */}
      <section 
        className="relative h-screen bg-black"
        style={{ 
          opacity: spaceSceneOpacity,
          visibility: spaceSceneOpacity > 0.1 ? 'visible' : 'hidden'
        }}
      >
        <SpaceScene immersive={immersive} toggleImmersive={() => setImmersive(!immersive)} />
      </section>
      
      {/* Extra space for scrolling */}
      <div className="h-screen bg-black"></div>
    </main>
  );
}