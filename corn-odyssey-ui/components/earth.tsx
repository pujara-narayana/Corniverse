"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import cornYieldDataJSON from '../../python/yield_predictions.json' assert { type: "json" };


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
    {
        year: 2001,
        yield: 12
    },
    {
        year: 2002,
        yield: 13
    },
    {
        year: 2003,
        yield: 18
    },
    {
        year: 2004,
        yield: 13
    },
    {
        year: 2005,
        yield: 12
    },
    {
        year: 2006,
        yield: 9
    },
    {
        year: 2007,
        yield: 16
    },
    {
        year: 2008,
        yield: 17
    },
    {
        year: 2009,
        yield: 13
    },
    {
        year: 2010,
        yield: 10
    },
    {
        year: 2011,
        yield: 18
    },
    {
        year: 2012,
        yield: 12
    },
    {
        year: 2013,
        yield: 12
    },
    {
        year: 2014,
        yield: 12
    },
    {
        year: 2015,
        yield: 14
    },
    {
        year: 2016,
        yield: 16
    },
    {
        year: 2017,
        yield: 11
    },
    {
        year: 2018,
        yield: 15
    },
    {
        year: 2019,
        yield: 17
    },
    {
        year: 2020,
        yield: 14
    },
    {
        year: 2021,
        yield: 18
    },
    {
        year: 2022,
        yield: 11
    },
    {
        year: 2023,
        yield: 13
    },
    {
        year: 2024,
        yield: 17
    },
    {
        year: 2025,
        yield: 14
    },
    {
        year: 2026,
        yield: 17
    },
    {
        year: 2027,
        yield: 9
    },
    {
        year: 2028,
        yield: 17
    },
    {
        year: 2029,
        yield: 12
    },
    {
        year: 2030,
        yield: 12
    },
    {
        year: 2031,
        yield: 9
    },
    {
        year: 2032,
        yield: 11
    },
    {
        year: 2033,
        yield: 17
    },
    {
        year: 2034,
        yield: 16
    },
    {
        year: 2035,
        yield: 10
    },
    {
        year: 2036,
        yield: 9
    },
    {
        year: 2037,
        yield: 18
    },
    {
        year: 2038,
        yield: 15
    },
    {
        year: 2039,
        yield: 17
    },
    {
        year: 2040,
        yield: 16
    },
    {
        year: 2041,
        yield: 11
    },
    {
        year: 2042,
        yield: 11
    },
    {
        year: 2043,
        yield: 12
    },
    {
        year: 2044,
        yield: 15
    },
    {
        year: 2045,
        yield: 12
    },
    {
        year: 2046,
        yield: 15
    },
    {
        year: 2047,
        yield: 11
    },
    {
        year: 2048,
        yield: 10
    },
    {
        year: 2049,
        yield: 9
    },
    {
        year: 2050,
        yield: 16
    },
    {
        year: 2051,
        yield: 18
    },
    {
        year: 2052,
        yield: 11
    },
    {
        year: 2053,
        yield: 12
    },
    {
        year: 2054,
        yield: 9
    },
    {
        year: 2055,
        yield: 14
    },
    {
        year: 2056,
        yield: 18
    },
    {
        year: 2057,
        yield: 13
    },
    {
        year: 2058,
        yield: 11
    },
    {
        year: 2059,
        yield: 14
    },
    {
        year: 2060,
        yield: 11
    },
    {
        year: 2061,
        yield: 11
    },
    {
        year: 2062,
        yield: 12
    },
    {
        year: 2063,
        yield: 13
    },
    {
        year: 2064,
        yield: 11
    },
    {
        year: 2065,
        yield: 16
    },
    {
        year: 2066,
        yield: 10
    },
    {
        year: 2067,
        yield: 15
    },
    {
        year: 2068,
        yield: 9
    },
    {
        year: 2069,
        yield: 18
    },
    {
        year: 2070,
        yield: 14
    },
    {
        year: 2071,
        yield: 15
    },
    {
        year: 2072,
        yield: 18
    },
    {
        year: 2073,
        yield: 13
    },
    {
        year: 2074,
        yield: 16
    },
    {
        year: 2075,
        yield: 10
    },
    {
        year: 2076,
        yield: 16
    },
    {
        year: 2077,
        yield: 12
    },
    {
        year: 2078,
        yield: 12
    },
    {
        year: 2079,
        yield: 14
    },
    {
        year: 2080,
        yield: 11
    },
    {
        year: 2081,
        yield: 10
    },
    {
        year: 2082,
        yield: 13
    },
    {
        year: 2083,
        yield: 10
    },
    {
        year: 2084,
        yield: 11
    },
    {
        year: 2085,
        yield: 18
    },
    {
        year: 2086,
        yield: 18
    },
    {
        year: 2087,
        yield: 18
    },
    {
        year: 2088,
        yield: 11
    },
    {
        year: 2089,
        yield: 18
    },
    {
        year: 2090,
        yield: 15
    },
    {
        year: 2091,
        yield: 15
    },
    {
        year: 2092,
        yield: 9
    },
    {
        year: 2093,
        yield: 9
    },
    {
        year: 2094,
        yield: 18
    },
    {
        year: 2095,
        yield: 15
    },
    {
        year: 2096,
        yield: 11
    },
    {
        year: 2097,
        yield: 10
    },
    {
        year: 2098,
        yield: 15
    },
    {
        year: 2099,
        yield: 14
    },
    {
        year: 2100,
        yield: 9
    }
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
// SVG chart dimensions
const chartWidth = 1000;
const chartHeight = 400;
const xPadding = 50;
const yPadding = 50;
const scaleFactor = 15; // vertical scale for yield

