'use client';

import { useState } from 'react';
import { Copy, MessageSquare, Send, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied to clipboard',
      description: 'You can now share the link with your friends.',
      duration: 3000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
  const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy size={16} className="mr-2" /> {copied ? 'Copied!' : 'Copy Link'}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={whatsappLink} target="_blank">
            <MessageSquare size={16} className="mr-2 text-green-500" /> Share via WhatsApp
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={telegramLink} target="_blank">
            <Send size={16} className="mr-2 text-blue-500" /> Share via Telegram
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
