"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Individual Corn Plant Component
function CornPlant({ position, rotation, scale, planetType }: { 
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  planetType: "earth" | "mars";
}) {
  const corn = useGLTF("/models/corn.glb");
  const ref = useRef<THREE.Group>(null);
  
  // Add gentle swaying animation
  useFrame(({ clock }) => {
    if (ref.current) {
      // Gentle sway for earth plants
      if (planetType === "earth") {
        ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5 + position[0]) * 0.05;
      } 
      // Different sway pattern for Mars plants (could be less due to lower gravity)
      else {
        ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3 + position[0]) * 0.03;
      }
    }
  });

  return (
    <group 
      ref={ref} 
      position={position} 
      rotation={rotation} 
      scale={[scale, scale, scale]}
    >
      <primitive object={corn.scene} />
    </group>
  );
}

// Function to generate random position within bounds
function getRandomPosition(index: number, count: number, planetType: "earth" | "mars", radius: number): [number, number, number] {
  // Different distributions based on planet type
  if (planetType === "earth") {
    // For Earth: More uniform distribution
    const angleStep = (2 * Math.PI) / count;
    const angle = index * angleStep + (Math.random() * 0.5 - 0.25); // Add slight randomness
    
    const x = Math.cos(angle) * radius * (0.7 + Math.random() * 0.6);
    const z = Math.sin(angle) * radius * (0.7 + Math.random() * 0.6);
    
    // Height varies slightly
    const y = -1 + Math.random() * 0.3;
    
    return [x, y, z];
  } else {
    // For Mars: More clustered distribution (dome agriculture)
    const clusterCount = Math.max(1, Math.floor(count / 10));
    const clusterIndex = index % clusterCount;
    const clusterSize = count / clusterCount;
    const intraClusterIndex = index % clusterSize;
    
    // Create cluster centers
    const clusterAngle = (2 * Math.PI * clusterIndex) / clusterCount;
    const clusterX = Math.cos(clusterAngle) * radius * 0.7;
    const clusterZ = Math.sin(clusterAngle) * radius * 0.7;
    
    // Position within cluster
    const intraRadius = 2;
    const intraAngle = (2 * Math.PI * intraClusterIndex) / clusterSize;
    
    const x = clusterX + Math.cos(intraAngle) * intraRadius * Math.random();
    const z = clusterZ + Math.sin(intraAngle) * intraRadius * Math.random();
    
    // Height varies slightly
    const y = -1 + Math.random() * 0.2;
    
    return [x, y, z];
  }
}

// Function to generate random rotation
function getRandomRotation(): [number, number, number] {
  return [
    0, // Keep upright
    Math.random() * Math.PI * 2, // Random Y rotation
    (Math.random() * 0.2 - 0.1) // Slight tilt
  ];
}

// Function to calculate dynamic scale based on count
function getDynamicScale(count: number, planetType: "earth" | "mars"): number {
  // Base scaling logic
  const baseScale = planetType === "earth" ? 0.8 : 0.6;
  
  // Reduce scale as count increases
  const scaleFactor = Math.max(0.1, 1 / Math.sqrt(count));
  
  return baseScale * scaleFactor;
}

// Main Corn Field Component
export default function CornField({ count, planetType }: { count: number; planetType: "earth" | "mars" }) {
  // Calculate dynamic radius and base scale
  const radius = count < 20 ? 8 : Math.min(15, Math.sqrt(count) * 1.2);
  const baseScale = getDynamicScale(count, planetType);

  // Generate corn plants data
  const cornPlants = Array.from({ length: count }, (_, i) => ({
    position: getRandomPosition(i, count, planetType, radius),
    rotation: getRandomRotation(),
    scale: baseScale * (0.8 + Math.random() * 0.4), // Add slight variation
    id: i
  }));

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      {/* Appropriate lighting for each planet */}
      <ambientLight intensity={planetType === "earth" ? 0.8 : 0.6} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={planetType === "earth" ? 1 : 0.8}
        color={planetType === "earth" ? "#ffffff" : "#ffcc99"}
      />
      
      {/* Ground plane with appropriate color */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={planetType === "earth" ? "#3a5a40" : "#9c6644"}
          roughness={0.8}
        />
      </mesh>
      
      {/* Corn plants */}
      {cornPlants.map((plant) => (
        <CornPlant
          key={plant.id}
          position={plant.position}
          rotation={plant.rotation}
          scale={plant.scale}
          planetType={planetType}
        />
      ))}
      
      {/* Background environment */}
      {planetType === "mars" && (
        <mesh position={[0, 0, -30]} scale={50}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#270000" side={THREE.BackSide} />
        </mesh>
      )}
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.1} // Limit to just above horizon
      />
    </Canvas>
  );
}