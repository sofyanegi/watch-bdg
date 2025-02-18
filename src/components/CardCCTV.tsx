'use client';

import { useState, useEffect } from 'react';
import { CCTVInterface } from '@/types';

export default function CardCCTV({ cctv_id, cctv_name: title, cctv_stream: streamUrl, cctv_city }: CCTVInterface) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(savedFavorites.includes(cctv_id));
  }, [cctv_id]);

  const toggleFavorite = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = savedFavorites.includes(cctv_id) ? savedFavorites.filter((favId: string) => favId !== cctv_id) : [...savedFavorites, cctv_id];

    setIsFavorite(!isFavorite);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden">
      <div className="aspect-video bg-black relative">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 dark:bg-gray-800 animate-pulse">
            <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!hasError ? (
          <video
            autoPlay
            controls
            muted
            onLoadedData={() => {
              setIsLoading(false);
              setHasError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className="w-full h-full"
          >
            <source src={streamUrl} type="application/x-mpegURL" />
          </video>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800">
            <p className="text-red-500 font-semibold">Stream Unavailable</p>
            <button
              onClick={() => {
                setIsLoading(true);
                setHasError(false);
              }}
              className="mt-3 px-4 py-1 bg-red-600 dark:bg-red-300 dark:text-red-800 text-white rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={toggleFavorite} className={`p-2 rounded-full transition-transform transform ${isFavorite ? 'text-red-500 scale-110' : 'text-gray-400 hover:scale-105'}`}>
            {isFavorite ? '⭐️' : '☆'}
          </button>
        </div>

        {cctv_city && (
          <div className="mt-2">
            <span className="inline-block text-xs text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">{cctv_city}</span>
          </div>
        )}
      </div>
    </div>
  );
}
