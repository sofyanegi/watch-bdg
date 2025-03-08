'use client';

import { CCTV } from '@/types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn, generateSlug } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Star, StarOff } from 'lucide-react';
import { useFavoritesStore } from '@/stores/useCCTVStore';
import { getCityColor } from './CityFilter';
import { VideoJs } from '@/components/common/VideoJS';
import { getProxiedUrl } from '@/lib/utils';

export default function CardCCTV({ cctv_id, cctv_name, cctv_stream, cctv_city }: CCTV) {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const isFavorite = cctv_id ? favorites.has(cctv_id) : false;
  const streamURL = getProxiedUrl(cctv_stream);

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden">
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        <VideoJs hlsSrc={streamURL} />
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex justify-between items-center">
          <Link href={`/cctv/${generateSlug(cctv_name)}`} className="hover:underline">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer uppercase">{cctv_name}</h3>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => cctv_id && toggleFavorite(cctv_id)}
            className={cn('rounded-full transition-transform hover:text-yellow-600 bg-white dark:bg-gray-800', isFavorite ? 'text-yellow-500 scale-110' : 'text-gray-400')}
          >
            {isFavorite ? <Star fill="currentColor" /> : <StarOff />}
          </Button>
        </div>

        {cctv_city && (
          <div className="mt-2">
            <Badge className={cn('text-white rounded-full', getCityColor(cctv_city))}>{cctv_city}</Badge>
          </div>
        )}
      </div>
    </div>
  );
}
