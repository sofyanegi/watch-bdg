'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/context/ThemeContext';
import FavoriteButton from '@/components/buttons/FavoriteButton';
import MapButton from '@/components/buttons/MapButton';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/button';

export default function Navbar() {
  const { status } = useSession();

  return (
    <header>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 shadow-lg border-b border-gray-200 dark:border-gray-700 py-4 px-4 transition-colors duration-200 ">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl md:text-2xl  font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">👀watchBDG</h1>
          </Link>
          <div className="flex items-center gap-1 md:gap-2">
            <MapButton />
            <FavoriteButton />
            <ThemeToggle />
            {status === 'authenticated' && (
              <Button onClick={() => signOut()} className=" bg-red-500 text-white">
                Sign out
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
