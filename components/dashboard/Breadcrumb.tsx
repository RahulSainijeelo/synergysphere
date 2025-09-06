'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';

interface RouteConfig {
  label: string;
  isHome?: boolean;
}

interface BreadcrumbItem {
  href: string;
  label: string;
  isCurrentPage: boolean;
  isHome: boolean;
}

interface EnhancedBreadcrumbsProps {
  homeRoute?: string;
  homeLabel?: string;
  showHomeIcon?: boolean;
  className?: string;
}

// Updated route map to include dashboard paths
const routeMap: Record<string, RouteConfig> = {
  '/dashboard': { label: 'Projects', isHome: true },
  '/dashboard/': { label: 'Projects', isHome: true },
  '/dashboard/project': { label: 'Projects', isHome: true },
  '/dashboard/projects': { label: 'Projects', isHome: true },
  '/dashboard/tasks': { label: 'My Tasks' },
  '/dashboard/team': { label: 'Team' },
  '/dashboard/settings': { label: 'Settings' },
  '/dashboard/profile': { label: 'Profile' },
  '/dashboard/analytics': { label: 'Analytics' },
} as const;

const EnhancedBreadcrumbs: React.FC<EnhancedBreadcrumbsProps> = ({ 
  homeRoute = '/dashboard/project',
  homeLabel = 'Projects',
  showHomeIcon = true,
  className = '' 
}) => {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Handle exact matches first
    if (routeMap[pathname]) {
      return [
        {
          href: pathname,
          label: routeMap[pathname].label,
          isCurrentPage: true,
          isHome: routeMap[pathname].isHome || false,
        }
      ];
    }

    const pathSegments: string[] = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    pathSegments.forEach((segment: string, index: number) => {
      currentPath += `/${segment}`;
      const isLast: boolean = index === pathSegments.length - 1;
      
      // Always include dashboard in the breadcrumb display
      if (segment === 'dashboard') {
        breadcrumbs.push({
          href: currentPath,
          label: 'dashboard',
          isCurrentPage: isLast,
          isHome: false,
        });
        return;
      }

      // Handle mapped routes
      if (routeMap[currentPath]) {
        breadcrumbs.push({
          href: currentPath,
          label: routeMap[currentPath].label,
          isCurrentPage: isLast,
          isHome: routeMap[currentPath].isHome || false,
        });
      } else {
        // Generate label for unmapped routes
        const label: string = formatSegmentLabel(segment, index, pathSegments);
        breadcrumbs.push({
          href: currentPath,
          label,
          isCurrentPage: isLast,
          isHome: false,
        });
      }
    });

    return breadcrumbs;
  };

  const formatSegmentLabel = (
    segment: string, 
    index: number, 
    allSegments: string[]
  ): string => {
    // Handle IDs and dynamic segments
    if (/^[0-9a-f-]{8,}$/i.test(segment) || /^\d+$/.test(segment)) {
      const previousSegment: string | undefined = allSegments[index - 1];
      const contextMap: Record<string, string> = {
        'project': 'Project Details',
        'projects': 'Project Details',
        'task': 'Task Details', 
        'tasks': 'Task Details',
        'team': 'Team Member',
        'user': 'User Profile',
      };
      
      return previousSegment ? (contextMap[previousSegment] || 'Details') : 'Details';
    }

    // Convert segments to proper labels
    const labelMap: Record<string, string> = {
      'project': 'project',
      'projects': 'project', 
      'tasks': 'tasks',
      'task': 'tasks',
      'team': 'team',
      'settings': 'settings',
      'profile': 'profile',
      'analytics': 'analytics',
    };

    return labelMap[segment.toLowerCase()] || segment
      .replace(/[-_]/g, ' ')
      .replace(/\w\S*/g, (txt: string) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  };

  const breadcrumbs: BreadcrumbItem[] = generateBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={`mb-6 ${className}`}>
      <BreadcrumbList>
        {breadcrumbs.map((crumb: BreadcrumbItem, index: number) => (
          <React.Fragment key={`${crumb.href}-${index}`}>
            <BreadcrumbItem>
              {crumb.isCurrentPage ? (
                <BreadcrumbPage className="text-white font-medium">
                  <div className="flex items-center">
                    {showHomeIcon && crumb.isHome && (
                      <HomeIcon className="w-4 h-4 mr-2" />
                    )}
                    <span className="font-mono text-sm">
                      {crumb.label}
                    </span>
                  </div>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link 
                    href={crumb.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    {showHomeIcon && crumb.isHome && (
                      <HomeIcon className="w-4 h-4 mr-2" />
                    )}
                    <span className="font-mono text-sm">
                      {crumb.label}
                    </span>
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator>
                <span className="text-gray-600 font-mono text-sm">/</span>
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default EnhancedBreadcrumbs;
export type { EnhancedBreadcrumbsProps, BreadcrumbItem, RouteConfig };
