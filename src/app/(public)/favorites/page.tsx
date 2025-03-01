'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCCTVStore, useFavoritesStore } from '@/stores/useCCTVStore';
import CardCCTV from '../_component/CardCCTV';
import SkeletonCard from '@/app/(public)/_component/SkeletonCard';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const { cctvs, isLoading, fetchCCTVs } = useCCTVStore();
  const { favorites } = useFavoritesStore();
  const LOADING_SKELETONS = 3;

  useEffect(() => {
    fetchCCTVs(); // Fetch CCTV data when the page loads
  }, [fetchCCTVs]);

  // Get favorite CCTVs
  const favoriteCCTVs = cctvs.filter((cctv) => favorites.has(cctv.cctv_id || ''));

  return (
    <div className="max-w-full mx-auto px-4">
      <h2 className="text-2xl font-semibold text-center mb-6">⭐ Favorite CCTV Streams</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 place-items-center">
        {/* Show skeletons while fetching CCTV data */}
        {isLoading ? (
          Array.from({ length: LOADING_SKELETONS }).map((_, index) => <SkeletonCard key={index} />)
        ) : favoriteCCTVs.length > 0 ? (
          favoriteCCTVs.map((cctv) => <CardCCTV key={cctv.cctv_id} {...cctv} />)
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
