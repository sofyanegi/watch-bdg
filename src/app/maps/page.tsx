/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';

import { CCTV } from '@/types';
import CardCCTV from '@/components/cards/CardCCTV';
import { getCCTV } from '@/services/api/cctv';

export default function CCTVMapPage() {
  const [data, setData] = useState<CCTV[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const cctvIcon = new L.Icon({
    iconUrl: '/cctv.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const defaultCenter: [number, number] = [-6.89, 107.609];

  const createClusterCustomIcon = useCallback((cluster: any) => {
    return L.divIcon({
      html: `
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-[#0078A8] text-white font-semibold border-2 border-white shadow-lg">
          <span>${cluster.getChildCount()}</span>
        </div>
      `,
      className: '',
      iconSize: L.point(40, 40, true),
    });
  }, []);

  useEffect(() => {
    const fetchCCTVData = async () => {
      setIsLoading(true);
      try {
        const cctvData = await getCCTV();
        setData(cctvData);
      } catch (error) {
        console.error('Error fetching CCTV data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCCTVData();
  }, []);

  return (
    <div className="h-max-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 pt-0 md:px-4">
      <h2 className="text-2xl font-bold text-center mb-6">📍 CCTV Live Map</h2>

      {isLoading ? (
        <div className="h-[75vh] w-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      ) : (
        <MapContainer center={defaultCenter} zoom={12} maxZoom={16} className="h-[80vh] w-full rounded-lg shadow-lg markercluster-map relative z-0" zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; Crafted by Sofyanegi" />
          <ZoomControl position="bottomright" />
          <MarkerClusterGroup
            showCoverageOnHover
            maxClusterRadius={40}
            polygonOptions={{ color: 'blue', weight: 5, opacity: 0.5 }}
            spiderLegPolylineOptions={{ weight: 5, color: 'blue', opacity: 0.5 }}
            iconCreateFunction={createClusterCustomIcon}
          >
            {data.map((cctv) => (
              <Marker key={cctv.cctv_id} position={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]} icon={cctvIcon}>
                <Popup minWidth={300} maxWidth={300}>
                  <CardCCTV {...cctv} />
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      )}
    </div>
  );
}
