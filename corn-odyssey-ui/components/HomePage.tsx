"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "..app//cursor-styles.css";


// Import SpaceScene with SSR disabled
const SpaceScene = dynamic(() => import("@/components/SpaceScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function HomePage() {
  const [immersive, setImmersive] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; top: number; left: number; delay: number }>>([]);
  const homeRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Generate stars
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
    
    const generateShootingStars = () => {
      const count = 5;
      const newShootingStars = [];
      
      for (let i = 0; i < count; i++) {
        newShootingStars.push({
          id: i,
          top: Math.random() * 70,
          left: Math.random() * 70,
          delay: i * 5 + Math.random() * 5
        });
      }
      
      setShootingStars(newShootingStars);
    };
    
    generateStars();
    generateShootingStars();
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
  const headerOpacity = Math.max(0, 1 - scrollPosition / 700);
  const spaceSceneOpacity = Math.min(1, scrollPosition / 700);
  
  return (
    <div className="rocket-cursor relative w-full bg-black text-white overflow-hidden" ref={homeRef}>
      {/* Custom cursor */}
      <div 
        ref={cursorRef}
        className={`custom-cursor ${isClicking ? 'clicking' : ''}`}
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
      ></div>
      
      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
      
      {/* Shooting stars */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
      
      {/* Hero section */}
      <section 
        className="relative min-h-screen flex flex-col justify-center items-center"
        style={{ opacity: headerOpacity }}
      >
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 tracking-tight">
            CORN ODYSSEY 2100
          </h1>
          <p className="text-2xl mb-8 text-blue-200">
            Explore the future of agriculture across our solar system
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <button 
              onClick={() => setImmersive(true)}
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
      
      {/* SpaceScene Section */}
      <section 
        className="min-h-screen transition-opacity duration-500"
        style={{ opacity: spaceSceneOpacity }}
      >
        <SpaceScene immersive={immersive} toggleImmersive={() => setImmersive(!immersive)} />
      </section>
      
      {/* Footer */}
      <footer className="bg-black bg-opacity-70 text-white p-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Corn Odyssey 2100. A cosmic journey through space agriculture.</p>
      </footer>
    </div>
  );
}