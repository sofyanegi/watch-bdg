import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

export default function MapButton() {
  return (
    <Link href="/maps">
      <Button variant="ghost" size="icon">
        <Map size={24} />
      </Button>
    </Link>
  );
}
