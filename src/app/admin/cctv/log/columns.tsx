import { ColumnDef } from '@tanstack/react-table';
import { LogEntry } from '@/types';
import { extractUserAgent } from '@/lib/utils';

export const columns: ColumnDef<LogEntry>[] = [
  {
    header: 'User Agent',
    accessorKey: 'userAgent',
    cell: ({ getValue }) => {
      const userAgent = getValue<string>();
      return extractUserAgent(userAgent);
    },
  },
  {
    header: 'IP Address',
    accessorKey: 'ip',
    enableSorting: true,
  },
  {
    header: 'City',
    accessorKey: 'city',
  },
  {
    header: 'Region',
    accessorKey: 'region',
  },
  {
    header: 'Country',
    accessorKey: 'country',
  },
  {
    header: 'ISP',
    accessorKey: 'isp',
  },
  {
    header: 'Timestamp',
    accessorKey: 'timestamp',
    enableSorting: true,
    cell: ({ getValue }) => {
      const rawValue = getValue() as string | undefined;
      if (!rawValue) return 'Unknown';

      const date = new Date(rawValue);
      if (isNaN(date.getTime())) return 'Invalid Date';

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
      }).format(date);
    },
  },
];
