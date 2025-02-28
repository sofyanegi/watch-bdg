import { Timestamp } from 'firebase/firestore';

export type CCTV = {
  distance?: number;
  cctv_id?: string;
  cctv_name: string;
  cctv_stream: string;
  cctv_lat?: string;
  cctv_lng?: string;
  cctv_city?: string;
};

export interface ClientInfo {
  browser: string;
  browserVersion: string;
  userAgent: string;
  deviceType: 'Mobile' | 'Desktop';
  supportsHLS: boolean;
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  isp?: string;
  batteryLevel?: number;
  isCharging?: boolean;
  gpu?: string;
}

export interface LogEntry extends ClientInfo {
  id?: string;
  timestamp?: Timestamp;
  ttl: Timestamp;
}

export interface IPData {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  isp?: string;
}
