'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCCTVStore } from '@/stores/useCCTVStore';
import { CCTV } from '@/types';
import { getDistance, generateSlug } from '@/lib/utils';
import VideoPlayer from './_component/VideoPlayer';
import CCTVMap from './_component/CCTVMap';
import NearestCCTV from './_component/NearestCCTV';
import LoadingVideo from '@/components/common/LoadingVideo';

export default function CCTVDetail() {
  const { slug } = useParams();
  const { cctvs, fetchCCTVs } = useCCTVStore();

  const [cctv, setCctv] = useState<CCTV | null>(null);
  const [cctvList, setCctvList] = useState<CCTV[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cctvs.length === 0) {
      fetchCCTVs();
    } else {
      const detailData = cctvs.find((item) => generateSlug(item.cctv_name) === slug);
      if (!detailData) return;

      setCctv(detailData);
      setCctvList(
        cctvs
          .filter((item) => item.cctv_id !== detailData.cctv_id)
          .map((item) => ({
            ...item,
            distance: getDistance(Number(detailData.cctv_lat), Number(detailData.cctv_lng), Number(item.cctv_lat), Number(item.cctv_lng)),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 10)
      );
      setIsLoading(false);
    }
  }, [cctvs, slug, fetchCCTVs]);

  if (isLoading) return <LoadingVideo />;
  if (!cctv) return notFound();

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 py-2 -mt-4 md:mt-0">
      <VideoPlayer cctv={cctv} />
      <div className="w-full md:w-[350px]">
        <CCTVMap cctv={cctv} />
        <NearestCCTV cctvList={cctvList} />
      </div>
    </div>
  );
}
