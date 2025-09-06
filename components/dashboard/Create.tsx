'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import * as Select from '@radix-ui/react-select';
import * as Dialog from '@radix-ui/react-dialog';
import { CreateTaskData, Task } from '@/types/task';
import { 
  UploadIcon, 
  ChevronDownIcon, 
  XIcon,
  UserIcon,
  TagIcon,
  ImageIcon,
  FileTextIcon,
  CalendarDaysIcon,
  FolderIcon,
  AlertCircleIcon,
  CheckIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { TaskService } from '@/service/task.service';

interface TaskFormData {
  name: string;
  assignee: string;
  tags: string;
  deadline: string;
  description: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  image?: File | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface TaskFormPageProps {
  mode?: 'create' | 'edit';
  taskId?: string;
}

// Mock users data
const mockUsers: User[] = [
  { id: '1', name: 'Magnificent Hawk', email: 'hawk@example.com' },
  { id: '2', name: 'Elegant Mallar', email: 'mallar@example.com' },
  { id: '3', name: 'Swift Eagle', email: 'eagle@example.com' },
  { id: '4', name: 'Graceful Swan', email: 'swan@example.com' },
];

const TaskFormPage: React.FC<TaskFormPageProps> = ({ mode = 'create', taskId }) => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    assignee: '',
    tags: '',
    deadline: '',
    description: '',
    project: '',
    priority: 'medium',
    status: 'todo',
    image: null,
  });
  
  const [existingTask, setExistingTask] = useState<Task | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Determine if we're in edit mode
  const isEditMode = mode === 'edit' || (params?.id && params.id !== 'create');
  const currentTaskId = taskId || params?.id as string;

  // Load existing task data for edit mode
  useEffect(() => {
    if (isEditMode && currentTaskId) {
      loadTask();
    }
  }, [isEditMode, currentTaskId]);

  const loadTask = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const task = await TaskService.getTask(currentTaskId);
      setExistingTask(task);
      
      setFormData({
        name: task.name,
        assignee: task.assignee,
        tags: task.tags.join(', '),
        deadline: task.deadline,
        description: task.description,
        project: task.project,
        priority: task.priority,
        status: task.status,
        image: null,
      });
      
      setSelectedAssignee(mockUsers.find(user => user.name === task.assignee) || null);
      
      if (task.imageUrl) {
        setImagePreview(task.imageUrl);
      }
    } catch (error: any) {
      console.error('Failed to load task:', error);
      setError('Failed to load task data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
    setSuccess(''); // Clear success message
  };

  const handleAssigneeSelect = (userId: string) => {
    const selectedUser = mockUsers.find(u => u.id === userId);
    setSelectedAssignee(selectedUser || null);
    setFormData(prev => ({ ...prev, assignee: selectedUser?.name || '' }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Task name is required');
      return false;
    }

    if (!formData.assignee.trim()) {
      setError('Please select an assignee');
      return false;
    }

    if (!formData.project.trim()) {
      setError('Project name is required');
      return false;
    }

    if (!formData.deadline) {
      setError('Deadline is required');
      return false;
    }

    // Validate deadline is not in the past
    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate < today) {
      setError('Deadline cannot be in the past');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!user) {
      setError('You must be logged in to create tasks');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const taskData: CreateTaskData = {
        name: formData.name.trim(),
        assignee: formData.assignee.trim(),
        tags: formData.tags.trim(),
        deadline: formData.deadline,
        description: formData.description.trim(),
        project: formData.project.trim(),
        priority: formData.priority,
        status: formData.status,
        image: formData.image || undefined,
      };

      if (isEditMode && currentTaskId) {
        // Update existing task
        await TaskService.updateTask({
          ...taskData,
          id: currentTaskId,
          imageUrl: existingTask?.imageUrl || '',
        });
        setSuccess('Task updated successfully!');
      } else {
        // Create new task
        await TaskService.createTask(taskData, user.uid);
        setSuccess('Task created successfully!');
      }

      // Redirect after short delay to show success message
      setTimeout(() => {
        router.push('/dashboard/tasks');
      }, 1500);

    } catch (error: any) {
      console.error('Error saving task:', error);
      setError(error.message || 'Failed to save task. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setIsDiscardDialogOpen(true);
  };

  const confirmDiscard = () => {
    router.push('/dashboard/tasks');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading task data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h1>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleDiscard}
              disabled={isSaving}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Discard
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Task' : 'Create Task'
              )}
            </Button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-6 flex items-center">
            <AlertCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-md mb-6 flex items-center">
            <CheckIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <FileTextIcon className="w-4 h-4 mr-2" />
                Task Name *
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                placeholder="Enter task name"
                required
              />
            </div>

            {/* Project Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <FolderIcon className="w-4 h-4 mr-2" />
                Project *
              </Label>
              <Input
                value={formData.project}
                onChange={(e) => handleInputChange('project', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                placeholder="Enter project name"
                required
              />
            </div>

            {/* Assignee Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Assignee *
              </Label>
              
              <Select.Root 
                value={selectedAssignee?.id || ''} 
                onValueChange={handleAssigneeSelect}
              >
                <Select.Trigger className="flex items-center justify-between w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Select.Value placeholder="Select assignee">
                    {selectedAssignee ? (
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white mr-3">
                          {selectedAssignee.name.charAt(0)}
                        </div>
                        {selectedAssignee.name}
                      </div>
                    ) : (
                      <span className="text-gray-400">Select assignee</span>
                    )}
                  </Select.Value>
                  <Select.Icon>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content className="bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                    <Select.Viewport className="p-1">
                      {mockUsers.map((user) => (
                        <Select.Item
                          key={user.id}
                          value={user.id}
                          className="flex items-center p-3 text-white hover:bg-gray-600 rounded cursor-pointer focus:outline-none focus:bg-gray-600"
                        >
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white mr-3">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <Select.ItemText>{user.name}</Select.ItemText>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Priority and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority Field */}
              <div className="space-y-2">
                <Label className="text-white font-medium">Priority</Label>
                <Select.Root 
                  value={formData.priority} 
                  onValueChange={(value: 'high' | 'medium' | 'low') => handleInputChange('priority', value)}
                >
                  <Select.Trigger className="flex items-center justify-between w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content className="bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
                      <Select.Viewport className="p-1">
                        <Select.Item value="high" className="px-3 py-2 text-white hover:bg-gray-600 rounded cursor-pointer">
                          <Select.ItemText>High</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="medium" className="px-3 py-2 text-white hover:bg-gray-600 rounded cursor-pointer">
                          <Select.ItemText>Medium</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="low" className="px-3 py-2 text-white hover:bg-gray-600 rounded cursor-pointer">
                          <Select.ItemText>Low</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              {/* Status Field */}
              <div className="space-y-2">
                <Label className="text-white font-medium">Status</Label>
                <Select.Root 
                  value={formData.status} 
                  onValueChange={(value: 'todo' | 'in-progress' | 'completed') => handleInputChange('status', value)}
                >
                  <Select.Trigger className="flex items-center justify-between w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content className="bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
                      <Select.Viewport className="p-1">
                        <Select.Item value="todo" className="px-3 py-2 text-white hover:bg-gray-600 rounded cursor-pointer">
                          <Select.ItemText>To Do</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="in-progress" className="px-3 py-2 text-white hover:bg-gray-600 rounded cursor-pointer">
                          <Select.ItemText>In Progress</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="completed" className="px-3 py-2 text-white hover:bg-gray-600 rounded cursor-pointer">
                          <Select.ItemText>Completed</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <TagIcon className="w-4 h-4 mr-2" />
                Tags
              </Label>
              <Input
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                placeholder="Enter tags separated by commas"
              />
              <p className="text-xs text-gray-400">Separate multiple tags with commas</p>
            </div>

            {/* Deadline Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-2" />
                Deadline *
              </Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                required
              />
            </div>

            {/* Image Upload Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Image
              </Label>
              
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <UploadIcon className="w-4 h-4 mr-2" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
                
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded border border-gray-600"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-700"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400">Maximum file size: 10MB. Supported formats: JPG, PNG, GIF</p>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <FileTextIcon className="w-4 h-4 mr-2" />
                Description
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-32 resize-none focus:border-blue-500"
                placeholder="Enter task description"
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Discard Confirmation Dialog */}
        <Dialog.Root open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-md z-50">
              <Dialog.Title className="text-white text-lg font-semibold mb-4">
                Discard Changes?
              </Dialog.Title>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to discard your changes? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <Dialog.Close asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button 
                  onClick={confirmDiscard}
                  variant="destructive"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Discard
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default TaskFormPage;
export type { TaskFormPageProps, TaskFormData };
