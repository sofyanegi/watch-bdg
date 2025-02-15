'use client';

import { useState, useEffect } from 'react';
import { CCTVInterface } from '@/app/types';

export default function CardCCTV({ id, cctv_name: title, stream_cctv: streamUrl }: CCTVInterface) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(savedFavorites.includes(id));
  }, [id]);

  const toggleFavorite = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavorites = [];

    if (savedFavorites.includes(id)) {
      updatedFavorites = savedFavorites.filter((favId: string) => favId !== id);
    } else {
      updatedFavorites = [...savedFavorites, id];
    }

    setIsFavorite(!isFavorite);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden" key={id}>
      <div className="aspect-video bg-black relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 dark:bg-gray-800 animate-pulse">
            <div className="w-full h-full bg-gray-400 dark:bg-gray-700 rounded-lg"></div>
          </div>
        )}

        <video autoPlay src={streamUrl} onLoadedData={() => setIsLoading(false)} controls className="w-full h-full" />
      </div>

      <div className="flex justify-between items-center p-3 border-t dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <button onClick={toggleFavorite} className={`p-2 rounded-full transition ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
}
