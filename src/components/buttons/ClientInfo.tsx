/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import LoadingVideo from '@/components/common/LoadingVideo';
import type { ClientInfo } from '@/types';
import { fetchClientInfo } from '@/services/api/clientInfo';
import Link from 'next/link';
import { logUserAccess } from '@/app/actions/log';
import { getCityColor } from '@/app/(public)/_components/CityFilter';

const ClientInfoDisplay = ({ clientInfo }: { clientInfo: ClientInfo }) => {
  const infoList = useMemo(
    () =>
      [
        { label: 'Browser', value: `${clientInfo.browser} ${clientInfo.browserVersion}` },
        { label: 'Device Type', value: clientInfo.deviceType },
        { label: 'HLS Supported', value: clientInfo.supportsHLS ? '✅ Yes' : '❌ No' },
      ].filter(Boolean),
    [clientInfo]
  ).filter((item): item is { label: string; value: string } => !!item);

  return (
    <div className="p-6 w-full mx-auto bg-gray-100 rounded-lg shadow-md">
      <div className="space-y-3">
        {infoList.map(({ label, value }, index) => (
          <div key={index} className="flex justify-between border-b border-gray-300 dark:border-gray-700 pb-1 text-sm sm:text-base">
            <strong>{label}:</strong> <span className="text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ClientInfo() {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const creditData: { name: string; city: string; url: string }[] = [
    { name: 'Diskominfo Kota Bandung', city: 'bandung', url: 'https://pelindung.bandung.go.id' },
    { name: 'Dishub Kab. Bandung', city: 'kab. bandung', url: 'https://dishub.bandungkab.go.id/apps/cctv/bandungkab' },
    { name: 'Dishub Kab. Bandung Barat', city: 'bandung barat', url: 'https://atcs.bandungbaratkab.go.id' },
    { name: 'Dishub Kota Cimahi', city: 'cimahi', url: 'https://smartcity.cimahikota.go.id/cctv' },
    { name: 'Dishub Kab. Sumedang', city: 'sumedang', url: 'https://atcs.sumedangkab.go.id' },
    { name: 'Diskominfo Kab. Garut', city: 'kab. garut', url: 'https://dashboard.garutkab.go.id/cctv-galeri' },
  ];

  const logData = async (data: ClientInfo) => {
    if (process.env.NODE_ENV !== 'production') return;
    const now = Date.now();
    const lastLogTime = Number(localStorage.getItem('lastAccessLog')) || 0;
    const logInterval = 30 * 60 * 1000; // 30 minutes

    if (now - lastLogTime < logInterval) return;

    try {
      await logUserAccess(data);
      localStorage.setItem('lastAccessLog', String(now));
    } catch (error) {
      console.error('Failed to log user access:', error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchClientInfo();
      setClientInfo(data);
      await logData(data);
    } catch (error) {
      console.error('Failed to fetch client info:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed bottom-3 left-3 dark:hover:bg-gray-800 bg-gray-200 dark:bg-gray-700 shadow-lg p-2 rounded-full">
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-100 ">
        <DialogHeader>
          {/* <DialogTitle className="text-lg sm:text-xl font-bold mb-4">📡 Client Info</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">Disclaimer: This information is displayed for debugging purposes only and is not stored or shared with any third party.</DialogDescription>
          {clientInfo ? <ClientInfoDisplay clientInfo={clientInfo} /> : <LoadingVideo />} */}
          <DialogTitle className="text-lg sm:text-xl font-bold mb-4 text-center">Credits</DialogTitle>
          <DialogDescription className="text-center text-xs text-gray-800 mb-3">This application uses data provided by official government sources.</DialogDescription>
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-xs sm:flex sm:flex-wrap sm:justify-center">
              {creditData.map(({ name, city, url }) => (
                <Link
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block px-3 py-2 border shadow-lg rounded-lg font-semibold transition text-center text-white ${getCityColor(city)}`}
                  aria-label={`Visit ${name}`}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="text-xs text-gray-500 mt-4 text-center mx-auto">
          <span className="inline-flex items-center">
            Crafted by
            <Link href="https://saweria.co/sofyanegi" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-1 font-bold" aria-label="Support Sofyanegi on Saweria">
              Sofyanegi
            </Link>
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
