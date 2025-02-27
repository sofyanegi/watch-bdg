'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LoadingVideo from '@/components/common/LoadingVideo';
import type { ClientInfo } from '@/types';
import { fetchClientInfo } from '@/services/api/clientInfo';

const ClientInfoDisplay = ({ clientInfo }: { clientInfo: ClientInfo }) => {
  const infoList = useMemo(
    () =>
      [
        { label: 'Browser', value: `${clientInfo.browser} ${clientInfo.browserVersion}` },
        { label: 'User-Agent', value: clientInfo.userAgent },
        { label: 'Device Type', value: clientInfo.deviceType },
        { label: 'HLS Supported', value: clientInfo.supportsHLS ? '✅ Yes' : '❌ No' },
        clientInfo.ip && { label: 'IP Address', value: clientInfo.ip },
        clientInfo.city && { label: 'Location', value: `${clientInfo.city}, ${clientInfo.region}, ${clientInfo.country}` },
        clientInfo.timezone && { label: 'Timezone', value: clientInfo.timezone },
        clientInfo.isp && { label: 'ISP', value: clientInfo.isp },
        clientInfo.batteryLevel !== undefined && { label: 'Battery Level', value: `${clientInfo.batteryLevel}%` },
        clientInfo.isCharging !== undefined && { label: 'Charging', value: clientInfo.isCharging ? '🔌 Yes' : '❌ No' },
        clientInfo.gpu && { label: 'GPU', value: clientInfo.gpu },
      ].filter(Boolean),
    [clientInfo]
  ).filter((item): item is { label: string; value: string } => !!item);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200 rounded-lg shadow-md">
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
        <Button variant="ghost" size="icon" className="fixed bottom-4 left-4 dark:hover:bg-gray-800 bg-gray-200 dark:bg-gray-700 shadow-lg p-2 rounded-full">
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold mb-4">📡 Client Info</DialogTitle>
          {clientInfo ? <ClientInfoDisplay clientInfo={clientInfo} /> : <LoadingVideo />}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
