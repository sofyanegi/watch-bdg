'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CCTV } from '@/types';

import { cctvSchema } from '@/validation/schema';

interface DialogBoxProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCCTV: React.Dispatch<React.SetStateAction<CCTV | null>>;
  selectedCCTV: CCTV | null;
  handleSaveCCTV: (newCCTV: CCTV) => Promise<void>;
  isLoading: boolean;
}

export const DialogBox: React.FC<DialogBoxProps> = ({ dialogOpen, setDialogOpen, setSelectedCCTV, selectedCCTV, handleSaveCCTV, isLoading }) => {
  const initialCCTV: CCTV = {
    cctv_id: '',
    cctv_name: '',
    cctv_stream: '',
    cctv_city: '',
    cctv_lat: '',
    cctv_lng: '',
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const cctv = selectedCCTV || initialCCTV;

  const handleChange = (field: keyof CCTV) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCCTV({ ...cctv, [field]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' })); // Clear error on change
  };

  const handleSubmit = async () => {
    const result = cctvSchema.safeParse(cctv);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: { [key: string]: string } = {};
      for (const key in fieldErrors) {
        if (fieldErrors[key as keyof typeof fieldErrors]) {
          newErrors[key] = fieldErrors[key as keyof typeof fieldErrors]?.[0] || '';
        }
      }
      setErrors(newErrors);
      return;
    }

    try {
      await handleSaveCCTV(cctv);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving CCTV:', error);
      setErrors({ general: 'Failed to save CCTV. Please try again.' });
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setErrors({}); // Clear validation errors when dialog closes
    }
  };

  const isSubmitDisabled = isLoading;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cctv.cctv_id ? 'Edit CCTV' : 'Add CCTV'}</DialogTitle>
        </DialogHeader>

        <Input placeholder="CCTV Name" value={cctv.cctv_name} onChange={handleChange('cctv_name')} disabled={isLoading} />
        {errors.cctv_name && <p className="text-red-500 text-sm">{errors.cctv_name}</p>}

        <Input placeholder="Stream URL" value={cctv.cctv_stream} onChange={handleChange('cctv_stream')} disabled={isLoading} />
        {errors.cctv_stream && <p className="text-red-500 text-sm">{errors.cctv_stream}</p>}

        <Input placeholder="CCTV City" value={cctv.cctv_city} onChange={handleChange('cctv_city')} disabled={isLoading} />
        {errors.cctv_city && <p className="text-red-500 text-sm">{errors.cctv_city}</p>}

        <Input placeholder="CCTV Latitude" value={cctv.cctv_lat} onChange={handleChange('cctv_lat')} disabled={isLoading} />
        {errors.cctv_lat && <p className="text-red-500 text-sm">{errors.cctv_lat}</p>}

        <Input placeholder="CCTV Longitude" value={cctv.cctv_lng} onChange={handleChange('cctv_lng')} disabled={isLoading} />
        {errors.cctv_lng && <p className="text-red-500 text-sm">{errors.cctv_lng}</p>}

        {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            {isLoading ? <div className="w-6 h-6 border-4 border-t-4 border-t-transparent border-gray-500 border-solid rounded-full animate-spin"></div> : cctv.cctv_id ? 'Save Changes' : 'Add CCTV'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
