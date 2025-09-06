import { Inter } from 'next/font/google';
import AppSidebar from '@/components/dashboard/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SynergyWork Dashboard',
  description: 'Advanced Team Collaboration Platform',
};

export default function RootLayout({ children }:{children:any}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
         <SidebarProvider>
      <div className="flex h-screen bg-gray-900 w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
      </body>
    </html>
  );
}
