'use client';

import React from 'react';
import TaskCard from './TaskCard';


const mockTasks = [
  {
    id: 1,
    title: 'Plugin UI and',
    description: 'Create modern UI components for the new plugin system with accessibility features',
    priority: 'high',
    project: 'UI Components',
    dueDate: '2 days',
    tags: ['ui', 'plugin']
  },
  {
    id: 2,
    title: 'API Integration',
    description: 'Integrate third-party APIs for data synchronization',
    priority: 'medium',
    project: 'Backend',
    dueDate: '5 days',
    tags: ['api']
  },
  {
    id: 3,
    title: 'Database Migration',
    description: 'Migrate legacy database to new schema',
    priority: 'low',
    project: 'Infrastructure',
    dueDate: '1 week',
    tags: ['database']
  }
];

const DashboardContent = () => {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-2xl font-bold">My Tasks</h1>
          <span className="text-gray-400 text-sm">{mockTasks.length} tasks</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Empty State */}
      {mockTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-gray-300 text-lg mb-2">No tasks yet</h3>
          <p className="text-gray-500">Create your first task to get started</p>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
