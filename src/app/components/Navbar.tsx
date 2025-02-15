'use client';

import Link from 'next/link';
import { ThemeToggle } from '../context/ThemeContext';
import FavoriteButton from './FavoriteButton';

export default function Navbar() {
  return (
    <header>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-200 dark:bg-gray-800 shadow-md py-1 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl md:text-2xl  font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">👀 watchBDG</h1>
          </Link>
          <div className="flex items-center gap-1 md:gap-4">
            <ThemeToggle />
            <FavoriteButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
