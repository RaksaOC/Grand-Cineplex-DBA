'use client';

import { Users, Shield, Database, DatabaseBackup } from 'lucide-react';

export default function Dashboard() {
    const stats = [
        {
            title: 'Total Users',
            value: '1,247',
            icon: Users,
            color: ''
        },
        {
            title: 'Active Roles',
            value: '8',
            icon: Shield,
            color: ''
        },
        {
            title: 'Database Size',
            value: '2.4 GB',
            icon: Database,
            color: ''
        },
        {
            title: 'Total Backups',
            value: '1',
            icon: DatabaseBackup,
            color: ''
        }
    ];

    const recentActivity = [
        { action: 'New user created', user: 'john.doe@cineplex.com', time: '2 minutes ago', type: 'success' },
        { action: 'Role permissions updated', user: 'admin@cineplex.com', time: '5 minutes ago', type: 'info' },
        { action: 'Database backup completed', user: 'system', time: '1 hour ago', type: 'success' },
        { action: 'Failed login attempt', user: 'unknown@cineplex.com', time: '2 hours ago', type: 'warning' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Database administration overview</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-black border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="bg-black border border-slate-700 rounded-xl">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-black border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
                                <div className={`w-3 h-3 rounded-full ${activity.type === 'success' ? 'bg-sky-400' :
                                    activity.type === 'warning' ? 'bg-yellow-400' :
                                        'bg-sky-400'
                                    }`}></div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">{activity.action}</p>
                                    <p className="text-slate-400 text-sm">{activity.user}</p>
                                </div>
                                <span className="text-slate-500 text-sm">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 