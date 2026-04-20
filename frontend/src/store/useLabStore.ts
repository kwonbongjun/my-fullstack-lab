import { create } from "zustand";

interface LabState {
  mass: number;
  appliedForce: number;
  acceleration: number;
  isResetting: boolean;
  resetCount: number;
  
  setMass: (mass: number) => void;
  setAppliedForce: (force: number) => void;
  setAcceleration: (acceleration: number) => void;
  resetExperiment: () => void;
  finishReset: () => void;
}

export const useLabStore = create<LabState>((set) => ({
  mass: 1.0,
  appliedForce: 0, // Default to 0 so it doesn't move immediately
  acceleration: 0,
  isResetting: false,
  resetCount: 0,

  setMass: (mass) => set({ mass }),
  setAppliedForce: (appliedForce) => set({ appliedForce }),
  setAcceleration: (acceleration) => set({ acceleration }),
  resetExperiment: () => set((state) => ({ 
    isResetting: true, 
    mass: 1.0, 
    appliedForce: 0, 
    resetCount: state.resetCount + 1 
  })),
  finishReset: () => set({ isResetting: false }),
}));
