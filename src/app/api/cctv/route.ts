import { getCCTVCollection } from '@/app/services/firebase';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await getCCTVCollection();
  return NextResponse.json(data);
}
