'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CCTVInterface } from '@/types';
import L from 'leaflet';
import CardCCTV from '@/components/CardCCTV';

const cctvIcon = new L.Icon({
  iconUrl: '/pin.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function CCTVMapPage() {
  const [cctvs, setCCTVs] = useState<CCTVInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCCTVData = useCallback(async () => {
    try {
      const response = await fetch('/api/cctv', {
        next: {
          revalidate: 604800,
        },
      });
      const data = await response.json();
      setCCTVs(data);
    } catch (error) {
      console.error('Error fetching CCTV data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCCTVData();
  }, [fetchCCTVData]);

  const defaultCenter: [number, number] = [-6.914744, 107.60981];

  return (
    <div className="h-max-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 md:px-10">
      <h2 className="text-2xl font-bold text-center mb-6">📍 CCTV Live Map</h2>

      {loading ? (
        <div className="h-[75vh] w-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      ) : (
        <MapContainer center={defaultCenter} zoom={15} className="h-[75vh] w-full rounded-lg shadow-lg" scrollWheelZoom>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {cctvs.map((cctv: CCTVInterface) => (
            <Marker key={cctv.id} position={[Number(cctv.lat), Number(cctv.lng)]} icon={cctvIcon}>
              <Popup minWidth={300} maxWidth={300} position={[Number(cctv.lat), Number(cctv.lng)]}>
                <CardCCTV {...cctv} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
