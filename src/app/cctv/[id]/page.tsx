'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { CCTV } from '@/types';
import CardCCTV from '@/components/cards/CardCCTV';
import { Badge } from '@/components/ui/badge';
import { getCCTV } from '@/services/api/cctv';
import Link from 'next/link';
import { Map } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';

export default function CCTVDetail() {
  const { id } = useParams();
  const [cctv, setCctv] = useState<CCTV | null>(null);
  const [cctvList, setCctvList] = useState<CCTV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedLimit, setRelatedLimit] = useState(window.innerWidth < 768 ? 4 : 3);

  // Update limit on resize
  useEffect(() => {
    const handleResize = () => setRelatedLimit(window.innerWidth < 768 ? 4 : 3);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if favorite
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(savedFavorites.includes(id));
  }, [id]);

  // Toggle favorite
  const toggleFavorite = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = savedFavorites.includes(id) ? savedFavorites.filter((favId: string) => favId !== id) : [...savedFavorites, id];

    setIsFavorite(!isFavorite);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Fetch CCTV data
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const detailResponse = await fetch(`/api/cctv/${id}`);
        if (!detailResponse.ok) return notFound();

        const detailData = await detailResponse.json();
        setCctv(detailData);

        const allCCTVs = await getCCTV();
        const relatedCCTVs = allCCTVs
          .filter((item: CCTV) => item.cctv_id !== id)
          .sort(() => Math.random() - 0.5)
          .slice(0, relatedLimit);

        setCctvList(relatedCCTVs);
      } catch (error) {
        console.error('Error fetching CCTV details:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, relatedLimit]);

  // Custom marker for map
  const customIcon = new Icon({
    iconUrl: '/pin.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cctv) return notFound();

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 -mt-8">
      {/* Main CCTV Section */}
      <div className="w-full md:flex-1 bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden transition hover:shadow-xl">
        {/* Video Player */}
        <div className="w-full bg-black rounded-t-2xl overflow-hidden">
          <video src={cctv.cctv_stream} controls className="w-full h-[40vh] md:h-[75vh]" autoPlay />
        </div>

        {/* Info Section */}
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 justify-center">
              {cctv.cctv_name}
              <Badge className="text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-full">{cctv.cctv_city}</Badge>
            </h3>
            <div className="text-right flex gap-5 justify-center items-center">
              <Link href={`https://www.google.com/maps?q=${cctv.cctv_lat},${cctv.cctv_lng}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition flex items-center gap-1">
                <Map size={18} />
                Open in Google Maps
              </Link>
              <button onClick={toggleFavorite} className={`p-2 rounded-full transition-transform ${isFavorite ? 'text-red-500 scale-110' : 'text-gray-400 hover:scale-105'}`}>
                {isFavorite ? '⭐️' : '☆'}
              </button>
            </div>
          </div>

          {/* Mini Map */}
          <div className="mt-4 w-full h-[20vh] md:h-[50vh] rounded-lg overflow-hidden">
            <MapContainer center={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&amp;copy Crafted by Sofyanegi" />

              <Marker position={[Number(cctv.cctv_lat), Number(cctv.cctv_lng)]} icon={customIcon}>
                <Popup>{cctv.cctv_name}</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Google Maps Link */}
        </div>
      </div>

      {/* Related CCTVs Section */}
      <div className="w-full md:w-[350px]">
        <h2 className="text-lg font-semibold mb-3">Related CCTVs</h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {cctvList.map((cctvItem) => (
            <CardCCTV key={cctvItem.cctv_id} {...cctvItem} autoplay={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
