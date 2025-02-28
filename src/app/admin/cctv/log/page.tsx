'use client';

import { useEffect, useState } from 'react';
import { LogEntry } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { get } from '@/lib/axios';

export default function LogPages() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await get('/api/cctv/log');
        setLogs(res as LogEntry[]);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold text-gray-800 mb-5 text-center">User Logs</h1>
      <DataTable columns={columns} data={logs} />
    </div>
  );
}
