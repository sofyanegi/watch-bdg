'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

import { CCTV } from '@/types';
import CardCCTV from '@/components/cards/CardCCTV';
import SkeletonCard from '@/components/cards/SkeletonCard';
import { Button } from '@/components/ui/button';
import { getFavoritesCCTV } from '@/services/api/cctv';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<CCTV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const LOADING_SKELETONS = 3;

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const updatedFavorites = await getFavoritesCCTV();
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className="max-w-full mx-auto px-4">
      <h2 className="text-2xl font-semibold text-center mb-6">⭐ Favorite CCTV Streams</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 place-items-center">
        {isLoading ? (
          Array.from({ length: LOADING_SKELETONS }).map((_, index) => <SkeletonCard key={index} />)
        ) : favorites.length > 0 ? (
          favorites.map((cctv) => <CardCCTV key={cctv.cctv_id} {...cctv} />)
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-3">No favorite CCTV streams added yet.</p>
        )}
      </div>

      <div className="text-center my-4">
        <Link href="/">
          <Button variant="default" className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition">
            Show All Streams
          </Button>
        </Link>
      </div>
    </div>
  );
}
