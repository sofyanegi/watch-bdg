import { CCTV } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface ColumnsProps {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCCTV: React.Dispatch<React.SetStateAction<CCTV | null>>;
}

export const columns = ({ setDialogOpen, setAlertOpen, setSelectedCCTV }: ColumnsProps): ColumnDef<CCTV>[] => [
  {
    header: 'CCTV Name',
    accessorKey: 'cctv_name',
    enableSorting: true,
  },
  {
    header: 'Stream URL',
    accessorKey: 'cctv_stream',
    cell: ({ row }) => {
      const streamUrl = row.getValue('cctv_stream') as string;
      return (
        <Link href={streamUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {streamUrl}
        </Link>
      );
    },
  },
  {
    header: 'City',
    accessorKey: 'cctv_city',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const cctv = row.original;

      const handleEdit = () => {
        setSelectedCCTV(cctv);
        setDialogOpen(true);
      };

      const handleDelete = () => {
        setSelectedCCTV(cctv);
        setAlertOpen(true);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
