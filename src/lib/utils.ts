import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of Earth in km
  const toRad = (angle: number) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export function generateSlug(name: string): string {
  return slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });
}

const cityColors: Record<string, { light: string; dark: string }> = {
  Bandung: { light: 'bg-blue-500 hover:bg-blue-600', dark: 'dark:bg-blue-700 dark:hover:bg-blue-800' },
  'Kab. Bandung': { light: 'bg-green-600 hover:bg-green-700', dark: 'dark:bg-green-700 dark:hover:bg-green-800' },
  'Bandung Barat': { light: 'bg-red-500 hover:bg-red-600', dark: 'dark:bg-red-600 dark:hover:bg-red-700' },
  Cimahi: { light: 'bg-orange-500 hover:bg-orange-600', dark: 'dark:bg-orange-600 dark:hover:bg-orange-700' },
};

export const getCityColor = (city: string) => (cityColors[city] ? `${cityColors[city].light} ${cityColors[city].dark}` : 'bg-gray-500 dark:bg-gray-700');
