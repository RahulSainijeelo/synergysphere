'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import * as Dialog from '@radix-ui/react-dialog';
import { SearchIcon, PlusIcon, XIcon } from 'lucide-react';
import Breadcrumbs from './Breadcrumb';

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

          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusIcon className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-md z-50">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-white text-lg font-semibold">
                    Create New Task
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button 
                      className="text-gray-400 hover:text-white"
                      onClick={handleCancel}
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Task Title
                    </label>
                    <Input 
                      placeholder="Enter task title"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea 
                      placeholder="Enter task description"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Create Task
                    </Button>
                    <Dialog.Close asChild>
                      <Button 
                        type="button"
                        variant="outline" 
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Dialog.Close>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
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
