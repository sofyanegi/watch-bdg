import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CCTV } from '@/types';
import { getCCTV } from '@/services/api/cctv';
import { toast } from '@/hooks/use-toast';

// ✅ CCTV Store (Handles CCTV data, search, and pagination)
interface CCTVStore {
  cctvs: CCTV[];
  isLoading: boolean;
  searchQuery: string;
  selectedCity: string | null;
  visibleCount: number;
  fetchCCTVs: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCity: (city: string | null) => void;
  showMore: () => void;
}

export const useCCTVStore = create<CCTVStore>((set) => ({
  cctvs: [],
  isLoading: true,
  searchQuery: '',
  selectedCity: null,
  visibleCount: 6,

  fetchCCTVs: async () => {
    set({ isLoading: true });
    try {
      const cctvData = await getCCTV();
      set({ cctvs: cctvData });
    } catch (error) {
      console.error('Error fetching CCTV data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCity: (city) =>
    set((state) => ({
      selectedCity: state.selectedCity === city ? null : city,
    })),
  showMore: () =>
    set((state) => ({
      visibleCount: state.visibleCount + 6,
    })),
}));

// ✅ Favorites Store (Handles favorite logic separately)
interface FavoritesStore {
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      favorites: new Set(),

      toggleFavorite: (id) => {
        set((state) => {
          const updatedFavorites = new Set(state.favorites);
          if (updatedFavorites.has(id)) {
            updatedFavorites.delete(id);
            toast({
              title: 'Removed from favorites',
              description: 'This CCTV stream has been removed from your favorites.',
              variant: 'destructive',
              duration: 3000,
            });
          } else {
            updatedFavorites.add(id);
            toast({
              title: 'Added to favorites',
              description: 'This CCTV stream has been added to your favorites.',
              duration: 3000,
            });
          }
          return { favorites: updatedFavorites };
        });
      },
    }),
    {
      name: 'favorites',
      partialize: (state) => ({
        favorites: Array.from(state.favorites),
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        favorites: new Set(Array.isArray((persistedState as Partial<FavoritesStore>)?.favorites) ? (persistedState as Partial<FavoritesStore>)?.favorites : []),
      }),
    }
  )
);
