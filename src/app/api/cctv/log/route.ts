import { getUserAccessLogs } from '@/services/firebase';
import { NextResponse } from 'next/server';

export async function GET() {
  const logs = await getUserAccessLogs();
  return NextResponse.json(logs);
}
