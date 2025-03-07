'use client';

import { useEffect, useState, useCallback } from 'react';
import { LogEntry } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { del, get } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import LoadingVideo from '@/components/common/LoadingVideo';

export default function LogPages() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await get<LogEntry[]>('/api/log');
      setLogs(res);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const onDeleteAllLogs = useCallback(async () => {
    try {
      setDeleting(true);
      await del('/api/cctv/log');
      setLogs([]);
    } catch (error) {
      console.error('Error deleting logs:', error);
    } finally {
      setDeleting(false);
    }
  }, []);

  return (
    <div className="p-5">
      {loading ? (
        <LoadingVideo />
      ) : logs.length > 0 ? (
        <>
          <h1 className="text-2xl font-semibold mb-5 text-center">User Logs</h1>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="my-2">
                Delete All Logs
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete all user logs from our servers.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteAllLogs} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Continue'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DataTable columns={columns} data={logs} />
        </>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-5">No logs found</h1>
          <Button onClick={fetchLogs}>Refresh</Button>
        </div>
      )}
    </div>
  );
}
