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

export const extractUserAgent = (userAgent: string): string => {
  if (!userAgent) return 'Unknown';

  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);

  const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera|SamsungBrowser|UCBrowser|MiuiBrowser|VivoBrowser|OppoBrowser)\/?\s*(\d+)/i);
  const osMatch = userAgent.match(/\(([^)]+)\)/);

  const brandMatch = userAgent.match(/(Xiaomi|Redmi|Samsung|Vivo|Oppo|Realme|Huawei|Honor|OnePlus|Nokia)/i);
  const brand = brandMatch ? brandMatch[1] : null;

  const browser = browserMatch ? `${browserMatch[1]} ${browserMatch[2]}` : 'Unknown Browser';

  let os = 'Unknown OS';
  if (osMatch) {
    const osParts = osMatch[1].split(';').map((part) => part.trim());
    os = osParts.find((part) => /(Windows|Mac OS X|Android|iOS|Linux)/i.test(part)) || osParts[0];
  }

  return brand ? `${browser} on ${brand} (${os})` : `${browser} on ${os} ${isMobile ? '(Mobile)' : '(Desktop)'}`;
};

export const getProxiedUrl = (url: string) => {
  return url
    .replace('https://smartcity.cimahikota.go.id/video/', '/proxy/cimahi/')
    .replace('https://pelindung.bandung.go.id:3443/video/', '/proxy/bandung/')
    .replace('https://cctv.atcs-dishubkbb.id/', '/proxy/kbb/')
    .replace('https://cctv.bandungkab.go.id/', '/proxy/bandungkab/')
    .replace('https://atcs.sumedangkab.go.id/video/', '/proxy/sumedang/')
    .replace('https://shinobi.garutkab.go.id/', '/proxy/garut/');
};
