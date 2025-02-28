'use server';

import { saveUserAccessLog } from '@/services/firebase';
import { ClientInfo } from '@/types';

export async function logUserAccess(clientInfo: ClientInfo) {
  try {
    await saveUserAccessLog(clientInfo);
  } catch (error) {
    console.error('Failed to save user access log:', error);
  }
}
