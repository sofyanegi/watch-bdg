/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCCTVs, storeCCTV } from '@/services/firebase';
import { CCTV } from '@/types';
import { cctvSchema } from '@/validation/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  const cctvs = await getCCTVs();

  if (!page || !limit || !search) {
    return NextResponse.json(cctvs);
  }

  const filteredCCTVs = search ? cctvs.filter((cctv) => cctv.cctv_name.toLowerCase().includes(search.toLowerCase())) : cctvs;

  const totalRecords = filteredCCTVs.length;
  const totalPages = Math.ceil(totalRecords / limit);
  const offset = (page - 1) * limit;

  const paginatedData = filteredCCTVs.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedData,
    pagination: {
      total_records: totalRecords,
      current_page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const cctv: CCTV = await request.json();
    const validationResult = cctvSchema.safeParse(cctv);

    if (!validationResult.success) {
      return NextResponse.json({ errors: validationResult.error.format() }, { status: 400 });
    }

    const storedCCTV = await storeCCTV(cctv);
    return NextResponse.json(storedCCTV);
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to store CCTV: ${error}` }, { status: 500 });
  }
}
