/* eslint-disable @typescript-eslint/no-explicit-any */

import { ClientInfo } from '@/types';

export const fetchClientInfo = async (): Promise<ClientInfo> => {
  const data: ClientInfo = {
    browser: 'Unknown',
    browserVersion: 'Unknown',
    userAgent: navigator.userAgent,
    deviceType: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    supportsHLS: !!document.createElement('video').canPlayType('application/vnd.apple.mpegURL'),
  };

  // Detect Browser & Version
  const match = navigator.userAgent.match(/(firefox|msie|trident|chrome|safari|edge|opr|brave)\/?\s*(\d+)/i);
  if (match) {
    data.browser = match[1].charAt(0).toUpperCase() + match[1].slice(1);
    data.browserVersion = match[2];
  }

  // Fetch IP & Location Data
  try {
    const res = await fetch('https://ipinfo.io/json?token=f1b8493e2d524f');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const ipData = await res.json();
    Object.assign(data, {
      ip: ipData.ip,
      city: ipData.city,
      region: ipData.region,
      country: ipData.country,
      timezone: ipData.timezone,
      isp: ipData.org,
    });
  } catch (error) {
    console.error('Failed to fetch IP data:', error);
  }

  // Get Battery Info (if supported)
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      data.batteryLevel = Math.round(battery.level * 100);
      data.isCharging = battery.charging;
    }
  } catch (error) {
    console.error('Battery API not supported:', error);
  }

  // Get GPU Details (if WebGL is available)
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      data.gpu = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'WebGL Supported';
    }
  } catch (error) {
    data.gpu = 'WebGL Unavailable';
    console.error('WebGL error:', error);
  }

  return data;
};
