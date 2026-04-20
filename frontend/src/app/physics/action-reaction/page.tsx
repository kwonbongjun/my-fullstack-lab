"use client";

import LabCanvas from "@/components/lab/LabCanvas";
import ExperimentControls from "@/components/ui/ExperimentControls";
import ActionReactionScene from "@/components/experiments/physics/ActionReactionScene";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ActionReactionPage() {
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
        <h3 className="text-white font-bold mb-1">
          실험 이론: 뉴턴의 제3법칙 (작용-반작용)
        </h3>
        <p>두 물체가 서로에게 가하는 힘은 크기가 같고 방향이 반대입니다.</p>
        <p className="mt-2 text-blue-400 font-mono">
          F(A-{">"}B) = -F(B-&gt;A)
        </p>
      </div>

      {/* 3D Canvas */}
      <LabCanvas>
        <ActionReactionScene />
      </LabCanvas>
    </div>
  );
}
