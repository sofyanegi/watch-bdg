'use client';

import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCCTVStore } from '@/stores/useCCTVStore';
import { Button } from '@/components/ui/button';
import ClientInfo from '@/components/buttons/ClientInfo';
import { ArrowUp, RefreshCw } from 'lucide-react';
import { SearchBar } from './_components/SearchBar';
import { CityFilter } from './_components/CityFilter';
import { CCTVList } from './_components/CCTVList';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showButtons, setShowButtons] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const { cctvs, isLoading, searchQuery, selectedCity, visibleCount, fetchCCTVs, setSearchQuery, setSelectedCity, showMore } = useCCTVStore();

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams, setSearchQuery]);

  useEffect(() => {
    fetchCCTVs();
  }, [fetchCCTVs]);

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
      setSearchQuery(e.target.value);
      updateQueryParams(e.target.value);
    },
    [setSearchQuery, updateQueryParams]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    updateQueryParams('');
  }, [setSearchQuery, updateQueryParams]);

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowButtons(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredData = useMemo(() => {
    return cctvs.filter((cctv) => cctv.cctv_name.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedCity ? cctv.cctv_city === selectedCity : true));
  }, [cctvs, searchQuery, selectedCity]);

  const cities = useMemo(() => Array.from(new Set(cctvs.map((cctv) => cctv.cctv_city).filter((city): city is string => Boolean(city)))).sort((a, b) => a.localeCompare(b)), [cctvs]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) showMore();
      },
      { threshold: 1 }
    );
    if (lastItemRef.current) observerRef.current.observe(lastItemRef.current);
    return () => observerRef.current?.disconnect();
  }, [visibleCount, showMore]);

  return (
    <>
      <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} handleClearSearch={handleClearSearch} />
      <CityFilter cities={cities} selectedCity={selectedCity} handleCityClick={handleCityClick} />
      <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
        <CCTVList data={filteredData.slice(0, visibleCount)} isLoading={isLoading} />
        <div ref={lastItemRef} className="h-10" />
      </div>
      {showButtons && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed right-4 bottom-4 flex flex-col gap-2">
          <Button onClick={handleScrollToTop} aria-label="Scroll to top" className="flex items-center justify-center sm:p-3 p-4 bg-slate-600 text-white rounded-lg shadow-lg hover:bg-slate-700 transition">
            <ArrowUp />
          </Button>
          <Button onClick={handleRefresh} aria-label="Refresh page" className="flex items-center justify-center sm:p-3 p-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition">
            <RefreshCw />
          </Button>
        </motion.div>
      )}
      <ClientInfo />
    </>
  );
}
