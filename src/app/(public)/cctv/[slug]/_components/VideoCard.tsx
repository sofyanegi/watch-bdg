import { CCTV } from '@/types';
import { Button } from '@/components/ui/button';
import ShareButton from '@/components/common/ShareButton';
import { Badge } from '@/components/ui/badge';
import { useFavoritesStore } from '@/stores/useCCTVStore';
import { Star, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCityColor } from '@/app/(public)/_components/CityFilter';
import { VideoJs } from '@/components/common/VideoJS';
import { getProxiedUrl } from '@/lib/utils';

interface VideoCardProps {
  cctv: CCTV;
}

export default function VideoCard({ cctv }: VideoCardProps) {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const isFavorite = cctv.cctv_id ? favorites.has(cctv.cctv_id) : false;
  const streamURL = getProxiedUrl(cctv.cctv_stream);

  return (
    <div className="w-full md:flex-1 shadow-lg rounded-2xl overflow-hidden transition hover:shadow-xl">
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        <VideoJs hlsSrc={streamURL} />
      </div>

      <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base md:text-lg lg:text-xl font-semibold uppercase">{cctv.cctv_name}</h3>
          <Badge className={cn('text-white rounded-full', getCityColor(cctv?.cctv_city || ''))}>{cctv.cctv_city}</Badge>
        </div>

        <div className="flex items-center gap-3">
          <ShareButton title={cctv.cctv_name} url={typeof window !== 'undefined' ? window.location.href : ''} />
          <Button
            variant="outline"
            size="icon"
            onClick={() => cctv.cctv_id && toggleFavorite(cctv.cctv_id)}
            className={cn('rounded-full transition-transform hover:text-yellow-600 bg-white dark:bg-gray-800', isFavorite ? 'text-yellow-500 scale-110' : 'text-gray-400')}
          >
            {isFavorite ? <Star fill="currentColor" /> : <StarOff />}
          </Button>
        </div>
      </div>
    </div>
  );
}
