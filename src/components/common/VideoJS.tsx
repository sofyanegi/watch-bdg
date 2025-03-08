import { FC, useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  hlsSrc: string;
}

export const VideoJs: FC<VideoPlayerProps> = ({ hlsSrc }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.5 });

    observerRef.current.observe(videoRef.current);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !isVisible) return;

    if (playerRef.current) return;

    const originalLogError = videojs.log.error;
    videojs.log.error = () => {};

    videoRef.current.innerHTML = '';

    const videoElement = document.createElement('video-js');
    videoElement.classList.add('vjs-big-play-centered');
    videoRef.current.appendChild(videoElement);

    const player = videojs(videoElement, {
      autoplay: 'play',
      muted: true,
      playsinline: true,
      controls: true,
      fluid: true,
      liveui: true,
      html5: {
        vhs: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          experimentalBufferBasedABR: true,
          bufferWatermark: { low: 5, high: 10 },
        },
      },
      sources: [{ src: hlsSrc, type: hlsSrc.endsWith('.mp4') ? 'video/mp4' : 'application/x-mpegURL' }],
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      videojs.log.error = originalLogError;
    };
  }, [hlsSrc, isVisible]);

  return <div ref={videoRef} className="aspect-video bg-black" />;
};
