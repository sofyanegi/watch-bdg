'use client';

import { useEffect, useState, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { Map } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';

import { CCTV } from '@/types';
import { getCCTV } from '@/services/api/cctv';
import { getDistance, generateSlug } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ShareButton from '@/components/common/ShareButton';
import LoadingVideo from '@/components/common/LoadingVideo';

export default function CCTVDetail() {
  const { slug } = useParams();
  const [cctv, setCctv] = useState<CCTV | null>(null);
  const [cctvList, setCctvList] = useState<CCTV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videoStatus, setVideoStatus] = useState<'loading' | 'error' | 'success'>('loading');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCCTVs = await getCCTV();
        const detailData = allCCTVs.find((item) => generateSlug(item.cctv_name) === slug);

        if (!detailData) return setIsLoading(false);

        setCctv(detailData);
        setCctvList(
          allCCTVs
            .filter((item) => item.cctv_id !== detailData.cctv_id)
            .map((item) => ({
              ...item,
              distance: getDistance(Number(detailData.cctv_lat), Number(detailData.cctv_lng), Number(item.cctv_lat), Number(item.cctv_lng)),
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10)
        );
      } catch (error) {
        console.error('Error fetching CCTV details:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchData();
  }, [slug]);

  const customIcon = useMemo(
    () =>
      new Icon({
        iconUrl: '/pin.svg',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      }),
    []
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!cctv) return notFound();

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 py-2">
      <div className="w-full md:flex-1 bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden transition hover:shadow-xl">
        <div className="relative w-full bg-black rounded-t-2xl overflow-hidden">
          {videoStatus === 'loading' && <LoadingVideo />}
          <video autoPlay controls muted className="w-full h-[40vh] md:h-[75vh] aspect-video" onLoadedData={() => setVideoStatus('success')} onError={() => setVideoStatus('error')}>
            <source src={cctv.cctv_stream} type="application/x-mpegURL" />
          </video>

          {videoStatus === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white">
              <p className="text-red-500 font-semibold">Stream Unavailable</p>
              <Button variant="destructive" onClick={() => setVideoStatus('loading')} className="mt-3">
                Retry
              </Button>
            </div>
          )}
        </div>

        <div className="p-3 border-t dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {cctv.cctv_name}
            <Badge className="text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-full">{cctv.cctv_city}</Badge>
          </h3>
          <ShareButton title={cctv.cctv_name} url={typeof window !== 'undefined' ? window.location.href : ''} />
        </div>
      </div>

      <div className="w-full md:w-[350px]">
        <div className="w-full h-[20vh] md:h-[30vh] rounded-lg overflow-hidden">
          <MapContainer center={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]} zoom={14} minZoom={13} maxZoom={15} scrollWheelZoom={false} className="h-full w-full" zoomControl={false} dragging={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <ZoomControl position="bottomright" />
            <Marker position={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]} icon={customIcon}>
              <Popup>
                {cctv.cctv_name}
                <Link href={`https://www.google.com/maps?q=${cctv.cctv_lat},${cctv.cctv_lng}`} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="outline" className="w-full p-2 dark:bg-gray-800 dark:text-white">
                    <Map size={18} />
                    Google Maps
                  </Button>
                </Link>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <h2 className="text-lg font-semibold my-4">Nearest CCTVs</h2>
        <div className="space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto">
          {cctvList.map((cctvItem) => (
            <Link
              key={cctvItem.cctv_id}
              href={`/cctv/${generateSlug(cctvItem.cctv_name)}`}
              className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 shadow-sm rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700 border"
            >
              <p className="text-gray-900 dark:text-gray-200 font-medium text-sm md:text-base truncate w-3/4">{cctvItem.cctv_name}</p>
              <span>{cctvItem.distance?.toFixed(2)} km</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
