"use client";
import { useState } from "react";
import SpaceScene from "@/components/SpaceScene";

export default function Home() {
  const [immersive, setImmersive] = useState(false);

  return (
    <main className="relative w-full h-screen bg-black">
      <SpaceScene immersive={immersive} toggleImmersive={() => setImmersive(!immersive)} />
    </main>
  );
}
