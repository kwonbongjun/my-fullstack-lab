"use client";

import { useLabStore } from "@/store/useLabStore";

export default function ExperimentControls() {
  const { mass, appliedForce, setMass, setAppliedForce, resetExperiment, acceleration } = useLabStore();

  return (
    <div className="absolute top-4 left-4 z-10 w-80 bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-2xl text-white">
      <h2 className="text-xl font-bold mb-6 border-b border-slate-700 pb-2">Physics Lab: f = ma</h2>
      
      <div className="space-y-6">
        {/* Mass Control */}
        <div>
          <label className="flex justify-between text-sm mb-2">
            <span>질량 (Mass)</span>
            <span className="font-mono text-blue-400">{mass.toFixed(1)} kg</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="10.0"
            step="0.5"
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Force Control */}
        <div>
          <label className="flex justify-between text-sm mb-2">
            <span>힘 (Applied Force)</span>
            <span className="font-mono text-red-400">{appliedForce.toFixed(1)} N</span>
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={appliedForce}
            onChange={(e) => setAppliedForce(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>

        {/* Real-time Data */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider">가속도 (a)</span>
            <span className="text-lg font-mono text-green-400">{(appliedForce / mass).toFixed(2)} m/s²</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 italic">* 마찰력은 고려되지 않은 이상적인 상태입니다.</p>
        </div>

        {/* Action Buttons */}
        <button
          onClick={resetExperiment}
          className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-xl font-semibold transition-all shadow-lg active:scale-95"
        >
          실험 초기화 (Reset)
        </button>
      </div>
    </div>
  );
}
