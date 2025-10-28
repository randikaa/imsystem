'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Tag,
  Package,
  ShoppingBag,
  RefreshCw,
  Archive,
  Box,
  UserCircle,
  ShoppingCart,
  CreditCard,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Users', icon: Users, href: '/users' },
  { label: 'Suppliers', icon: UserPlus, href: '/suppliers' },
  { label: 'Products', icon: Package, href: '/products' },
  { label: 'TOG', icon: RefreshCw, href: '/tog' },
  { label: 'Inventory', icon: Archive, href: '/inventory' },
  { label: 'BOM', icon: Box, href: '/bom' },
  { label: 'Customers', icon: UserCircle, href: '/customers' },
  { label: 'Sales', icon: ShoppingCart, href: '/sales' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col bg-[#2D1B4E] text-white transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <Button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-6 z-50 h-8 w-8 rounded-full bg-[#2D1B4E] p-0 hover:bg-[#3D2B5E]"
        size="icon"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 px-3 py-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors',
                isActive
                  ? 'bg-white text-[#2D1B4E] font-medium'
                  : 'text-white hover:bg-[#3D2B5E]',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', collapsed && 'h-6 w-6')} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
