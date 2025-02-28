import { ColumnDef } from '@tanstack/react-table';
import { LogEntry } from '@/types';

export const columns: ColumnDef<LogEntry>[] = [
  {
    header: 'Browser | Device Type',
    accessorKey: 'userAgent',
    enableSorting: true,
    cell: ({ getValue }) => {
      const userAgent = getValue() as string;
      if (!userAgent) return 'Unknown | Unknown';

      const match = userAgent.match(/(firefox|msie|trident|chrome|safari|edge|opr|brave)\/?\s*(\d+)/i);
      const browser = match ? match[1].charAt(0).toUpperCase() + match[1].slice(1) : 'Unknown';

      const isMobile = /Mobi|Android|iPhone|iPad/i.test(userAgent);
      const deviceType = isMobile ? 'Mobile' : 'Desktop';

      return `${browser} | ${deviceType}`;
    },
  },
  {
    header: 'IP Address',
    accessorKey: 'ipData.ip',
    enableSorting: true,
  },
  {
    header: 'City',
    accessorKey: 'ipData.city',
  },
  {
    header: 'Region',
    accessorKey: 'ipData.region',
  },
  {
    header: 'Country',
    accessorKey: 'ipData.country',
  },
  {
    header: 'ISP',
    accessorKey: 'ipData.isp',
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
