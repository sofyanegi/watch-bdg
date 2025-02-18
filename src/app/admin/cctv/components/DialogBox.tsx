'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CCTVInterface } from '@/types';

interface DialogBoxProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCCTV: React.Dispatch<React.SetStateAction<CCTVInterface | null>>;
  selectedCCTV: CCTVInterface | null;
  handleSaveCCTV: (newCCTV: CCTVInterface) => void;
  isLoading: boolean; // Loading state
}

export const DialogBox: React.FC<DialogBoxProps> = ({ dialogOpen, setDialogOpen, setSelectedCCTV, selectedCCTV, handleSaveCCTV, isLoading }) => {
  const initialCCTV: CCTVInterface = {
    cctv_id: '',
    cctv_name: '',
    cctv_stream: '',
    cctv_city: '',
    cctv_lat: '',
    cctv_lng: '',
  };

  const cctv = selectedCCTV || initialCCTV;

  const handleChange = (field: keyof CCTVInterface) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCCTV({ ...cctv, [field]: e.target.value });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cctv.cctv_id ? 'Edit CCTV' : 'Add CCTV'}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="CCTV Name"
          value={cctv.cctv_name}
          onChange={handleChange('cctv_name')}
          disabled={isLoading} // Disable input fields while loading
        />
        <Input placeholder="Stream URL" value={cctv.cctv_stream} onChange={handleChange('cctv_stream')} disabled={isLoading} />
        <Input placeholder="CCTV City" value={cctv.cctv_city} onChange={handleChange('cctv_city')} disabled={isLoading} />
        <Input placeholder="CCTV Latitude" value={cctv.cctv_lat} onChange={handleChange('cctv_lat')} disabled={isLoading} />
        <Input placeholder="CCTV Longitude" value={cctv.cctv_lng} onChange={handleChange('cctv_lng')} disabled={isLoading} />

        <DialogFooter>
          <Button onClick={() => handleSaveCCTV(cctv)} disabled={isLoading}>
            {isLoading ? <div className="w-6 h-6 border-4 border-t-4 border-t-transparent border-gray-500 border-solid rounded-full animate-spin"></div> : cctv.cctv_id ? 'Save Changes' : 'Add CCTV'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
