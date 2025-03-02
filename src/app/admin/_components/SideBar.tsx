'use client';

import { Home, FileText, Video } from 'lucide-react';
import { SidebarItem } from './SideBarItem';

const sidebarItems = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'CCTV Management', href: '/admin/cctv', icon: Video },
  { name: 'Log Users', href: '/admin/log', icon: FileText },
];

export const Sidebar: React.FC = () => {
  return (
    <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <SidebarItem href={item.href} icon={<item.icon size={20} />} label={item.name} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
