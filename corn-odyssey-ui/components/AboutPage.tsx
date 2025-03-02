"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";


export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  
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
    
    generateStars();
  }, []);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // The team members
  const team = [
    {
      name: "Narayana Pujara",
      role: "Frontend & UI Developer",
      bio: "A Software Engineering major at University of Nebraska-Lincon",
      linkedin: "https://www.linkedin.com/in/narayana-pujara/" 
    },
    {
      name: "Samarpan Mohanty",
      role: "Data Engineer & Model Developer",
      bio: "A Computer Engineering major at University of Nebraska-Lincon",
      linkedin: "https://www.linkedin.com/in/samarpan-mohanty-8b3bb0278/"
    },
    {
      name: "Trung Huynh",
      role: "Backend & API Developer",
      bio: "A Software Engineering major at University of Nebraska-Lincon",
      linkedin: "https://www.linkedin.com/in/trung-huynh01/" 
    }
  ];
  
  return (
    <div className="rocket-cursor relative w-full min-h-screen bg-black text-white overflow-hidden">
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
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-black z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Back button */}
        <Link href="/">
          <button className="absolute top-5 left-5 bg-black bg-opacity-70 px-4 py-2 rounded-full text-white z-50 flex items-center transition-transform hover:scale-105">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" />
            </svg>
            Back to Home
          </button>
        </Link>
        
        {/* GitHub button */}
        <a 
          href="https://github.com/pujara-narayana/Corniverse-" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute top-5 right-5 bg-black bg-opacity-70 px-4 py-2 rounded-full text-white z-50 flex items-center transition-transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          GitHub
        </a>
        
        <div 
          className="max-w-4xl mx-auto mb-20 text-center"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            opacity: Math.max(0.5, 1 - scrollY / 1000)
          }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-red-500">
            About the Project
          </h1>
          <div className="h-1 w-24 bg-blue-500 mx-auto mb-10"></div>
          <p className="text-xl text-blue-100 mb-6">
            Corn Odyssey 2100 was the theme of CornHacks 2025 and we decided to create a 3d visualization of future farming.
          </p>
          <p className="text-lg text-gray-300">
            In this project we are predicting corn yields of Lincoln & Omaha for Earth and for Mars we collected almost 
            every possible data we could find so that we could predict how much corn can we grow on Mars by year 2100.
          </p>
        </div>
        
        {/* Project Division section */}
        <div 
          className="mb-20"
          style={{
            transform: `translateY(${Math.max(0, 100 - scrollY * 0.2)}px)`,
            opacity: Math.min(1, scrollY / 500)
          }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-300">Project Division</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Data Training",
                description: "Trained the data we collected using RandomForestRegressor model.",
                icon: "🧠"
              },
              {
                title: "CornHusker AI Chatbot",
                description: "Created an AI Chatbot - CornHusker, using DeepSeek's API Key.",
                icon: "🤖"
              },
              {
                title: "Implementing Backend",
                description: "Used FastAPI to create API end points and for smoother integration with Frontend.",
                icon: "👨‍💻"
              },
              {
                title: "Implementing Frontend",
                description: "Used Next.js & CSS for frontend and three.js for creating 3d models.",
                icon: "🫧"
              }
            ].map((objective, index) => (
              <div 
                key={index}
                className="bg-blue-900 bg-opacity-20 p-6 rounded-lg border border-blue-800 backdrop-blur-sm"
              >
                <div className="text-4xl mb-4">{objective.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-blue-300">{objective.title}</h3>
                <p className="text-gray-300">{objective.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Team section - Modified to align 3 team members */}
        <div 
          className="mb-20"
          style={{
            transform: `translateY(${Math.max(0, 200 - scrollY * 0.2)}px)`,
            opacity: Math.min(1, (scrollY - 300) / 500)
          }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-300">Meet the Team</h2>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div 
                  key={index}
                  className="bg-blue-900 bg-opacity-10 p-6 rounded-lg border border-blue-800 backdrop-blur-sm text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-white">{member.name}</h3>
                  <p className="text-blue-300 mb-3 text-sm">{member.role}</p>
                  <p className="text-gray-400 text-sm mb-4">{member.bio}</p>
                  
                  {/* LinkedIn Connect Button */}
                  <a 
                    href={member.linkedin}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 rounded-full text-white text-sm font-medium transition-transform hover:bg-blue-700 hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                    </svg>
                    Connect
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div 
          className="text-center max-w-2xl mx-auto py-12"
          style={{
            opacity: Math.min(1, (scrollY - 700) / 300)
          }}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Join the Mission</h2>
          <p className="text-lg text-gray-300 mb-8">
            The Corn Odyssey 2100 is just beginning. Explore our solar system and discover
            the future of interplanetary agriculture.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold transition-transform hover:scale-105">
                Begin Journey
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black bg-opacity-70 text-white p-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Corn Odyssey 2100. A cosmic journey through space agriculture.</p>
      </footer>
    </div>
  );
}