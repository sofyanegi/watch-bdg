import { deleteFilteredDocuments, getUserAccessLogs } from '@/services/firebase';
import { NextResponse } from 'next/server';

export async function GET() {
  const logs = await getUserAccessLogs();
  return NextResponse.json(logs);
}

export async function DELETE() {
  try {
    await deleteFilteredDocuments('logs_user_access', [{ field: 'ttl', op: '<', value: new Date() }]);
    return NextResponse.json({ message: 'Documents deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting documents', error }, { status: 500 });
  }
}
