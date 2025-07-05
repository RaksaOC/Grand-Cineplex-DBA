'use client';

import { useEffect, useState } from 'react';
import { MenuIcon, User } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import UsersManagement from '@/components/Users';
import RolesManagement from '@/components/Roles';
import Schema from '@/components/Schema';
import Backup from '@/components/Backup';
import Console from '@/components/Console';
import { Menu } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [user, setUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    const section = localStorage.getItem('activeSection');
    const user = localStorage.getItem('user');
    if (user) {
      setUser(user);
    } else {
      setUser('Unknown');
    }
    if (section) {
      setCurrentSection(section);
    }
  }, []);


  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('user');
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

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
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-4 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm p-2"><User className="w-6 h-6" /></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm text-left">{user}</span>
                    <p className="text-slate-400 text-xs text-left">Superuser</p>
                  </div>
                </div>
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-black border border-slate-700 rounded-lg shadow-lg focus:outline-none">
                <div className="p-4">
                  <div className="border-b border-slate-700 pb-3 mb-3">
                    <p className="text-slate-400 text-xs">Logged in as:</p>
                    <p className="text-white text-sm">{user}</p>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-slate-800' : ''
                          } text-red-500 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
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
