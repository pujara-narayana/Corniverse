"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import Earth scene with SSR disabled
const EarthScene = dynamic(() => import("./EarthScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function Earth() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [year, setYear] = useState(2050); // Default year
  const [predictedYield, setPredictedYield] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const headerOpacity = Math.max(0, Math.min(1, 1 - scrollY / 500));
  const titleScale = 1 + Math.max(0, Math.min(0.3, scrollY / 1000));

  const cornYieldData = [
    { year: 2023, yield: 177 },
    { year: 2024, yield: 182 },
    { year: 2025, yield: 180 },
    { year: 2050, yield: 210 },
    { year: 2075, yield: 240 },
    { year: 2100, yield: 275 },
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

  // Handle input change
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 2001 && value <= 2100) {
      setYear(value);
    }
  };

  // Fetch prediction from FastAPI
  async function fetchPrediction(year: number) {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/predict/${year}`, {
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

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Fixed background - 3D Earth */}
      <div className="fixed inset-0 z-0">
        <EarthScene />
      </div>

      {/* Subtle gradient overlay to improve text readability */}
      <div 
        className="fixed inset-0 z-10 bg-gradient-to-b from-black via-transparent to-black opacity-60"
        style={{ backgroundPosition: `center ${scrollY * 0.1}px` }}
      ></div>

      {/* Main content - scrollable */}
      <div className="relative z-20">
        {/* Hero section */}
        <section 
          className="min-h-screen flex flex-col justify-center items-center px-4 pb-20"
          style={{ opacity: headerOpacity, transform: `scale(${titleScale})`, transition: "transform 0.1s ease-out" }}
        >
          <h1 className="text-7xl font-bold text-center text-blue-100 mb-6 tracking-wider drop-shadow-lg">
            EARTH
          </h1>

          <div 
            className="max-w-xl text-center bg-black bg-opacity-40 p-6 rounded-lg backdrop-blur-sm border border-blue-900"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <p className="text-xl mb-4">
              Home to 8 billion people and the birthplace of corn agriculture.
            </p>
            <p className="text-lg text-blue-300">
              Our predictive models show continued growth in corn yield through 2100.
            </p>

            {/* Corn Yield Prediction Section */}
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
            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/30 to-transparent opacity-70 z-0"
            style={{ 
              transform: `translateY(${(scrollY - 500) * 0.1}px)` 
            }}
          ></div>
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <h2 
              className="text-5xl font-bold text-center mb-16 text-blue-100"
              style={{ 
                transform: `translateY(${Math.max(0, (scrollY - 600) * 0.2)}px)`,
                opacity: Math.min(1, Math.max(0, (scrollY - 500) / 300))
              }}
            >
              Corn Yield Projections
            </h2>
            
            {/* Data visualization */}
            <div 
              className="mb-16"
              style={{ 
                opacity: Math.min(1, Math.max(0, (scrollY - 600) / 400)),
                transform: `translateY(${Math.max(0, 100 - (scrollY - 600) * 0.2)}px)`
              }}
            >
              <div className="bg-black bg-opacity-50 p-6 rounded-xl border border-blue-800 backdrop-blur-sm">
                <div className="relative h-80 mb-8">
                  {/* Graph lines and points */}
                  <svg className="w-full h-full" viewBox="0 0 1000 400">
                    {/* X and Y axes */}
                    <line x1="50" y1="350" x2="950" y2="350" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                    <line x1="50" y1="50" x2="50" y2="350" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                    
                    {/* Y-axis labels */}
                    <text x="30" y="350" fill="white" fontSize="14" textAnchor="end">0</text>
                    <text x="30" y="280" fill="white" fontSize="14" textAnchor="end">100</text>
                    <text x="30" y="210" fill="white" fontSize="14" textAnchor="end">200</text>
                    <text x="30" y="140" fill="white" fontSize="14" textAnchor="end">300</text>
                    <text x="30" y="70" fill="white" fontSize="14" textAnchor="end">400</text>
                    
                    {/* Line graph */}
                    <polyline 
                      points={`
                        ${50 + 0 * 150},${350 - cornYieldData[0].yield * 0.8}
                        ${50 + 1 * 150},${350 - cornYieldData[1].yield * 0.8}
                        ${50 + 2 * 150},${350 - cornYieldData[2].yield * 0.8}
                        ${50 + 3 * 150},${350 - cornYieldData[3].yield * 0.8}
                        ${50 + 4 * 150},${350 - cornYieldData[4].yield * 0.8}
                        ${50 + 5 * 150},${350 - cornYieldData[5].yield * 0.8}
                      `}
                      fill="none"
                      stroke="#4299e1"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {cornYieldData.map((data, index) => (
                      <g key={index}>
                        <circle 
                          cx={50 + index * 150} 
                          cy={350 - data.yield * 0.8} 
                          r="8" 
                          fill="#4299e1" 
                        />
                        <text 
                          x={50 + index * 150} 
                          y="380" 
                          fill="white" 
                          fontSize="14" 
                          textAnchor="middle"
                        >
                          {data.year}
                        </text>
                        <text 
                          x={50 + index * 150} 
                          y={340 - data.yield * 0.8} 
                          fill="white" 
                          fontSize="14" 
                          textAnchor="middle"
                        >
                          {data.yield}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-semibold mb-2">Bushels per Acre</p>
                  <p className="text-gray-300">Projected increase in corn yield through 2100</p>
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
                  className="bg-black bg-opacity-60 p-6 rounded-lg border border-blue-700 backdrop-blur-sm transform transition-all duration-500"
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    transform: `translateY(${Math.max(0, 100 - (scrollY - 900) * 0.3)}px) scale(${Math.min(1, Math.max(0.8, (scrollY - 900) / 400))})`,
                  }}
                >
                  <h3 className="text-2xl font-bold mb-2">{data.year}</h3>
                  <div className="text-blue-300 text-5xl font-bold">{data.yield}</div>
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