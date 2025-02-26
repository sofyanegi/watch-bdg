'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { notFound, useParams } from 'next/navigation';
import { CCTV } from '@/types';
import { Badge } from '@/components/ui/badge';
import { getCCTV } from '@/services/api/cctv';
import Link from 'next/link';
import { Map } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import { getDistance, generateSlug } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ShareButton from '@/components/common/ShareButton';

export default function CCTVDetail() {
  const { slug } = useParams();
  const [cctv, setCctv] = useState<CCTV | null>(null);
  const [cctvList, setCctvList] = useState<CCTV[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const allCCTVs = await getCCTV();
      const detailData = allCCTVs.find((item) => generateSlug(item.cctv_name) === slug);

      if (!detailData) {
        setIsLoading(false);
        return;
      }

      const nearestCCTVs = allCCTVs
        .filter((item) => item.cctv_id !== detailData.cctv_id)
        .map((item) => ({
          ...item,
          distance: getDistance(Number(detailData.cctv_lat), Number(detailData.cctv_lng), Number(item.cctv_lat), Number(item.cctv_lng)),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);

      setCctv(detailData);
      setCctvList(nearestCCTVs);
    } catch (error) {
      console.error('Error fetching CCTV details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) fetchData();
  }, [slug, fetchData]);

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!cctv) return notFound();

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 -mt-8">
      <div className="w-full md:flex-1 bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden transition hover:shadow-xl">
        <div className="w-full bg-black rounded-t-2xl overflow-hidden">
          <video src={cctv.cctv_stream} controls className="w-full h-[40vh] md:h-[75vh] aspect-video" autoPlay muted />
        </div>

        <div className="p-3 border-t dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 justify-between">
            {cctv.cctv_name}
            <Badge className="text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-full">{cctv.cctv_city}</Badge>
          </h3>
          <ShareButton title={cctv.cctv_name} url={window.location.href} />
        </div>
      </div>

      <div className="w-full md:w-[350px]">
        <div className="w-full h-[20vh] md:h-[30vh] rounded-lg overflow-hidden relative z-0">
          <MapContainer
            center={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]}
            minZoom={13}
            zoom={14}
            maxZoom={15}
            scrollWheelZoom={false}
            className="h-full w-full"
            zoomControl={false}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            keyboard={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&amp;copy Crafted by Sofyanegi" />
            <ZoomControl position="bottomright" />
            <Marker position={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]} icon={customIcon}>
              <Popup>
                {cctv.cctv_name}
                <Link href={`https://www.google.com/maps?q=${cctv.cctv_lat},${cctv.cctv_lng}`} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="outline" className="dark:hover:bg-gray-800 w-full p-2 dark:text-white dark:bg-gray-800">
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
              className="text-sm flex p-2 items-center justify-between bg-white dark:bg-gray-800 shadow-sm rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700 border"
            >
              <p className="text-gray-900 dark:text-gray-200 font-medium">{cctvItem.cctv_name}</p>
              <span>{(cctvItem.distance ?? 0).toFixed(2)} km</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
