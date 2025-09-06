'use client';

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Select from '@radix-ui/react-select';

import { 
  FilterIcon, 
  SortAscIcon, 
  GridIcon, 
  ListIcon,
  ChevronDownIcon,
  PlusIcon
} from 'lucide-react';
import Link from 'next/link';
import TaskCard from '@/components/dashboard/TaskCard';

interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  tags?: string[];
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Optimize Website Curriculum',
    description: 'Improve the website curriculum structure and content for better user experience and learning outcomes.',
    project: 'UI Kits',
    assignee: 'King Fighters',
    dueDate: '2 days',
    priority: 'high',
    status: 'in-progress',
    tags: ['optimization', 'curriculum'],
    createdAt: '2025-09-04'
  },
  {
    id: '2',
    title: 'Design System Components',
    description: 'Create a comprehensive design system with reusable components for the platform.',
    project: 'Design System',
    assignee: 'Calm Salmon',
    dueDate: '5 days',
    priority: 'medium',
    status: 'todo',
    tags: ['design', 'components'],
    createdAt: '2025-09-03'
  },
  {
    id: '3',
    title: 'API Integration Testing',
    description: 'Test all API endpoints and ensure proper error handling and data validation.',
    project: 'Backend API',
    assignee: 'Swift Eagle',
    dueDate: '1 week',
    priority: 'high',
    status: 'completed',
    tags: ['api', 'testing'],
    createdAt: '2025-09-02'
  },
  {
    id: '4',
    title: 'Mobile App Optimization',
    description: 'Optimize mobile app performance and fix reported bugs from user feedback.',
    project: 'Mobile App',
    assignee: 'Great Reindeer',
    dueDate: '3 days',
    priority: 'medium',
    status: 'in-progress',
    tags: ['mobile', 'optimization'],
    createdAt: '2025-09-01'
  }
];

const MyTasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and search tasks
  useEffect(() => {
    let filtered = tasks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.project.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Sort tasks
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterStatus, filterPriority, sortBy]);

  const getTaskCounts = () => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  };

  const taskCounts = getTaskCounts();

  return (
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-white text-2xl font-bold mb-2">My Tasks</h1>
                    <p className="text-gray-400 text-sm">
                      {taskCounts.total} total tasks • {taskCounts.inProgress} in progress • {taskCounts.completed} completed
                    </p>
                  </div>
                </div>

                {/* Filters and Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap gap-3">
                    {/* Search */}
                    <div className="relative">
                      <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-4 w-64 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>

                    {/* Status Filter */}
                    <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
                      <Select.Trigger className="flex items-center space-x-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm min-w-[120px]">
                        <FilterIcon className="w-4 h-4" />
                        <Select.Value placeholder="Status" />
                        <ChevronDownIcon className="w-4 h-4" />
                      </Select.Trigger>
                      
                      <Select.Portal>
                        <Select.Content className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                          <Select.Viewport className="p-1">
                            <Select.Item value="all" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>All Status</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="todo" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>To Do</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="in-progress" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>In Progress</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="completed" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>Completed</Select.ItemText>
                            </Select.Item>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>

                    {/* Priority Filter */}
                    <Select.Root value={filterPriority} onValueChange={setFilterPriority}>
                      <Select.Trigger className="flex items-center space-x-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm min-w-[120px]">
                        <Select.Value placeholder="Priority" />
                        <ChevronDownIcon className="w-4 h-4" />
                      </Select.Trigger>
                      
                      <Select.Portal>
                        <Select.Content className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                          <Select.Viewport className="p-1">
                            <Select.Item value="all" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>All Priority</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="high" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>High</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="medium" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>Medium</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="low" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>Low</Select.ItemText>
                            </Select.Item>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center space-x-2">
                    <Select.Root value={sortBy} onValueChange={setSortBy}>
                      <Select.Trigger className="flex items-center space-x-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm">
                        <SortAscIcon className="w-4 h-4" />
                        <Select.Value />
                        <ChevronDownIcon className="w-4 h-4" />
                      </Select.Trigger>
                      
                      <Select.Portal>
                        <Select.Content className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                          <Select.Viewport className="p-1">
                            <Select.Item value="dueDate" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>Due Date</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="priority" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>Priority</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="title" className="px-3 py-2 text-white hover:bg-gray-700 rounded cursor-pointer">
                              <Select.ItemText>Title</Select.ItemText>
                            </Select.Item>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>

                    <div className="flex bg-gray-800 border border-gray-700 rounded-md p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        <GridIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        <ListIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks Grid/List */}
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>

              {/* Empty State */}
              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-gray-300 text-lg mb-2">No tasks found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? 'Try adjusting your search or filters' : 'Create your first task to get started'}
                  </p>
                  <Link href="/dashboard/tasks/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            </main>
  );
};

export default MyTasksPage;
