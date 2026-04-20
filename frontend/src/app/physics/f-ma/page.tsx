"use client";

import LabCanvas from "@/components/lab/LabCanvas";
import ExperimentControls from "@/components/ui/ExperimentControls";
import FmaScene from "@/components/experiments/physics/FmaScene";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function FmaPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Navigation Header */}
      <header className="absolute top-4 right-4 z-10">
        <Link 
          href="/physics" 
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700 text-white hover:bg-slate-700 transition-all shadow-lg"
        >
          <ChevronLeft size={20} />
          <span>목록으로 돌아가기</span>
        </Link>
      </header>

      {/* Experiment Controls UI */}
      <ExperimentControls />

      {/* Information Overlay */}
      <div className="absolute bottom-4 left-4 z-10 p-4 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700 text-slate-300 text-sm max-w-md">
        <h3 className="text-white font-bold mb-1">실험 이론: 뉴턴의 제2법칙 (F=ma)</h3>
        <p>물체의 가속도(a)는 가해진 힘(F)에 비례하고 물체의 질량(m)에 반비례합니다.</p>
        <p className="mt-2 text-blue-400 font-mono">가속도(a) = 힘(F) / 질량(m)</p>
      </div>

      {/* 3D Canvas */}
      <LabCanvas>
        <FmaScene />
      </LabCanvas>
    </div>
  );
}
