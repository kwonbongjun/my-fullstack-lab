"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { OrbitControls, PerspectiveCamera, Environment, Grid } from "@react-three/drei";
import { useLabStore } from "@/store/useLabStore";

interface LabCanvasProps {
  children: React.ReactNode;
}

export default function LabCanvas({ children }: LabCanvasProps) {
  const { resetCount } = useLabStore();

  return (
    <div className="w-full h-screen bg-slate-900">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={45} />
          <OrbitControls makeDefault />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Environment preset="city" />
          <Grid infiniteGrid sectionSize={1} fadeDistance={30} position={[0, 0.01, 0]} />
          
          {/* resetCount가 바뀔 때(초기화 버튼 클릭)만 물리 세계 전체를 새로 생성 */}
          <Physics key={resetCount} gravity={[0, -9.81, 0]}>
            {children}
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
