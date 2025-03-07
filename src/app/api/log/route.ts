import { deleteAllDocuments, getUserAccessLogs } from '@/services/firebase';
import { NextResponse } from 'next/server';

export async function GET() {
  const logs = await getUserAccessLogs();
  return NextResponse.json(logs);
}

export async function DELETE() {
  try {
    await deleteAllDocuments('logs_user_access');
    return NextResponse.json({ message: 'Documents deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting documents', error }, { status: 500 });
  }
}
