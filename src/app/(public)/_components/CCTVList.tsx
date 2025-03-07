import { useMemo } from 'react';
import { useFavoritesStore } from '@/stores/useCCTVStore';
import CardCCTV from './CardCCTV';
import SkeletonCard from '@/app/(public)/_components/SkeletonCard';
import { CCTV } from '@/types';

export function CCTVList({ data, isLoading }: { data: CCTV[]; isLoading: boolean }) {
  const { favorites } = useFavoritesStore();

  const sortedCCTVs = useMemo(() => {
    if (data.length === 0) return [];
    return [...data].sort((a, b) => {
      const aFav = a.cctv_id && favorites.has(a.cctv_id) ? -1 : 1;
      const bFav = b.cctv_id && favorites.has(b.cctv_id) ? -1 : 1;
      return aFav - bFav;
    });
  }, [data, favorites]);

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </>
    );
  }

  if (data.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-4 col-span-3">🚨 No results found</p>;
  }

  return sortedCCTVs.map((cctv) => <CardCCTV key={cctv.cctv_id} {...cctv} />);
}
