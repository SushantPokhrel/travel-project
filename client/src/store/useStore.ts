import { create } from "zustand";
import type { StoreState } from "@/lib/types";

export const useStore = create<StoreState>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  userLoader: true,
  setUserLoader: (userLoaded) => set({ userLoader: userLoaded }),
}));
