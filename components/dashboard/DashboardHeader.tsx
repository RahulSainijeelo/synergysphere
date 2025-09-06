'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import * as Dialog from '@radix-ui/react-dialog';
import { SearchIcon, PlusIcon, XIcon } from 'lucide-react';
import Breadcrumbs from './Breadcrumb';
import Link from 'next/link';

interface DashboardHeaderProps {
  className?: string;
  showBreadcrumbs?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  className = '', 
  showBreadcrumbs = true 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle form submission logic here
    console.log('Creating task:', { taskTitle, taskDescription });
    
    // Reset form and close dialog
    setTaskTitle('');
    setTaskDescription('');
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setTaskTitle('');
    setTaskDescription('');
    setIsDialogOpen(false);
  };

  return (
    <header className={`bg-gray-900 border-b border-gray-800 ${className}`}>
      {/* Main header row */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-gray-400 hover:text-white" />
            
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search..." 
                className="pl-10 w-80 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>
          </div>

           <Link href="/dashboard/tasks/new">
           <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusIcon className="w-4 h-4 mr-2" />
                New Task
              </Button>
           </Link>
        </div>
      </div>

      {/* Breadcrumbs row - positioned below header items */}
      {showBreadcrumbs && (
        <div className="px-4 pb-4 border-t border-gray-800/50">
          <Breadcrumbs 
            showHomeIcon={true}
            className="mb-0"
          />
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
export type { DashboardHeaderProps };
