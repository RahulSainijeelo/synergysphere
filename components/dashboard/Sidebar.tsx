'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { 
  FolderIcon, 
  CheckSquareIcon, 
  SettingsIcon, 
  MoonIcon,
  LogOutIcon,
  ChevronUpIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  {
    title: 'Projects',
    icon: FolderIcon,
    url: '/dashboard/',
    isActive: true,
  },
  {
    title: 'My Tasks',
    icon: CheckSquareIcon,
    url: '/dashboard/tasks',
    isActive: false,
  },
];

const AppSidebar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar className="bg-gray-950 border-gray-800">
      <SidebarHeader className="border-b border-gray-800 p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">SynergyWork</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      item.isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-800">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gray-600 text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium">User</p>
                <p className="text-gray-400 text-xs">{user?.email}</p>
              </div>
              <ChevronUpIcon className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-1 min-w-[200px]"
              sideOffset={5}
            >
              <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded cursor-pointer">
                <SettingsIcon className="w-4 h-4" />
                <span>Settings</span>
              </DropdownMenu.Item>
              
              <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded cursor-pointer">
                <MoonIcon className="w-4 h-4" />
                <span>Dark Mode</span>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-gray-700 my-1" />
              
              <DropdownMenu.Item 
                className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded cursor-pointer"
                onClick={handleLogout}
              >
                <LogOutIcon className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
