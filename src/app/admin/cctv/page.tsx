'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CCTV } from '@/types';
import { Button } from '@/components/ui/button';
import { DialogBox } from './components/DialogBox';
import { AlertBox } from './components/AlertBox';
import { get, post, del, put } from '@/services/axios';
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
      const response: CCTV[] = await get(`/api/cctv`);
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
      let response;

      if (!newCCTV.cctv_id || newCCTV.cctv_id === '') {
        response = await post('/api/cctv', JSON.stringify(newCCTV));
      } else {
        response = await put(`/api/cctv/${newCCTV.cctv_id}`, JSON.stringify(newCCTV));
      }

      if (response) {
        toast({
          title: 'Success',
          description: 'CCTV saved successfully!',
        });
        fetchCCTVs();
      } else {
        toast({
          title: 'Failed to save',
          description: 'Failed to save CCTV. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to save CCTV:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving CCTV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setDialogOpen(false);
      setSelectedCCTV(null);
    }
  };

  const handleDeleteCCTV = async () => {
    setLoading(true);
    try {
      const response = await del(`/api/cctv/${selectedCCTV?.cctv_id}`);
      if (response) {
        toast({
          title: 'Success',
          description: 'CCTV deleted successfully!',
        });
        fetchCCTVs();
      } else {
        toast({
          title: 'Failed to delete',
          description: 'Failed to delete CCTV. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to delete CCTV:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while delete CCTV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setAlertOpen(false);
      setSelectedCCTV(null);
    }
  };

  return (
    <div className="p-5">
      <Button
        onClick={() => {
          setDialogOpen(true);
          setSelectedCCTV(null);
        }}
        className="mb-5"
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
