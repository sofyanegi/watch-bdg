import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

export function SearchBar({ searchQuery, handleSearchChange, handleClearSearch }: { searchQuery: string; handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void; handleClearSearch: () => void }) {
  return (
    <div className="p-4 flex justify-center -mt-4 md:mt-0">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search CCTV..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pl-10 pr-10 border rounded-full dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {searchQuery && (
          <button onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
