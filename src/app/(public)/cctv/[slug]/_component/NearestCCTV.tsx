import Link from 'next/link';
import { CCTV } from '@/types';
import { generateSlug } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface NearestCCTVsProps {
  cctvList: CCTV[];
}

export default function NearestCCTV({ cctvList }: NearestCCTVsProps) {
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">Nearest CCTVs</h3>
      <ScrollArea className="h-[300px] md:h-[400px] w-full rounded-md">
        <div className="p-2">
          {cctvList.map((cctvItem) => (
            <div key={cctvItem.cctv_id}>
              <Link href={`/cctv/${generateSlug(cctvItem.cctv_name)}`} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700">
                <p className="text-gray-900 dark:text-gray-200 font-medium text-sm md:text-base truncate w-3/4">{cctvItem.cctv_name}</p>
                <span>{cctvItem.distance?.toFixed(2)} km</span>
              </Link>
              <Separator className="my-1 md:my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
