"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import Mars scene with SSR disabled
const MarsScene = dynamic(() => import("./MarsScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});



export default function Mars() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [year, setYear] = useState(2050); // Default year
  const [cornCount, setCornCount] = useState(3); // Default count (lower for Mars initially)
  const [predictedYield, setPredictedYield] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Corn yield data
  const cornYieldData = [
    {
        year: 2000,
        yield: 4
    },
    {
        year: 2010,
        yield: 4
    },
    {
        year: 2020,
        yield: 4
    },
    {
        year: 2030,
        yield: 4
    },
    {
        year: 2040,
        yield: 5
    },
    {
        year: 2050,
        yield: 6
    },
    {
        year: 2060,
        yield: 7
    },
    {
        year: 2070,
        yield: 8
    },
    {
        year: 2080,
        yield: 9
    },
    {
        year: 2090,
        yield: 10
    },
    {
        year: 2100,
        yield: 11
    }
];

  // Mars colony data
  const colonyData = [
    { name: "Olympus Base", founded: 2035, population: 250, specialty: "Research" },
    { name: "Valles Marineris", founded: 2041, population: 620, specialty: "Mining" },
    { name: "Arcadia Dome", founded: 2047, population: 890, specialty: "Agriculture" },
    { name: "Elysium Heights", founded: 2055, population: 1250, specialty: "Manufacturing" },
  ];

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Show content after a short delay
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1500);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);
  
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 2001 && value <= 2100) {
      setYear(value);
    }
  };

  async function fetchPrediction(year: number) {
    try {
      setLoading(true);
      const response = await fetch(`https://corniverse.onrender.com/marsPredict/${year}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPredictedYield(data.predicted_yield);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPredictedYield(null); // Reset value if error occurs
    } finally {
      setLoading(false);
    }
  }
  
  // Calculate opacity for fade effects
  const headerOpacity = Math.max(0, Math.min(1, 1 - scrollY / 500));
  const titleScale = 1 + Math.max(0, Math.min(0.3, scrollY / 1000));
  
  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Fixed background - 3D Mars */}
      <div className="fixed inset-0 z-0">
        <MarsScene />
      </div>
      
      
      
      {/* Subtle gradient overlay to improve text readability */}
      <div 
        className="fixed inset-0 z-10 bg-gradient-to-b from-black via-transparent to-black opacity-60"
        style={{ 
          backgroundPosition: `center ${scrollY * 0.1}px`
        }}
      ></div>
      
      {/* Main content - scrollable */}
      <div className="relative z-20">
        {/* Hero section */}
        <section 
          className="min-h-screen flex flex-col justify-center items-center px-4 pb-20"
          style={{ 
            opacity: headerOpacity,
            transform: `scale(${titleScale})`,
            transition: "transform 0.1s ease-out"
          }}
        >
          <h1 className="text-7xl font-bold text-center text-red-100 mb-6 tracking-wider drop-shadow-lg">
            MARS
          </h1>
          
          <div 
            className="max-w-xl text-center bg-black bg-opacity-40 p-6 rounded-lg backdrop-blur-sm border border-red-900"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`
            }}
          >
            <p className="text-xl mb-4">
              The frontier of human space colonization and future home to corn agriculture.
            </p>
            <p className="text-lg text-red-300">
              Our predictive models show rapid growth in Martian corn yield through 2100.
            </p>
            
            {/* Corn display controls with Mars styling */}
            <div className="mt-6 p-4 bg-blue-900 bg-opacity-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Corn Yield Predictor</h3>
              <div className="flex flex-col items-center space-y-4">
                <label className="flex items-center">
                  <span className="mr-2">Enter Year:</span>
                  <input 
                    type="number" 
                    min="2001" 
                    max="2100"
                    value={year}
                    onChange={handleYearChange}
                    className="bg-blue-800 text-white px-3 py-1 rounded w-24 text-center"
                  />
                </label>
                <button 
                  onClick={() => fetchPrediction(year)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Get Prediction"}
                </button>
              </div>

              {/* Display the predicted yield */}
              {predictedYield !== null && (
                <div className="mt-4 text-xl font-bold text-white">
                  Predicted Yield for {year}: <span className="text-yellow-300">{predictedYield} megagrams / hectare</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div 
            className="absolute bottom-10 flex flex-col items-center animate-pulse" 
            style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
          >
            <p className="mb-2">Scroll to explore</p>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 7l5 5 5-5"/>
            </svg>
          </div>
        </section>
        
        {/* Corn Yield section with cool graph */}
        <section className="min-h-screen py-20 px-4 relative">
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/30 to-transparent opacity-70 z-0"
            style={{ 
              transform: `translateY(${(scrollY - 500) * 0.1}px)` 
            }}
          ></div>
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <h2 
              className="text-5xl font-bold text-center mb-16 text-red-100"
              style={{ 
                transform: `translateY(${Math.max(0, (scrollY - 600) * 0.2)}px)`,
                opacity: Math.min(1, Math.max(0, (scrollY - 500) / 300))
              }}
            >
              Martian Corn Yield Projections
            </h2>
            
            {/* Data visualization */}
            <div 
              className="mb-16"
              style={{ 
                opacity: Math.min(1, Math.max(0, (scrollY - 600) / 400)),
                transform: `translateY(${Math.max(0, 100 - (scrollY - 600) * 0.2)}px)`
              }}
            >
              <div className="bg-black bg-opacity-50 p-6 rounded-xl border border-red-800 backdrop-blur-sm">
                <div className="relative h-80 mb-8">
                  {/* Graph bars */}
                  <svg className="w-full h-full" viewBox="0 0 1200 500">
  {/* Axes */}
  <line x1="50" y1="450" x2="1150" y2="450" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
  <line x1="50" y1="50" x2="50" y2="450" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />

  {/* Y-axis labels with correct scaling */}
  {[0, 2, 4, 6, 8, 10, 12].map((val) => (
    <text key={val} x="30" y={450 - val * 35} fill="white" fontSize="14" textAnchor="end">
      {val}
    </text>
  ))}

  {/* Bars with adjusted width and spacing */}
  {cornYieldData.map((data, index) => {
    const barHeight = data.yield * 35; // Adjusted scaling for better clarity
    return (
      <g key={index}>
        <rect 
          x={80 + index * 90}  // Adjusted spacing for better alignment
          y={450 - barHeight} 
          width="70"  // Wider bars for better visibility
          height={barHeight} 
          fill="url(#redGradient)" 
          rx="4" 
        />
        {/* Year Labels */}
        <text 
          x={115 + index * 90} 
          y="470"  // Below bars
          fill="white" 
          fontSize="16" 
          textAnchor="middle"
        >
          {data.year}
        </text>
        {/* Yield Value Labels */}
        <text 
          x={115 + index * 90} 
          y={440 - barHeight} 
          fill="white" 
          fontSize="16" 
          textAnchor="middle"
        >
          {data.yield}
        </text>
      </g>
    );
  })}

  {/* Gradient for futuristic look */}
  <defs>
    <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#e53e3e" />
      <stop offset="100%" stopColor="#742a2a" />
    </linearGradient>
  </defs>
</svg>

                </div>
                
                <div className="text-center">
                  <p className="text-xl font-semibold mb-2">Mg/ha</p>
                  <p className="text-gray-300">Projected growth in Martian corn yield from first successful harvest</p>
                </div>
              </div>
            </div>
            
            {/* Data cards */}
            <div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8"
              style={{ 
                opacity: Math.min(1, Math.max(0, (scrollY - 900) / 300))
              }}
            >
              {cornYieldData.map((data, index) => (
                <div 
                  key={data.year}
                  className="bg-black bg-opacity-60 p-6 rounded-lg border border-red-700 backdrop-blur-sm transform transition-all duration-500"
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    transform: `translateY(${Math.max(0, 100 - (scrollY - 900) * 0.3)}px) scale(${Math.min(1, Math.max(0.8, (scrollY - 900) / 400))})`,
                  }}
                >
                  <h3 className="text-2xl font-bold mb-2">{data.year}</h3>
                  <div className="text-red-300 text-5xl font-bold">{data.yield}</div>
                  <p className="text-gray-400 mt-2">bushels/acre</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      
      {/* Fixed Back Button */}
      <Link href="/">
        <button className="fixed top-5 left-5 bg-black bg-opacity-70 px-4 py-2 rounded-full text-white z-50 flex items-center transition-transform hover:scale-105">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
          </svg>
          Back to Space
        </button>
      </Link>
    </div>
  );
}
