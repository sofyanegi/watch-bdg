import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

export const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={cn('flex items-center p-2 rounded-lg group', 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700', isActive ? 'bg-gray-200 dark:bg-gray-700' : '')}>
      <span className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">{icon}</span>
      <span className="ms-3">{label}</span>
    </Link>
  );
};
