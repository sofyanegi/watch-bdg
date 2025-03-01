import { useState } from 'react';
import { CCTV } from '@/types';
import LoadingVideo from '@/components/common/LoadingVideo';
import { Button } from '@/components/ui/button';
import ShareButton from '@/components/common/ShareButton';
import { Badge } from '@/components/ui/badge';
import { useFavoritesStore } from '@/stores/useCCTVStore';
import { Star, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  cctv: CCTV;
}

export default function VideoPlayer({ cctv }: VideoPlayerProps) {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const isFavorite = cctv.cctv_id ? favorites.has(cctv.cctv_id) : false;

  const [videoStatus, setVideoStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [videoKey, setVideoKey] = useState(0);

  const retryVideo = () => {
    setVideoStatus('loading');
    setVideoKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="w-full md:flex-1 bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden transition hover:shadow-xl">
      <div className="relative w-full bg-black rounded-t-2xl overflow-hidden">
        {videoStatus === 'loading' && <LoadingVideo />}

        <video key={videoKey} autoPlay controls muted playsInline className="w-full h-[40vh] md:h-[75vh] aspect-video" onLoadedData={() => setVideoStatus('success')} onError={() => setVideoStatus('error')}>
          <source src={cctv.cctv_stream} type="application/x-mpegURL" />
        </video>

        {videoStatus === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white">
            <p className="text-red-500 font-semibold">Stream Unavailable</p>
            <Button variant="destructive" onClick={retryVideo} className="mt-3">
              Retry
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">{cctv.cctv_name}</h3>
          <Badge className="bg-blue-500 text-white rounded-full">{cctv.cctv_city}</Badge>
        </div>

        <div className="flex items-center gap-3">
          <ShareButton title={cctv.cctv_name} url={typeof window !== 'undefined' ? window.location.href : ''} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => cctv.cctv_id && toggleFavorite(cctv.cctv_id)}
            className={cn('rounded-full transition-transform duration-200', isFavorite ? 'text-yellow-500 scale-110' : 'text-gray-400 hover:text-gray-600')}
          >
            {isFavorite ? <Star fill="currentColor" /> : <StarOff />}
          </Button>
        </div>
      </div>
    </div>
  );
}
