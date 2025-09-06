'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TaskCard = ({ task }:{task:any}) => {
  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="text-white font-medium text-sm">{task.title}</h3>
          <Badge 
            variant="secondary" 
            className={`text-xs ${
              task.priority === 'high' 
                ? 'bg-red-500/20 text-red-300' 
                : task.priority === 'medium'
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-green-500/20 text-green-300'
            }`}
          >
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag:any, index:any) => (
              <div 
                key={index}
                className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center"
              >
                <span className="text-purple-300 text-xs">🔮</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{task.project}</span>
          <span>{task.dueDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
