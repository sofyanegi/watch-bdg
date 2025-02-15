'use client';

import { ThemeToggle } from '../context/ThemeContext';

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-200 dark:bg-gray-800 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bandung Watch</h1>
      <ThemeToggle />
    </nav>
  );
}
