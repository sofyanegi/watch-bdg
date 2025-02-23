/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteCCTV, getCCTV, updateCCTV } from '@/services/firebase';
import { CCTV } from '@/types';
import { cctvSchema } from '@/validation/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid CCTV ID. ID must be a string.' }, { status: 400 });
  }

  try {
    const data = await getCCTV(id);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Error fetching CCTV with ID ${id}: ${error?.message || error}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid CCTV ID. ID must be a string.' }, { status: 400 });
  }

  try {
    await deleteCCTV(id);
    return NextResponse.json({ message: `CCTV with ID ${id} deleted successfully.` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Error deleting CCTV with ID ${id}: ${error?.message || error}` }, { status: 500 });
  }
}

// PUT request handler
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const data: CCTV = await req.json();

  // Validate required fields
  const validationResult = cctvSchema.safeParse(data);

  if (!validationResult.success) {
    return NextResponse.json({ errors: validationResult.error.format() }, { status: 400 });
  }

  try {
    await updateCCTV(data, id);
    return NextResponse.json({ message: `CCTV with ID ${id} updated successfully.` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Error updating CCTV with ID ${id}: ${error?.message || error}` }, { status: 500 });
  }
}
