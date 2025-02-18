/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteCCTV, updateCCTV } from '@/services/firebase';
import { CCTVInterface } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

// Utility to handle missing fields validation
const validateCCTVFields = (data: CCTVInterface) => {
  if (!data.cctv_name || !data.cctv_stream || !data.cctv_city) {
    return { error: 'CCTV name, stream URL, and city are required.' };
  }
  return null;
};

// DELETE request handler
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
  const data: CCTVInterface = await req.json();

  // Validate required fields
  const validationError = validateCCTVFields(data);
  if (validationError) {
    return NextResponse.json(validationError, { status: 400 });
  }

  try {
    await updateCCTV(data, id);
    return NextResponse.json({ message: `CCTV with ID ${id} updated successfully.` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Error updating CCTV with ID ${id}: ${error?.message || error}` }, { status: 500 });
  }
}