// X scale function
const xScale = (index: number) =>
  xPadding +
  (index * (chartWidth - 2 * xPadding)) / (cornYieldData.length - 1);

// Y scale function (higher yield => lower y)
const yScale = (val: number) =>
  chartHeight - yPadding - val * scaleFactor;

// Build polyline for all data points
const polylinePoints = cornYieldData
  .map((d, i) => `${xScale(i)},${yScale(d.yield)}`)
  .join(" ");

// Simple trendline from first to last
const firstYield = cornYieldData[0].yield;
const lastYield = cornYieldData[cornYieldData.length - 1].yield;
const slope = (lastYield - firstYield) / (cornYieldData.length - 1);
const trendPoints = cornYieldData
  .map((_, i) => {
    const trendY = firstYield + slope * i;
    return `${xScale(i)},${yScale(trendY)}`;
  })
  .join(" ");
  
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
            </svg>
          </div>
        </section>

        {/* Chart Section */}
        <section className="min-h-screen py-20 px-4 relative">
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/30 to-transparent opacity-70 z-0"
            style={{ transform: `translateY(${(scrollY - 500) * 0.1}px)` }}
          ></div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <h2
              className="text-5xl font-bold text-center mb-16 text-blue-100"
              style={{
                transform: `translateY(${Math.max(0, (scrollY - 600) * 0.2)}px)`,
                opacity: Math.min(1, Math.max(0, (scrollY - 500) / 300)),
              }}
            >
              Corn Yield Projections
            </h2>

            <div
              className="mb-16"
              style={{
                opacity: Math.min(1, Math.max(0, (scrollY - 600) / 400)),
                transform: `translateY(${Math.max(
                  0,
                  100 - (scrollY - 600) * 0.2
                )}px)`,
              }}
            >
              <div className="bg-black bg-opacity-50 p-6 rounded-xl border border-blue-800 backdrop-blur-sm">
                <div className="relative h-80 mb-8">
                  <svg
                    className="w-full h-full"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  >
                    {/* Axes */}
                    <line
                      x1={xPadding}
                      y1={chartHeight - yPadding}
                      x2={chartWidth - xPadding}
                      y2={chartHeight - yPadding}
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="2"
                    />
                    <line
                      x1={xPadding}
                      y1={yPadding}
                      x2={xPadding}
                      y2={chartHeight - yPadding}
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="2"
                    />

                    {/* Decade Labels on X-Axis */}
                    {cornYieldData.map((d, i) => {
                      const cx = xScale(i);
                      if (d.year % 10 === 0) {
                        return (
                          <text
                            key={d.year}
                            x={cx}
                            y={chartHeight - (yPadding - 10)}
                            fill="white"
                            fontSize="14"
                            textAnchor="middle"
                          >
                            {d.year}
                          </text>
                        );
                      }
                      return null;
                    })}

                    {/* Original Polyline (all data) */}
                    <polyline
                      fill="none"
                      stroke="#4299e1"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylinePoints}
                    />

                    

                    {/* All Data Points */}
                    {cornYieldData.map((entry, i) => {
                      const cx = xScale(i);
                      const cy = yScale(entry.yield);
                      return (
                        <g key={entry.year}>
                          <circle cx={cx} cy={cy} r="4" fill="#4299e1" />
                          {/* Show yield above circle */}
                          <text
                            x={cx}
                            y={cy - 10}
                            fill="white"
                            fontSize="12"
                            textAnchor="middle"
                          >
                            
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="text-center">
                  <p className="text-xl font-semibold mb-2">Mg/ha</p>
                  <p className="text-gray-300">
                    Projected increase in corn yield through 2100
                  </p>
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
                  <p className="text-gray-400 mt-2">Mg/ha</p>
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