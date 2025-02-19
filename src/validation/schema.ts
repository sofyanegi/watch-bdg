import { z } from 'zod';

export const cctvSchema = z.object({
  cctv_name: z.string().min(1, 'CCTV Name is required'),
  cctv_city: z.string().min(1, 'City is required'),
  cctv_stream: z.string().min(1, 'Stream URL is required').url('Invalid URL format'),
  cctv_lat: z.string().regex(/^[-+]?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/, 'Invalid latitude format'),
  cctv_lng: z.string().regex(/^[-+]?((1[0-7][0-9]|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/, 'Invalid longitude format'),
});
