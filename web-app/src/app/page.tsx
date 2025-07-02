'use client';

import { useEffect, useState } from 'react';
import { Menu, User } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import UsersManagement from '@/components/Users';
import RolesManagement from '@/components/Roles';
import Schema from '@/components/Schema';
import Backup from '@/components/Backup';
import Console from '@/components/Console';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');

  useEffect(() => {
    const section = localStorage.getItem('activeSection');
    if (section) {
      setCurrentSection(section);
    }
  }, []);


  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersManagement />;
      case 'roles':
        return <RolesManagement />;
      case 'schemas':
        return <Schema />;
      case 'backup':
        return <Backup />;
      case 'console':
        return <Console />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Navigation */}
        <div className="bg-black backdrop-blur-sm border-b border-slate-700 sticky top-0 z-30 py-[1px]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white p-2 rounded-lg "
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4 border border-slate-700 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm p-2"><User className="w-6 h-6" /></span>
                </div>
                <div>
                  <span className="text-white font-bold text-sm">John Doe</span>
                  <p className="text-slate-400 text-xs">Database Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
