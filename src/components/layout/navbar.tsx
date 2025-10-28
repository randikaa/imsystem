'use client';

import { useState, useEffect } from 'react';
import { Maximize2, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-16 items-center justify-end gap-4 border-b bg-white px-6">
      {/* Fullscreen Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className="text-gray-600 hover:text-gray-900"
      >
        <Maximize2 className="h-5 w-5" />
      </Button>

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-gray-600 hover:text-gray-900"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2D1B4E] text-[10px] font-semibold text-white">
          3
        </span>
      </Button>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900">{user?.name || 'User'}</span>
              <span className="text-xs text-gray-500">{user?.role || 'User'}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Notifications</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
