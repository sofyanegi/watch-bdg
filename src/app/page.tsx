'use client';

import { useEffect, useState, useMemo } from 'react';
import { CCTVInterface } from '@/types';
import CardCCTV from '@/components/CardCCTV';
import SkeletonCard from '@/components/SkeletonCard';
import { getCCTV } from '@/services/cctv';

export default function Home() {
  const showItemsCard = 6;
  const [data, setData] = useState<CCTVInterface[]>([]);
  const [visibleCount, setVisibleCount] = useState(showItemsCard);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    const loadCCTV = async () => {
      setIsLoading(true);

      try {
        const cctvData = await getCCTV();
        setData(cctvData);
      } catch (err) {
        console.error('Error fetching CCTV data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCCTV();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((cctv) => {
      const matchesSearch = cctv.cctv_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity ? cctv.city === selectedCity : true;
      return matchesSearch && matchesCity;
    });
  }, [data, searchQuery, selectedCity]);

  return (
    <>
      <div className="p-4 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search CCTV..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-full dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {['Bandung', 'Bandung Barat'].map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(selectedCity === city ? null : city)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition border ${
              selectedCity === city ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: showItemsCard }).map((_, index) => <SkeletonCard key={index} />)
        ) : filteredData.length > 0 ? (
          filteredData.slice(0, visibleCount).map((cctv) => <CardCCTV key={cctv.id} {...cctv} />)
        ) : searchQuery || selectedCity ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">🚨 No results found</p>
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
