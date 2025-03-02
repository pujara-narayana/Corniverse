"use client";

import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF, Html } from "@react-three/drei";
import Link from "next/link"; // Import Link for Next.js navigation
import "./SpaceScene.css";

// Floating Astronaut Component
function FloatingAstronaut({ immersive }: { immersive: boolean }) {
  if (immersive) return null; // Hide astronaut in immersive mode

  const astronaut = useGLTF("/models/astronaut.glb");
  const ref = useRef<THREE.Group>(null);
  const directionX = useRef(1);
  const directionY = useRef(1);
  const speed = 0.02;
  const [screenLimitX, setScreenLimitX] = useState(4);
  const [screenLimitY, setScreenLimitY] = useState(2.5);

  useFrame(({ size }) => {
    if (ref.current) {
      const aspectRatio = size.width / size.height;
      setScreenLimitX(5 * aspectRatio);
      ref.current.position.x += speed * directionX.current;
      ref.current.position.y += (speed / 2) * directionY.current;
      if (ref.current.position.x > screenLimitX || ref.current.position.x < -screenLimitX)
        directionX.current *= -1;
      if (ref.current.position.y > screenLimitY || ref.current.position.y < 0.5)
        directionY.current *= -1;
      ref.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={ref} object={astronaut.scene} scale={1.5} position={[0, 1, -2]} />;
}

// Solar System Component
function SolarSystem({ 
  onPlanetClick, 
  immersive,
  handleNavigation
}: { 
  onPlanetClick: (planet: string) => void, 
  immersive: boolean,
  handleNavigation: (path: string) => void
}) {
  const textureLoader = (url: string) => useLoader(THREE.TextureLoader, url);
  
  const planets = [
    { name: "Sun", position: [0, 0, 0], size: 2, texture: "/textures/sun.jpg", emissiveIntensity: 2 },
    { name: "Mercury", position: [5, 0, 0], size: 0.3, texture: "/textures/mercury.jpg", emissiveIntensity: 1 },
    { name: "Venus", position: [7, 0, 0], size: 0.7, texture: "/textures/venus.jpg", emissiveIntensity: 1 },
    { name: "Earth", position: [10, 0, 0], size: 0.9, texture: "/textures/earth.jpg", emissiveIntensity: 1, clickable: true },
    { name: "Mars", position: [15, 0, 0], size: 0.7, texture: "/textures/mars.jpg", emissiveIntensity: 1, clickable: true },
    { name: "Jupiter", position: [20, 0, 0], size: 2, texture: "/textures/jupiter.jpg", emissiveIntensity: 1 },
    { name: "Saturn", position: [25, 0, 0], size: 1.8, texture: "/textures/saturn.jpg", emissiveIntensity: 1 },
    { name: "Uranus", position: [30, 0, 0], size: 1.5, texture: "/textures/uranus.jpg", emissiveIntensity: 1 },
    { name: "Neptune", position: [35, 0, 0], size: 1.4, texture: "/textures/neptune.jpg", emissiveIntensity: 1 },
  ];
  
  // Planet hover state
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  const handlePlanetClick = (name: string) => {
    // First focus on the planet (camera animation)
    onPlanetClick(name.toLowerCase());
    
    // Then after a delay, navigate to the planet page
    if (immersive) {
      setTimeout(() => {
        handleNavigation(`/${name.toLowerCase()}`);
      }, 1500);
    }
  };

  return (
    <>
      {planets.map(({ name, position, size, texture, emissiveIntensity, clickable }) => {
        const textureMap = textureLoader(texture);
        const isHovered = hoveredPlanet === name;
        const isClickable = clickable && immersive;
        
        return (
          <group key={name}>
            <mesh
              position={new THREE.Vector3(...position)}
              onClick={isClickable ? () => handlePlanetClick(name) : undefined}
              onPointerOver={isClickable ? () => setHoveredPlanet(name) : undefined}
              onPointerOut={isClickable ? () => setHoveredPlanet(null) : undefined}
            >
              <sphereGeometry args={[size * (isHovered ? 1.1 : 1), 32, 32]} />
              <meshStandardMaterial
                map={textureMap}
                emissiveMap={textureMap}
                emissiveIntensity={isHovered ? emissiveIntensity * 1.5 : emissiveIntensity}
              />
            </mesh>
            
            {/* Add planet name below Earth and Mars only */}
            {(name === "Earth" || name === "Mars") && (
              <Html position={[position[0], position[1] - size - 0.5, position[2]]} center>
                <div className={`planet-name ${isHovered ? 'planet-name-hover' : ''}`}>
                  {name}
                  {isHovered && immersive && <span className="planet-tooltip">Click to explore</span>}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

// Camera Controller Component
function CameraController({
  focusedPlanet,
  resetCamera,
  onResetComplete,
}: {
  focusedPlanet: string | null;
  resetCamera: boolean;
  onResetComplete: () => void;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (resetCamera && controlsRef.current) {
      // Disable OrbitControls during reset
      controlsRef.current.enabled = false;

      // Reset camera position and target
      controlsRef.current.object.position.set(0, 2, 15);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();

      // Re-enable OrbitControls after reset
      setTimeout(() => {
        controlsRef.current.enabled = true;
        onResetComplete(); // Notify that reset is complete
      }, 100); // Small delay to ensure smooth transition
    }

    if (focusedPlanet) {
      const positions: { [key: string]: THREE.Vector3 } = {
        earth: new THREE.Vector3(10, 0, 4),
        mars: new THREE.Vector3(15, 0, 4),
      };
      camera.position.lerp(positions[focusedPlanet], 0.05); // Slower for smoother transition
      camera.lookAt(new THREE.Vector3(positions[focusedPlanet].x, positions[focusedPlanet].y, positions[focusedPlanet].z - 2));
    }
  });

  return <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} enableRotate={true} />;
}

// Page Transition Overlay
function PageTransition({ planetName }: { planetName: string | null }) {
  if (!planetName) return null;
  
  return (
    <div className={`page-transition ${planetName}-transition`}>
      <div className="loading-text">
        Preparing journey to {planetName.charAt(0).toUpperCase() + planetName.slice(1)}...
      </div>
    </div>
  );
}

// Main component with client-side rendering
export default function SpaceScene({ immersive, toggleImmersive }: { immersive: boolean; toggleImmersive: () => void }) {
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
  const [resetCamera, setResetCamera] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);

  // Handle navigation with Next.js Link component
  const handleNavigation = (path: string) => {
    // Clear any previous errors
    setNavigationError(null);
    
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      try {
        // Use window.location for direct navigation
        window.location.href = path;
      } catch (error) {
        console.error("Navigation error:", error);
        setNavigationError(`Failed to navigate to ${path}`);
        setIsTransitioning(false);
        setFocusedPlanet(null);
      }
    }
  };

  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true);
    
    // Add console log to help with debugging
    console.log("SpaceScene mounted, available routes should include /earth and /mars");
  }, []);

  const handleResetComplete = () => {
    setResetCamera(false); // Reset the state after the camera reset is complete
  };

  const handlePlanetClick = (planet: string) => {
    setFocusedPlanet(planet);
    if (immersive) {
      setIsTransitioning(true);
      
      // Add fallback to cancel transition if navigation doesn't happen
      const fallbackTimer = setTimeout(() => {
        if (isTransitioning) {
          setIsTransitioning(false);
        }
      }, 5000); // 5 second fallback
      
      // Clean up timer
      return () => clearTimeout(fallbackTimer);
    }
  };

  // Show a loading state if we're not in the client yet
  if (!isClient) {
    return <div className="loading-container">Loading 3D Space Scene...</div>;
  }

  return (
    <div className="scene-container">
      {/* Show any navigation errors */}
      {navigationError && (
        <div className="navigation-error">
          <p>{navigationError}</p>
          <button onClick={() => setNavigationError(null)}>Dismiss</button>
        </div>
      )}
      
      <Canvas camera={{ position: [0, 2, 15] }}>
        <Stars />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FloatingAstronaut immersive={immersive} />
        <SolarSystem 
          onPlanetClick={handlePlanetClick} 
          immersive={immersive} 
          handleNavigation={handleNavigation}
        />
        <CameraController
          focusedPlanet={focusedPlanet}
          resetCamera={resetCamera}
          onResetComplete={handleResetComplete}
        />
      </Canvas>

      {!immersive && (
        <>
          <div className="static-overlay">
            <h1 className="sci-fi-title">🌽 Corn Odyssey 2100</h1>
          </div>
          <div className="overlay">
            <p className="description">
              A futuristic prediction of corn yield on Earth & Mars!!
            </p>
            <button className="enter-btn" onClick={toggleImmersive}>Enter Immersive Mode</button>
            
            {/* Removed the direct links as requested */}
          </div>
        </>
      )}

      {immersive && (
        <div className="immersive-buttons">
          <button className="reset-btn" onClick={() => setResetCamera(true)}>🔄 Reset Camera</button>
          <button className="exit-btn" onClick={toggleImmersive}>🚪 Exit Immersive Mode</button>
          {focusedPlanet && !isTransitioning && (
            <button className="exit-planet-btn" onClick={() => setFocusedPlanet(null)}>
              Exit {focusedPlanet.charAt(0).toUpperCase() + focusedPlanet.slice(1)}
            </button>
          )}
        </div>
      )}
      
      {/* Page transition overlay */}
      {isTransitioning && <PageTransition planetName={focusedPlanet} />}
    </div>
  );
}