import { create } from 'zustand';
import { ProductPassport, UserPreferences, ScoringProfile } from '../types';

interface ProductStore {
  recentScans: ProductPassport[];
  currentProduct: ProductPassport | null;
  preferences: UserPreferences;
  setCurrentProduct: (product: ProductPassport | null) => void;
  addToHistory: (product: ProductPassport) => void;
  setProfile: (profile: ScoringProfile) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  recentScans: [],
  currentProduct: null,
  preferences: {
    profile: 'default',
    priorityFlags: [],
    premiumUnlocked: false,
  },

  setCurrentProduct: (product) => set({ currentProduct: product }),

  addToHistory: (product) =>
    set((state) => ({
      recentScans: [product, ...state.recentScans.slice(0, 49)], // keep last 50
    })),

  setProfile: (profile) =>
    set((state) => ({
      preferences: { ...state.preferences, profile },
    })),
}));
