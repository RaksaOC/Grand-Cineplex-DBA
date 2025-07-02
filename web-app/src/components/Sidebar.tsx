'use client';

import { useEffect, useState } from 'react';
import {
    Users,
    Shield,
    Database,
    BarChart3,
    X,
    DatabaseBackup,
    ChartColumnStacked,
    Info,
    Terminal
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    onSectionChange?: (section: string) => void;
}

export default function Sidebar({ isOpen, onToggle, onSectionChange }: SidebarProps) {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const section = localStorage.getItem('activeSection');
        if (section) {
            setActiveSection(section);
        }
    }, []);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'users', label: 'Database Users', icon: Users },
        { id: 'roles', label: 'Roles & Privileges', icon: Shield },
        { id: 'backup', label: 'Backup Database', icon: DatabaseBackup },
        { id: 'schemas', label: 'Database Schema', icon: ChartColumnStacked },
        { id: 'console', label: 'Console', icon: Terminal }
    ];

    const handleSectionClick = (sectionId: string) => {
        setActiveSection(sectionId);
        onSectionChange?.(sectionId);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed top-0 left-0 h-full w-72  bg-black border-r border-slate-700 
        transform transition-transform duration-300 ease-in-out z-50 overflow-y-scroll scrollbar-hide
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-sky-500/20 border border-sky-500/30 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Grand Cineplex</h2>
                            <p className="text-slate-400 text-xs">Database Administration</p>
                        </div>
                    </div>
                    <button
                        onClick={onToggle}
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    handleSectionClick(item.id);
                                    localStorage.setItem('activeSection', item.id);
                                }}
                                className={`
                  w-full flex items-center space-x-3 px-4 py-6 rounded-lg
                  transition-all duration-200 text-left
                  ${activeSection === item.id
                                        ? 'bg-sky-500/20 border border-sky-500/30 text-white shadow-lg'
                                        : 'text-slate-300 hover:bg-black border border-slate-700 hover:border-slate-600 hover:text-white'
                                    }
                `}
                            >
                                <div className="flex items-center ">
                                    <div className={`space-x-2 p-2 border border-slate-700 rounded-lg `}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-sm ml-2">{item.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </>
    );
} 