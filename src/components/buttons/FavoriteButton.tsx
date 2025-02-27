import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export default function FavoriteButton() {
  return (
    <Link href="/favorites">
      <Button variant="link" size="icon">
        <Star size={24} />
      </Button>
    </Link>
  );
}
