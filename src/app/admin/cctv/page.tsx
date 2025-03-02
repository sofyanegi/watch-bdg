'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CCTV } from '@/types';
import { Button } from '@/components/ui/button';
import { DialogBox } from './_components/DialogBox';
import { AlertBox } from './_components/AlertBox';
import { get, post, del, put } from '@/lib/axios';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { useToast } from '@/hooks/use-toast';

const CCTVManagement: React.FC = () => {
  const [cctvs, setCCTVs] = useState<CCTV[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedCCTV, setSelectedCCTV] = useState<CCTV | null>(null);
  const { toast } = useToast();

  const fetchCCTVs = useCallback(async () => {
    setLoading(true);
    try {
      const response: CCTV[] = await get('/api/cctv');
      setCCTVs(response);
    } catch (error) {
      console.error('Failed to fetch CCTVs:', error);
      setCCTVs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCCTVs();
  }, [fetchCCTVs]);

  const handleSaveCCTV = async (newCCTV: CCTV) => {
    setLoading(true);
    try {
      const endpoint = newCCTV.cctv_id ? `/api/cctv/${newCCTV.cctv_id}` : '/api/cctv';
      const method = newCCTV.cctv_id ? put : post;

      await method(endpoint, JSON.stringify(newCCTV));
      toast({ title: 'Success', description: 'CCTV saved successfully!' });
      fetchCCTVs();
    } catch (error) {
      console.error('Failed to save CCTV:', error);
      toast({ title: 'Error', description: 'An error occurred while saving CCTV.', variant: 'destructive' });
    } finally {
      setLoading(false);
      setDialogOpen(false);
      setSelectedCCTV(null);
    }
  };

  // Handle delete CCTV
  const handleDeleteCCTV = async () => {
    setLoading(true);
    try {
      if (selectedCCTV?.cctv_id) {
        await del(`/api/cctv/${selectedCCTV.cctv_id}`);
        toast({ title: 'Success', description: 'CCTV deleted successfully!' });
        fetchCCTVs();
      }
    } catch (error) {
      console.error('Failed to delete CCTV:', error);
      toast({ title: 'Error', description: 'An error occurred while deleting CCTV.', variant: 'destructive' });
    } finally {
      setLoading(false);
      setAlertOpen(false);
      setSelectedCCTV(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-5 overflow-y-auto">
      <Button
        variant="outline"
        className="mb-5 dark:bg-gray-800"
        onClick={() => {
          setDialogOpen(true);
          setSelectedCCTV(null);
        }}
      >
        Add CCTV
      </Button>

      <DataTable columns={columns({ setDialogOpen, setAlertOpen, setSelectedCCTV })} data={cctvs} searchable />

      <DialogBox dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} setSelectedCCTV={setSelectedCCTV} selectedCCTV={selectedCCTV} handleSaveCCTV={handleSaveCCTV} isLoading={loading} />

      <AlertBox alertOpen={alertOpen} setAlertOpen={setAlertOpen} handleDeleteCCTV={handleDeleteCCTV} isLoading={loading} />
    </div>
  );
};

export default CCTVManagement;
