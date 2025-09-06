'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import * as Select from '@radix-ui/react-select';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  CalendarIcon, 
  UploadIcon, 
  ChevronDownIcon, 
  XIcon,
  UserIcon,
  TagIcon,
  ImageIcon,
  FileTextIcon,
  CalendarDaysIcon
} from 'lucide-react';

interface TaskFormData {
  name: string;
  assignee: string;
  tags: string;
  deadline: string;
  image?: File | null;
  description: string;
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
  
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    assignee: '',
    tags: '',
    deadline: '',
    image: null,
    description: '',
  });
  
  const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Determine if we're in edit mode
  const isEditMode = mode === 'edit' || (params?.id && params.id !== 'create');
  const currentTaskId = taskId || params?.id;

  // Load existing task data for edit mode
  useEffect(() => {
    if (isEditMode && currentTaskId) {
      // Mock loading existing task data
      const mockTaskData = {
        name: 'Plugin UI Components',
        assignee: '1', // Magnificent Hawk's ID
        tags: 'ui, components, plugin',
        deadline: '2025-09-10',
        description: 'Create modern UI components for the new plugin system with accessibility features and responsive design.',
      };
      
      setFormData(mockTaskData);
      setSelectedAssignee(mockUsers.find(user => user.id === mockTaskData.assignee) || null);
    }
  }, [isEditMode, currentTaskId]);

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAssigneeSelect = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    setSelectedAssignee(user || null);
    setFormData(prev => ({ ...prev, assignee: userId }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Validate form
      if (!formData.name.trim()) {
        alert('Task name is required');
        return;
      }

      // Mock API call
      console.log('Saving task:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Navigate back to tasks list
      router.push('/dashboard/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task. Please try again.');
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
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Discard
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <FileTextIcon className="w-4 h-4 mr-2" />
                Name
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="Enter task name"
                required
              />
            </div>

            {/* Assignee Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Assignee
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

            {/* Tags Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <TagIcon className="w-4 h-4 mr-2" />
                Tags
              </Label>
              <Input
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="Enter tags separated by commas"
              />
              <p className="text-xs text-gray-400">Separate multiple tags with commas</p>
            </div>

            {/* Deadline Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-2" />
                Deadline
              </Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
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
                  Upload Image
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
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <FileTextIcon className="w-4 h-4 mr-2" />
                Description
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e:any) => handleInputChange('description', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-32 resize-none"
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
