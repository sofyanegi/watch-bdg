'use client';

import { useEffect, useState, useMemo } from 'react';
import CardCCTV from '@/app/components/CardCCTV';
import SkeletonCard from '@/app/components/SkeletonCard';
import { CCTVInterface } from '@/app/types';

export default function Home() {
  const showItemsCard = 6;
  const [data, setData] = useState<CCTVInterface[]>([]);
  const [visibleCount, setVisibleCount] = useState(showItemsCard);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);

    fetch('/api/cctv')
      .then((res) => res.json())
      .then((cctvList) => {
        const sortedData = cctvList.sort((a: CCTVInterface, b: CCTVInterface) => {
          const aFav = storedFavorites.includes(a.id);
          const bFav = storedFavorites.includes(b.id);
          if (aFav !== bFav) return bFav - aFav;
          return a.cctv_name.localeCompare(b.cctv_name);
        });

        setData(sortedData);
      })
      .catch((err) => console.error('Error fetching data:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((cctv) => cctv.cctv_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  return (
    <>
      <div className="p-4 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search CCTV..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>

          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">
              ✖
            </button>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 flex justify-center gap-4 flex-wrap">
        {isLoading ? (
          Array.from({ length: showItemsCard }).map((_, index) => <SkeletonCard key={index} />)
        ) : filteredData.length > 0 ? (
          filteredData.slice(0, visibleCount).map((cctv) => <CardCCTV key={cctv.id} {...cctv} />)
        ) : searchQuery ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">🚨 No results found for &quot;{searchQuery}&quot;</p>
        ) : null}
      </div>

      {!isLoading && visibleCount < filteredData.length && (
        <div className="text-center mt-4 pb-11">
          <button onClick={() => setVisibleCount((prev) => prev + showItemsCard / 2)} className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition">
            Show More
          </button>
        </div>
      )}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed right-4 bottom-4 p-2 bg-slate-600 text-white rounded-full shadow-lg hover:bg-slate-700 transition ${visibleCount > showItemsCard ? 'block' : 'hidden'}`}
      >
        ⬆
      </button>
    </>
  );
}
