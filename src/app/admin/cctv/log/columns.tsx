import { ColumnDef } from '@tanstack/react-table';
import { LogEntry } from '@/types';

const extractUserAgent = (userAgent: string): string => {
  if (!userAgent) return 'Unknown';

  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);

  const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera|SamsungBrowser|UCBrowser|MiuiBrowser|VivoBrowser|OppoBrowser)\/?\s*(\d+)/i);
  const osMatch = userAgent.match(/\(([^)]+)\)/);

  const brandMatch = userAgent.match(/(Xiaomi|Redmi|Samsung|Vivo|Oppo|Realme|Huawei|Honor|OnePlus|Nokia)/i);
  const brand = brandMatch ? brandMatch[1] : null;

  const browser = browserMatch ? `${browserMatch[1]} ${browserMatch[2]}` : 'Unknown Browser';
  const os = osMatch ? osMatch[1].split(';')[0] : 'Unknown OS';

  return brand ? `${browser} on ${brand} (${os})` : `${browser} on ${os} ${isMobile ? '(Mobile)' : '(Desktop)'}`;
};

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
