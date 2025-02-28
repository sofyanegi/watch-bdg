'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import LoadingVideo from '@/components/common/LoadingVideo';
import type { ClientInfo } from '@/types';
import { fetchClientInfo } from '@/services/api/clientInfo';
import Link from 'next/link';

const ClientInfoDisplay = ({ clientInfo }: { clientInfo: ClientInfo }) => {
  const infoList = useMemo(
    () =>
      [
        { label: 'Browser', value: `${clientInfo.browser} ${clientInfo.browserVersion}` },
        { label: 'Device Type', value: clientInfo.deviceType },
        { label: 'HLS Supported', value: clientInfo.supportsHLS ? '✅ Yes' : '❌ No' },
        clientInfo.timezone && { label: 'Timezone', value: clientInfo.timezone },
        clientInfo.city && { label: 'Location', value: `${clientInfo.city}, ${clientInfo.region}, ${clientInfo.country}` },
        // { label: 'User-Agent', value: clientInfo.userAgent },
        // clientInfo.ip && { label: 'IP Address', value: clientInfo.ip },
        // clientInfo.isp && { label: 'ISP', value: clientInfo.isp },
        // clientInfo.batteryLevel !== undefined && { label: 'Battery Level', value: `${clientInfo.batteryLevel}%` },
        // clientInfo.isCharging !== undefined && { label: 'Charging', value: clientInfo.isCharging ? '🔌 Yes' : '❌ No' },
        // clientInfo.gpu && { label: 'GPU', value: clientInfo.gpu },
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
  const creditData: { name: string; url: string }[] = [
    { name: 'Diskominfo Kota Bandung', url: 'https://pelindung.bandung.go.id' },
    { name: 'Dishub Kab. Bandung', url: 'https://dishub.bandungkab.go.id/apps/cctv/bandungkab/' },
    { name: 'Dishub Kab. Bandung Barat', url: 'https://atcs.bandungbaratkab.go.id' },
    { name: 'Dishub Kota Cimahi', url: 'https://smartcity.cimahikota.go.id/cctv#' },
  ];

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchClientInfo();
      setClientInfo(data);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold mb-4">📡 Client Info</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">Disclaimer: This information is displayed for debugging purposes only and is not stored or shared with any third party.</DialogDescription>
          {clientInfo ? <ClientInfoDisplay clientInfo={clientInfo} /> : <LoadingVideo />}
          <p className="text-center font-medium my-2 text-base">All credits go to:</p>
          <div className="text-sm sm:text-xs mt-4 flex flex-wrap justify-center items-center gap-2">
            {creditData.map(({ name, url }) => (
              <Link
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {name}
              </Link>
            ))}
          </div>
        </DialogHeader>
        <DialogFooter className="text-xs text-gray-500 mt-4 text-center mx-auto">
          <span className="inline-flex items-center">
            ©{new Date().getFullYear()} Crafted by
            <Link href="https://saweria.co/sofyanegi" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-1 font-bold">
              Sofyanegi
            </Link>
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
