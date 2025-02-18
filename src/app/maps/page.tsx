'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CCTVInterface } from '@/types';
import L from 'leaflet';
import CardCCTV from '@/components/CardCCTV';
import { getCCTV } from '@/services/cctv';

const cctvIcon = new L.Icon({
  iconUrl: '/pin.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function CCTVMapPage() {
  const [data, setData] = useState<CCTVInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCCTV = async () => {
      setIsLoading(true);

      try {
        const cctvData = await getCCTV();
        setData(cctvData);
      } catch (err) {
        console.error('Error fetching CCTV data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCCTV();
  }, []);

  const defaultCenter: [number, number] = [-6.914744, 107.60981];

  return (
    <div className="h-max-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 md:px-10">
      <h2 className="text-2xl font-bold text-center mb-6">📍 CCTV Live Map</h2>

      {isLoading ? (
        <div className="h-[75vh] w-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      ) : (
        <MapContainer center={defaultCenter} zoom={15} className="h-[75vh] w-full rounded-lg shadow-lg" scrollWheelZoom>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {data.map((cctv: CCTVInterface) => (
            <Marker key={cctv.cctv_id} position={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]} icon={cctvIcon}>
              <Popup minWidth={300} maxWidth={300} position={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]}>
                <CardCCTV {...cctv} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
