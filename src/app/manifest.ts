import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Watch BDG',
    short_name: 'Watch BDG',
    description: 'Bandung Watch provides real-time CCTV information and traffic updates in Bandung.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/globe.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/globe.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Open Map',
        short_name: 'Map',
        description: 'Quick access to the CCTV map view',
        url: '/maps',
        icons: [{ src: '/globe.svg', sizes: '192x192', type: 'image/svg+xml' }],
      },
    ],
    prefer_related_applications: false,
  };
}
