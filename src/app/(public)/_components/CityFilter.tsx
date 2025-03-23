import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const getCityColor = (city: string): string => {
  const colors: Record<string, string> = {
    bandung: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800',
    'kab. bandung': 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
    'bandung barat': 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
    cimahi: 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700',
    sumedang: 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700',
    'kab. garut': 'bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700',
    'kab. cianjur': 'bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700',
    tasikmalaya: 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700',
    banjar: 'bg-rose-800 hover:bg-rose-900 dark:bg-rose-800 dark:hover:bg-rose-900',
    indramayu: 'bg-sky-700 hover:bg-sky-800 dark:bg-sky-700 dark:hover:bg-sky-800',
  };

  return colors[city.trim().toLowerCase()] || 'bg-gray-500 dark:bg-gray-700';
};

export function CityFilter({ cities, selectedCity, handleCityClick }: { cities: string[]; selectedCity: string | null; handleCityClick: (city: string) => void }) {
  return (
    <div className="flex sm:justify-center gap-2 overflow-x-auto whitespace-nowrap px-2 py-2 scrollbar-hide">
      {cities.map((city) => (
        <Button
          key={city}
          variant={selectedCity === city ? 'default' : 'ghost'}
          onClick={() => handleCityClick(city)}
          className={cn('rounded-full px-4 py-2 text-sm font-medium transition text-white', selectedCity === city ? getCityColor(city) : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300')}
        >
          {city}
        </Button>
      ))}
    </div>
  );
}
