/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CCTV } from '@/types';
import CardCCTV from '@/components/cards/CardCCTV';
import SkeletonCard from '@/components/cards/SkeletonCard';
import { getCCTV } from '@/services/api/cctv';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const showItemsCard = 6;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<CCTV[]>([]);
  const [visibleCount, setVisibleCount] = useState(showItemsCard);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadCCTV = async () => {
      setIsLoading(true);
      try {
        const cctvData = await getCCTV();
        if (!controller.signal.aborted) {
          setData(cctvData);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Error fetching CCTV data:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCCTV();
    return () => controller.abort();
  }, []);

  const updateQueryParams = useCallback(
    (query: string) => {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      updateQueryParams(query);
    },
    [updateQueryParams]
  );

  const filteredData = useMemo(() => {
    const queryLower = searchQuery.toLowerCase();
    return data.filter((cctv) => cctv.cctv_name.toLowerCase().includes(queryLower) && (selectedCity ? cctv.cctv_city === selectedCity : true));
  }, [data, searchQuery, selectedCity]);

  const cities = useMemo(() => {
    const citySet = new Set<string>();
    data.forEach((cctv) => cctv.cctv_city && citySet.add(cctv.cctv_city));
    return Array.from(citySet);
  }, [data]);

  return (
    <>
      <div className="p-4 flex justify-center">
        <div className="relative w-full max-w-md">
          <Input
            type="text"
            placeholder="Search CCTV..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 pl-10 border rounded-full dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>

          {searchQuery && (
            <button onClick={() => handleSearchChange({ target: { value: '' } } as any)} className="absolute right-3 top-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">
              ✖
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {cities.map((city) => (
          <Button
            key={city}
            onClick={() => setSelectedCity(selectedCity === city ? null : city)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition border ${
              selectedCity === city ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {city}
          </Button>
        ))}
      </div>

      <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
        {isLoading ? (
          Array.from({ length: showItemsCard }).map((_, index) => <SkeletonCard key={index} />)
        ) : filteredData.length > 0 ? (
          filteredData.slice(0, visibleCount).map((cctv) => <CardCCTV key={cctv.cctv_id} {...cctv} />)
        ) : searchQuery || selectedCity ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4 col-span-3">🚨 No results found</p>
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
