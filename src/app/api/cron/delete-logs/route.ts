import { NextResponse } from 'next/server';
import { deleteFilteredDocuments } from '@/services/firebase';

export async function GET() {
  try {
    await deleteFilteredDocuments('logs', [{ field: 'ttl', op: '<', value: new Date() }]);
    return NextResponse.json({ message: 'Expired logs deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting documents', error }, { status: 500 });
  }
}
