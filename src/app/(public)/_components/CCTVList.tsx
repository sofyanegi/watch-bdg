import { useFavoritesStore } from '@/stores/useCCTVStore';
import CardCCTV from './CardCCTV';
import SkeletonCard from '@/app/(public)/_components/SkeletonCard';
import { CCTV } from '@/types';

export function CCTVList({ data, isLoading, visibleCount }: { data: CCTV[]; isLoading: boolean; visibleCount: number }) {
  const { favorites } = useFavoritesStore();

  if (isLoading) return Array.from({ length: visibleCount }).map((_, index) => <SkeletonCard key={index} />);
  if (data.length === 0) return <p className="text-center text-gray-500 dark:text-gray-400 mt-4 col-span-3">🚨 No results found</p>;

  const sortedCCTVs = [...data].sort((a, b) => {
    const aFav = a.cctv_id && favorites.has(a.cctv_id) ? -1 : 1;
    const bFav = b.cctv_id && favorites.has(b.cctv_id) ? -1 : 1;
    return aFav - bFav;
  });

  return sortedCCTVs.slice(0, visibleCount).map((cctv) => <CardCCTV key={cctv.cctv_id} {...cctv} />);
}
