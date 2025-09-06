'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  CalendarIcon, 
  UserIcon, 
  FolderIcon,
  MoreVerticalIcon 
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    project: string;
    assignee: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    status: 'todo' | 'in-progress' | 'completed';
    tags?: string[];
    color?: string;
  };
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'in-progress': return 'bg-blue-500/20 text-blue-300';
      case 'todo': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <FolderIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-xs font-medium">
                Project: {task.project}
              </span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-blue-300 transition-colors">
              {task.title}
            </h3>
            <p className="text-gray-400 text-xs line-clamp-2 mb-3">
              {task.description}
            </p>
          </div>
          
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700 rounded">
                <MoreVerticalIcon className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-gray-700 border border-gray-600 rounded-lg shadow-lg p-1 min-w-[120px] z-50">
                <DropdownMenu.Item asChild>
                  <Link 
                    href={`/dashboard/tasks/${task.id}/edit`}
                    className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-white rounded cursor-pointer text-sm"
                  >
                    Edit Task
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center px-3 py-2 text-red-400 hover:bg-gray-600 hover:text-red-300 rounded cursor-pointer text-sm">
                  Delete Task
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Task Image/Visual Area */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 mb-4 relative">
          <div className="grid grid-cols-3 gap-2 opacity-60">
            <div className="w-full h-8 bg-purple-400/40 rounded"></div>
            <div className="w-full h-8 bg-pink-400/40 rounded"></div>
            <div className="w-full h-8 bg-purple-300/40 rounded"></div>
          </div>
          
          {/* Status Badge */}
          <Badge 
            className={`absolute bottom-2 right-2 text-xs px-2 py-1 ${getStatusColor(task.status)}`}
          >
            {task.assignee}
          </Badge>
        </div>
        
        {/* Task Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-3 h-3" />
              <span>{task.dueDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <UserIcon className="w-3 h-3" />
              <span>Due</span>
            </div>
          </div>
          
          <Badge 
            className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}
            variant="outline"
          >
            {task.priority}
          </Badge>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
