import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { CCTV } from '@/types';
import { Icon } from 'leaflet';
import Link from 'next/link';
import { Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CCTVMapProps {
  cctv: CCTV;
}

export default function CCTVMap({ cctv }: CCTVMapProps) {
  const customIcon = new Icon({
    iconUrl: '/pin.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  return (
    <div className="w-full h-[20vh] md:h-[27vh] rounded-lg overflow-hidden relative z-0">
      <MapContainer center={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]} zoom={14} minZoom={13} maxZoom={15} scrollWheelZoom={false} className="h-full w-full" zoomControl={false} dragging={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <ZoomControl position="bottomright" />
        <Marker position={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]} icon={customIcon}>
          <Popup>
            {cctv.cctv_name}
            <Link href={`https://www.google.com/maps?q=${cctv.cctv_lat},${cctv.cctv_lng}`} target="_blank" rel="noopener noreferrer">
              <Button size="icon" variant="outline" className="w-full p-2">
                <Map size={18} />
                Google Maps
              </Button>
            </Link>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
