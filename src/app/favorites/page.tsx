'use client';

import { useEffect, useState } from 'react';
import CardCCTV from '@/app/components/CardCCTV';
import { CCTVInterface } from '@/app/types';
import SkeletonCard from '@/app/components/SkeletonCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<CCTVInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');

      fetch('/api/cctv')
        .then((res) => res.json())
        .then((cctvList: CCTVInterface[]) => {
          setFavorites(cctvList.filter((cctv) => savedFavorites.includes(cctv.id)));
        })
        .catch((err) => console.error('Error fetching data:', err))
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6">⭐ Favorite CCTV Streams</h2>

      <div className="p-4 md:p-6 flex justify-center gap-4 flex-wrap">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
        ) : favorites.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No favorite CCTV streams added yet.</p>
        ) : (
          favorites.map((cctv) => <CardCCTV key={cctv.id} {...cctv} />)
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
