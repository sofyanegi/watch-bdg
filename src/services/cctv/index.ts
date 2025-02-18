import { CCTVInterface } from '@/types';
import get from '@/services/axios';

const CACHE_DAYS = 1;
const CACHE_DURATION_MS = CACHE_DAYS * 24 * 60 * 60 * 1000;

export const fetchCCTVData = async <T>(url: string, transformData: (data: T) => T): Promise<T> => {
  const cachedData = localStorage.getItem(url);
  const cachedTimestamp = localStorage.getItem(`${url}_timestamp`);
  const now = Date.now();

  if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp) < CACHE_DURATION_MS) {
    return transformData(JSON.parse(cachedData));
  } else {
    try {
      const res = await get<T>(url);
      const newData = res.data;
      const processedData = transformData(newData);

      localStorage.setItem(url, JSON.stringify(processedData));
      localStorage.setItem(`${url}_timestamp`, now.toString());

      return processedData;
    } catch (err) {
      console.error('Error fetching CCTV data:', err);
      return transformData({} as T);
    }
  }
};

const sortCCTVData = (list: CCTVInterface[], favorites: string[]): CCTVInterface[] => {
  return list.sort((a, b) => {
    const aFav = a.cctv_id ? favorites.includes(a.cctv_id) : false;
    const bFav = b.cctv_id ? favorites.includes(b.cctv_id) : false;
    return Number(bFav) - Number(aFav) || a.cctv_name.localeCompare(b.cctv_name);
  });
};

export const getCCTV = async (): Promise<CCTVInterface[]> => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  return fetchCCTVData<CCTVInterface[]>('/api/cctv', (cctvList) => sortCCTVData(cctvList, favorites));
};

export const getFavoritesCCTV = async (): Promise<CCTVInterface[]> => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const cctvList = await getCCTV();
  return cctvList.filter((cctv) => favorites.includes(cctv.cctv_id));
};
