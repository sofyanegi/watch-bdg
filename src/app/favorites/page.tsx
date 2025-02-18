'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CCTVInterface } from '@/types';
import CardCCTV from '@/components/CardCCTV';
import SkeletonCard from '@/components/SkeletonCard';
import { getFavoritesCCTV } from '@/services/cctv';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<CCTVInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    setIsLoading(true);

    try {
      const updatedFavorites = await getFavoritesCCTV();
      setFavorites(updatedFavorites);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6">⭐ Favorite CCTV Streams</h2>

      <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
        ) : favorites.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No favorite CCTV streams added yet.</p>
        ) : (
          favorites.map((cctv) => <CardCCTV key={cctv.cctv_id} {...cctv} />)
        )}
      </div>

      <div className="text-center mt-4 pb-11">
        <Link href="/">
          <button className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition">Show All Streams</button>
        </Link>
      </div>
    </>
  );
}
