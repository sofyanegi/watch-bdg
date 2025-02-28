import { getLogsApiCCTV } from '@/services/firebase';
import { NextResponse } from 'next/server';

export async function GET() {
  const logs = await getLogsApiCCTV();
  return NextResponse.json(logs);
}
