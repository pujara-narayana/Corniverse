"use client";

import { useState, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stars } from "@react-three/drei";

// Rotating Earth Component
function RotatingEarth() {
  const earth = useGLTF("/models/earth.glb");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      // Simple rotation around the y-axis
      ref.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={ref} object={earth.scene} scale={2} position={[0, 0, 0]} />;
}

// Main Earth Scene Component
export default function EarthScene() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <RotatingEarth />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.4}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}