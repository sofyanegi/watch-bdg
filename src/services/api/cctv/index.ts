import { CCTV } from '@/types';
import get from '@/lib/axios';

const CACHE_HOURS = 3;
const CACHE_DURATION_MS = CACHE_HOURS * 60 * 60 * 1000;

const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorageItem = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export const fetchCCTVData = async <T>(url: string): Promise<T> => {
  const cachedData = getLocalStorageItem<T | null>(url, null);
  const cachedTimestamp = getLocalStorageItem<number | null>(`${url}_timestamp`, null);
  const now = Date.now();

  if (cachedData && cachedTimestamp && now - cachedTimestamp < CACHE_DURATION_MS) {
    return cachedData;
  }

  try {
    const res = await get<T>(url);
    const processedData = res.data ?? [];

    setLocalStorageItem(url, processedData);
    setLocalStorageItem(`${url}_timestamp`, now);

    return processedData as T;
  } catch (err) {
    console.error('Error fetching CCTV data:', err);
    return [] as unknown as T;
  }
};

export const getCCTV = async (): Promise<CCTV[]> => {
  return fetchCCTVData<CCTV[]>('/api/cctv');
};

export const getFavoritesCCTV = async (): Promise<CCTV[]> => {
  const favorites = getLocalStorageItem<string[]>('favorites', []);
  const cctvList = await getCCTV();
  return cctvList.filter((cctv) => cctv.cctv_id && favorites.includes(cctv.cctv_id));
};
